import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { loginSchema, insertMemberSchema, insertCharityPreferenceSchema, insertBankingInformationSchema, insertMetalBusinessCardOrderSchema, insertSavingsAccountSchema, insertSavingsTransactionSchema, insertMagazineSubscriberSchema, memberPlaylists, prospects, insertProspectSchema, pocketBoosterWaitlist, type ChatMessage, type OnlinePresence, type CharitySearchResult, type CharitySearchResponse, TIER_REQUIREMENTS, AFFILIATE_TIERS, getTierFromSales, getCommissionRate, getCommissionAmount, getSpilloverRate, calculateEligibleBonuses, calculateSpilloverEligibility, isMembershipCurrent, isCommissionEligible, getDaysUntilCommissionEligible, getAccountStatus, getGracePeriodDaysRemaining, COMMISSION_TYPES, PERMANENT_RESIDUAL_RATE, COMMISSION_ELIGIBILITY_DAYS, ACCOUNT_GRACE_PERIOD_DAYS } from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";
import { sendWelcomeEmail } from "./services/email";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import { Client as ObjectStorageClient } from "@replit/object-storage";
import PDFDocument from "pdfkit";

// Replit Object Storage for permanent file storage  
// NOTE: Disabled until bucket is created in Replit App Storage
let objectStorage: ObjectStorageClient | null = null;
console.warn("⚠ Using local storage for profile pictures - will not persist across restarts");
console.warn("To enable permanent storage: Create a bucket in Replit App Storage first");

// Fallback: local storage if Object Storage is not available
const uploadDir = path.join(process.cwd(), "client/public/uploads/profile-pictures");
const certificatesDir = path.join(process.cwd(), "client/public/uploads/certificates");

// Configure multer for memory storage (we'll handle storage ourselves)
const storage_multer = multer.memoryStorage();

const upload = multer({ 
  storage: storage_multer,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Ensure upload directories exist
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.mkdir(certificatesDir, { recursive: true });
  
  // Stripe Payment Routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, productName, type } = req.body;
      
      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: productName,
              },
              unit_amount: Math.round(amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/store?success=true`,
        cancel_url: `${req.headers.origin}/store?canceled=true`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe payment error:", error);
      res.status(500).json({ message: "Error creating payment session: " + error.message });
    }
  });

  // Donation/Investment Payment Route
  app.post("/api/create-donation-session", async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || amount < 1) {
        return res.status(400).json({ message: "Invalid donation amount" });
      }
      
      // Create Stripe checkout session for donation
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'The FR2P Club Donation',
                description: 'Support the Financial Roadway 2 Prosperity community',
              },
              unit_amount: Math.round(amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/donate?success=true`,
        cancel_url: `${req.headers.origin}/donate?canceled=true`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Donation payment error:", error);
      res.status(500).json({ message: "Error creating donation session: " + error.message });
    }
  });

  // Membership Registration with Stripe Payment (Subscription for monthly, One-time for annual)
  // TWO-TIER PRICING:
  // Standard: $35/month or $350/year
  // Premium: $50/month or $500/year
  app.post("/api/create-membership-session", async (req, res) => {
    try {
      const { amount, productName, membershipPlan, membershipLevel, registrationData } = req.body;
      
      // Validate registration data
      const validatedData = insertMemberSchema.parse(registrationData);
      
      // Check if username or email already exists
      const existingUsername = await storage.getMemberByUsername(validatedData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getMemberByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Validate pricing on server-side to prevent tampering
      const isPremium = membershipLevel === 'premium';
      const expectedAmount = isPremium 
        ? (membershipPlan === 'annual' ? 500 : 50)
        : (membershipPlan === 'annual' ? 350 : 35);
      
      if (amount !== expectedAmount) {
        console.error(`Price mismatch: expected ${expectedAmount}, got ${amount}`);
        return res.status(400).json({ message: "Invalid pricing" });
      }
      
      // Store registration data in Stripe metadata (we'll create the account after payment)
      // Stripe metadata has 500 char limit per field, so split the data
      const metadata = {
        username: validatedData.username,
        email: validatedData.email,
        password: validatedData.password,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phoneNumber: validatedData.phoneNumber || '',
        address: validatedData.address || '',
        city: validatedData.city || '',
        state: validatedData.state || '',
        zipCode: validatedData.zipCode || '',
        referrerId: validatedData.referrerId || '',
        membershipPlan: membershipPlan,
        membershipLevel: membershipLevel || 'standard',
      };
      
      const tierLabel = isPremium ? 'Premium' : 'Standard';
      const unitAmountCents = amount * 100;
      
      // For monthly members: Create SUBSCRIPTION for recurring payments
      // For annual members: Create ONE-TIME payment
      if (membershipPlan === 'monthly') {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `The FR2P Club ${tierLabel} Monthly Membership`,
                  description: `Recurring ${tierLabel.toLowerCase()} membership - ${isPremium ? 'Includes KonnectMD Healthcare Access!' : 'Tier-based commissions $14-$20/referral!'}`,
                },
                unit_amount: unitAmountCents,
                recurring: {
                  interval: 'month',
                },
              },
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: `${req.headers.origin}/join/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.headers.origin}/join/${validatedData.referrerId || 'no-referrer'}?canceled=true`,
          metadata: metadata,
        });
        
        res.json({ url: session.url });
      } else {
        // Annual payment - one-time
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `The FR2P Club ${tierLabel} Annual Membership`,
                  description: `One-time annual ${tierLabel.toLowerCase()} payment - Save ${isPremium ? '$100' : '$70'}!`,
                },
                unit_amount: unitAmountCents,
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${req.headers.origin}/join/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.headers.origin}/join/${validatedData.referrerId || 'no-referrer'}?canceled=true`,
          metadata: metadata,
        });

        res.json({ url: session.url });
      }
    } catch (error: any) {
      console.error("Membership registration error:", error);
      res.status(500).json({ message: "Error creating membership session: " + error.message });
    }
  });

  // Handle successful membership payment and create account
  app.post("/api/complete-membership-registration", async (req, res) => {
    try {
      const { sessionId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Missing session ID" });
      }
      
      // Retrieve the checkout session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['subscription', 'customer']
      });
      
      if (session.payment_status !== 'paid') {
        return res.status(400).json({ message: "Payment not completed" });
      }
      
      // Extract registration data from metadata
      const metadata = session.metadata;
      if (!metadata) {
        return res.status(400).json({ message: "No registration data found" });
      }
      
      // Check if account was already created (in case of duplicate requests)
      const existingUsername = await storage.getMemberByUsername(metadata.username);
      if (existingUsername) {
        return res.json({ member: existingUsername, alreadyExists: true });
      }
      
      // Extract subscription ID - handle both string and expanded object
      const stripeSubscriptionId = metadata.membershipPlan === 'monthly' 
        ? (typeof session.subscription === 'string' 
            ? session.subscription 
            : session.subscription?.id || null)
        : null;
      
      // Create the member account
      const memberData = {
        username: metadata.username,
        email: metadata.email,
        password: metadata.password,
        firstName: metadata.firstName,
        lastName: metadata.lastName,
        phoneNumber: metadata.phoneNumber || null,
        address: metadata.address || null,
        city: metadata.city || null,
        state: metadata.state || null,
        zipCode: metadata.zipCode || null,
        referrerId: metadata.referrerId || null,
        membershipPlan: metadata.membershipPlan as 'monthly' | 'annual',
        level: 1,
        isActive: true,
        rank: "Affiliate",
        affiliateTier: "gold",
        totalSales: 0,
        bonusesEarned: 0,
        spilloverCommissions: 0,
        isActiveMember: true,
        membershipPaidUntil: new Date(Date.now() + (metadata.membershipPlan === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000),
        lastMembershipPayment: new Date(),
        stripeCustomerId: typeof session.customer === 'string' ? session.customer : session.customer?.id || null,
        stripeSubscriptionId: stripeSubscriptionId,
        subscriptionStatus: metadata.membershipPlan === 'monthly' ? 'active' : 'n/a',
      };
      
      const member = await storage.createMember(memberData);
      
      // PERMANENT RESIDUAL INCOME MODEL:
      // Lock in this referral permanently for the sponsor.
      // The sponsor earns $5/month FOREVER for this referral, even if this member later cancels.
      // Commissions are generated monthly via the batch process, not per-payment.
      if (member.referrerId) {
        const sponsor = await storage.getMember(member.referrerId);
        if (sponsor) {
          // Increment the sponsor's permanent referral count - this never decreases
          await storage.updateMember(sponsor.id, {
            permanentReferralCount: (sponsor.permanentReferralCount || 0) + 1,
          });
          
          // Create initial welcome commission ($5) so sponsor sees immediate reward
          await storage.createTransaction({
            memberId: sponsor.id,
            amount: 500, // $5 permanent residual commission
            type: "commission",
            commissionType: "direct",
            isRecurring: true,
            recurringSourceMemberId: member.id,
            commissionRate: 500,
            status: "holding",
            earnedAt: new Date(),
            availableAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30-day hold
            description: `Permanent residual commission locked in from ${member.firstName} ${member.lastName}`,
          });
          
          console.log(`🔒 Permanent referral locked in: ${sponsor.username} now has ${(sponsor.permanentReferralCount || 0) + 1} permanent referrals earning $5/month each FOREVER`);
        }
      }
      
      // Send welcome email with referral link
      const baseUrl = req.headers.origin || `http://localhost:5000`;
      const referralLink = `${baseUrl}/join/${member.username}`;
      
      try {
        await sendWelcomeEmail({
          email: member.email,
          firstName: member.firstName || '',
          lastName: member.lastName || '',
          username: member.username,
          memberNumber: member.memberNumber || 0,
          isFoundingMember: member.isFoundingMember || false,
          referralLink: referralLink,
        });
      } catch (emailError) {
        console.error("Failed to send welcome email, but member was created:", emailError);
        // Don't fail the registration if email fails
      }
      
      res.json({ member, success: true });
    } catch (error: any) {
      console.error("Complete registration error:", error);
      res.status(500).json({ message: "Error completing registration: " + error.message });
    }
  });

  // Stripe Webhook Handler for Recurring Commission Automation
  // IMPORTANT: This endpoint needs raw body for signature verification
  app.post("/api/webhooks/stripe", express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    if (!sig) {
      return res.status(400).send('No signature provided');
    }
    
    let event: Stripe.Event;
    
    try {
      // Verify webhook signature with Stripe (SECURITY: Prevents forged webhook requests)
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      if (!webhookSecret) {
        console.error('⚠️  WARNING: STRIPE_WEBHOOK_SECRET not set - webhook signature verification disabled!');
        // In development, allow unsigned requests (NOT SAFE FOR PRODUCTION)
        event = JSON.parse(req.body.toString());
      } else {
        // Production: Verify signature
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          webhookSecret
        );
      }
      
      // Handle the event
      switch (event.type) {
        case 'invoice.payment_succeeded':
          // Monthly subscription payment succeeded - Update member status
          // NOTE: Commissions are NO LONGER tied to individual payments.
          // Under the Permanent Residual Income Model, commissions are generated monthly
          // via the batch process for ALL locked-in referrals, regardless of referral retention.
          const invoice = event.data.object as Stripe.Invoice;
          
          if (invoice.billing_reason === 'subscription_cycle' && invoice.subscription) {
            const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : (invoice.subscription as any).id;
            const allMembers = await storage.getAllMembers();
            const member = allMembers.find(m => m.stripeSubscriptionId === subscriptionId);
            
            if (member) {
              // Update member's last payment date and membershipPaidUntil
              await storage.updateMember(member.id, {
                lastMembershipPayment: new Date(),
                membershipPaidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              });
              console.log(`✅ Payment received from ${member.username} - membership renewed`);
            }
          }
          break;
          
        case 'customer.subscription.deleted':
          // Subscription canceled - Update member status
          const deletedSubscription = event.data.object as Stripe.Subscription;
          const allMembersForDelete = await storage.getAllMembers();
          const canceledMember = allMembersForDelete.find(m => m.stripeSubscriptionId === deletedSubscription.id);
          
          if (canceledMember) {
            await storage.updateMember(canceledMember.id, {
              subscriptionStatus: 'canceled',
              isActive: false,
            });
            console.log(`❌ Subscription canceled for ${canceledMember.username}`);
          }
          break;
          
        case 'customer.subscription.updated':
          // Subscription status changed
          const updatedSubscription = event.data.object as Stripe.Subscription;
          const allMembersForUpdate = await storage.getAllMembers();
          const updatedMember = allMembersForUpdate.find(m => m.stripeSubscriptionId === updatedSubscription.id);
          
          if (updatedMember) {
            await storage.updateMember(updatedMember.id, {
              subscriptionStatus: updatedSubscription.status,
            });
            console.log(`🔄 Subscription status updated for ${updatedMember.username}: ${updatedSubscription.status}`);
          }
          break;
          
        case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session;
          const meta = session.metadata || {};

          if (meta.listingType === "guest") {
            // Create guest business listing after payment
            const now = new Date();
            let featuredUntil: Date | null = null;
            let packageType = meta.packageType;

            if (meta.packageType === "guest_featured_weekly") {
              featuredUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            } else if (meta.packageType === "guest_featured_monthly") {
              featuredUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            } else if (meta.packageType === "guest_basic") {
              featuredUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            }

            await storage.createBusinessListing({
              listingType: "guest",
              memberId: null,
              advertiserName: meta.advertiserName || "",
              advertiserEmail: meta.advertiserEmail || "",
              businessName: meta.businessName || "Business",
              tagline: meta.tagline || "",
              description: meta.description || "",
              category: meta.category || "Other",
              website: meta.website || "",
              phone: meta.phone || "",
              email: meta.email || "",
              city: meta.city || "",
              state: meta.state || "",
              weeklyPromo: meta.weeklyPromo || "",
              packageType: packageType || "guest_basic",
              featuredUntil: featuredUntil,
              stripePaymentId: session.payment_intent as string || "",
              isActive: true,
            });
            console.log(`✅ Guest ad listing created for ${meta.businessName}`);
          } else if (meta.listingType === "member" && meta.memberId) {
            // Update member listing featured status after payment
            const existing = await storage.getBusinessListingByMember(meta.memberId);
            if (existing) {
              const now = new Date();
              const featuredUntil = meta.packageType === "featured_weekly"
                ? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
              await storage.updateBusinessListing(existing.id, {
                packageType: meta.packageType,
                featuredUntil,
                stripePaymentId: session.payment_intent as string || "",
              });
              console.log(`✅ Member listing upgraded for ${meta.memberId}`);
            }
          }
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
      
      res.json({ received: true });
    } catch (err: any) {
      console.error('Webhook error:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });

  // Search for referrers by name, email, or phone
  app.get("/api/stats/public", async (req, res) => {
    try {
      const allMembers = await storage.getAllMembers();
      res.json({
        totalMembers: allMembers.length,
        foundingMembersLeft: Math.max(0, 500 - allMembers.filter(m => m.isFoundingMember).length),
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Founding 50 status — how many free spots have been claimed
  app.get("/api/founding-fifty-status", async (req, res) => {
    try {
      const allMembers = await storage.getAllMembers();
      const claimed = allMembers.filter(m => m.isFounding50Member).length;
      const spotsLeft = Math.max(0, 50 - claimed);
      res.json({ claimed, spotsLeft, total: 50, isFull: spotsLeft === 0 });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Free registration — Founding 50 (no Stripe, 30-day trial)
  app.post("/api/auth/register-founding50", async (req, res) => {
    try {
      const allMembers = await storage.getAllMembers();
      const claimed = allMembers.filter(m => m.isFounding50Member).length;

      if (claimed >= 50) {
        return res.status(400).json({ message: "All 50 free founding spots have been claimed. Please join with a paid membership." });
      }

      const { username, email, password, firstName, lastName, phoneNumber, address, city, state, zipCode, referrerId, membershipLevel } = req.body;

      if (!username || !email || !password || !firstName || !lastName || !phoneNumber || !address || !city || !state || !zipCode) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const existingUsername = await storage.getMemberByUsername(username);
      if (existingUsername) return res.status(400).json({ message: "Username already taken." });

      const existingEmail = await storage.getMemberByEmail(email);
      if (existingEmail) return res.status(400).json({ message: "Email already registered." });

      const trialEnds = new Date();
      trialEnds.setDate(trialEnds.getDate() + 30);

      const member = await storage.createMember({
        username,
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        address,
        city,
        state,
        zipCode,
        referrerId: referrerId || null,
        membershipPlan: "monthly",
        membershipLevel: membershipLevel || "standard",
        isActive: true,
        isFoundingMember: true,
        isFounding50Member: true,
        founding50TrialEnds: trialEnds,
        membershipPaidUntil: trialEnds,
        subscriptionStatus: "trial",
        rank: "Affiliate",
        level: 1,
        totalSales: 0,
        affiliateTier: "bronze",
        bonusesEarned: 0,
        spilloverCommissions: 0,
        permanentReferralCount: 0,
        isActiveMember: true,
      });

      // Send welcome email
      try {
        const { sendWelcomeEmail } = await import("./services/email");
        const baseUrl = req.headers.origin || 'https://fr2pclub.replit.app';
        const referralLink = `${baseUrl}/join/${member.username}`;
        await sendWelcomeEmail({
          email: member.email,
          firstName: member.firstName || '',
          lastName: member.lastName || '',
          username: member.username,
          memberNumber: member.memberNumber || 0,
          isFoundingMember: member.isFoundingMember || true,
          referralLink: referralLink,
        });
      } catch (emailError) {
        console.error("Welcome email failed:", emailError);
      }

      res.status(201).json({
        message: "Welcome to The FR2P Club! Your 30-day free founding membership is now active.",
        member: { id: member.id, username: member.username, firstName: member.firstName, memberNumber: member.memberNumber },
        spotsRemaining: Math.max(0, 49 - claimed),
      });
    } catch (error: any) {
      console.error("Founding 50 registration error:", error);
      res.status(500).json({ message: error.message || "Registration failed. Please try again." });
    }
  });

  app.get("/api/search-referrers", async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string' || query.trim().length < 2) {
        return res.json({ members: [] });
      }
      
      const searchTerm = query.trim().toLowerCase();
      const allMembers = await storage.getAllMembers();
      
      // Search by first name, last name, email, phone, or username
      const matches = allMembers.filter(member => {
        const firstName = member.firstName?.toLowerCase() || '';
        const lastName = member.lastName?.toLowerCase() || '';
        const fullName = `${firstName} ${lastName}`;
        const email = member.email?.toLowerCase() || '';
        const phone = member.phoneNumber?.toLowerCase().replace(/\D/g, '') || '';
        const username = member.username?.toLowerCase() || '';
        const searchPhone = searchTerm.replace(/\D/g, '');
        
        return (
          firstName.includes(searchTerm) ||
          lastName.includes(searchTerm) ||
          fullName.includes(searchTerm) ||
          email.includes(searchTerm) ||
          username.includes(searchTerm) ||
          (searchPhone.length >= 3 && phone.includes(searchPhone))
        );
      });
      
      // Return limited results with safe data (no passwords)
      const results = matches.slice(0, 10).map(member => ({
        id: member.id,
        username: member.username,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phoneNumber: member.phoneNumber,
        profilePicture: member.profilePicture,
        rank: member.rank,
        isFoundingMember: member.isFoundingMember,
        memberNumber: member.memberNumber,
      }));
      
      res.json({ members: results });
    } catch (error: any) {
      console.error("Search referrers error:", error);
      res.status(500).json({ message: "Error searching referrers" });
    }
  });

  // Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const member = await storage.getMemberByUsername(username);
      
      if (!member || member.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const accountStatus = getAccountStatus(member);
      
      if (accountStatus === 'expired') {
        return res.status(403).json({ 
          message: "Your account has been inactive for more than 90 days. Please rejoin as a new member to continue.",
          accountStatus: 'expired',
          gracePeriodExpired: true
        });
      }

      const gracePeriodDaysRemaining = getGracePeriodDaysRemaining(member);
      const commissionEligible = isCommissionEligible(member);
      const daysUntilCommissionEligible = getDaysUntilCommissionEligible(member);
      
      res.json({ 
        member,
        accountStatus,
        gracePeriodDaysRemaining,
        commissionEligible,
        daysUntilCommissionEligible
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const memberData = insertMemberSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUsername = await storage.getMemberByUsername(memberData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getMemberByEmail(memberData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const member = await storage.createMember(memberData);
      res.status(201).json({ member });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Dashboard data
  app.get("/api/dashboard/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const dashboardData = await storage.getDashboardData(memberId);
      
      if (!dashboardData) {
        return res.status(404).json({ message: "Member not found" });
      }

      const member = dashboardData.member;
      const commissionEligible = isCommissionEligible(member);
      const daysUntilCommissionEligible = getDaysUntilCommissionEligible(member);
      const accountStatus = getAccountStatus(member);
      const gracePeriodDaysRemaining = getGracePeriodDaysRemaining(member);
      
      res.json({
        ...dashboardData,
        commissionEligible,
        daysUntilCommissionEligible,
        accountStatus,
        gracePeriodDaysRemaining,
      });
    } catch (error) {
      console.error("Dashboard API error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Network data
  app.get("/api/network/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const stats = await storage.getAffiliateStats(memberId);
      
      if (!stats) {
        return res.status(404).json({ message: "Affiliate stats not found" });
      }
      
      const directReferrals = await storage.getDirectReferrals(memberId);
      
      res.json({
        stats,
        directReferrals,
        levels: [
          { level: 1, count: stats.level1Count, calculation: "Your direct referrals" },
          { level: 2, count: stats.level2Count, calculation: `${stats.level1Count} × 5 = ${stats.level2Count}` },
          { level: 3, count: stats.level3Count, calculation: `${stats.level2Count} × 5 = ${stats.level3Count}` },
          { level: 4, count: stats.level4Count, calculation: `${stats.level3Count} × 5 = ${stats.level4Count}` },
          { level: 5, count: stats.level5Count, calculation: `${stats.level4Count} × 5 = ${stats.level5Count}` },
        ]
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ═══════════════════════════════════════════════════════════════════
  // PERMANENT RESIDUAL INCOME - Monthly Commission Generation
  // ═══════════════════════════════════════════════════════════════════
  app.post("/api/admin/send-welcome-email", async (req, res) => {
    try {
      const { email, firstName, lastName, username, memberNumber, isFoundingMember, referralLink } = req.body;
      const { sendWelcomeEmail } = await import("./services/email");
      await sendWelcomeEmail({ email, firstName, lastName, username, memberNumber, isFoundingMember, referralLink });
      res.json({ success: true, message: `Welcome email sent to ${email}` });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // This endpoint generates monthly $5 residual commissions for ALL members
  // based on their permanentReferralCount. Referrals are locked in forever.
  // Even if a referred member cancels, the sponsor keeps earning $5/month.
  // This should be called monthly via a cron job or scheduled task.
  app.post("/api/admin/generate-monthly-commissions", async (req, res) => {
    try {
      const allMembers = await storage.getAllMembers();
      let commissionsGenerated = 0;
      let totalAmount = 0;
      const results: Array<{ memberId: string; username: string; referralCount: number; amount: number }> = [];

      let skippedNotEligible = 0;

      for (const member of allMembers) {
        const referralCount = member.permanentReferralCount || 0;
        if (referralCount > 0) {
          // Commission Eligibility: Must be enrolled for 60+ days (2 paid months)
          // "Separating the curious from the serious"
          if (!isCommissionEligible(member)) {
            const daysRemaining = getDaysUntilCommissionEligible(member);
            console.log(`⏳ Skipping ${member.username} - not yet eligible for commissions (${daysRemaining} days remaining)`);
            skippedNotEligible++;
            continue;
          }

          const monthlyCommission = PERMANENT_RESIDUAL_RATE * referralCount; // $5 × number of permanent referrals

          await storage.createTransaction({
            memberId: member.id,
            amount: monthlyCommission,
            type: "commission",
            commissionType: "direct",
            isRecurring: true,
            recurringSourceMemberId: null,
            commissionRate: PERMANENT_RESIDUAL_RATE,
            status: "holding",
            earnedAt: new Date(),
            availableAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30-day hold
            description: `Monthly permanent residual income: $${(monthlyCommission / 100).toFixed(2)} ($5 × ${referralCount} locked-in referrals)`,
          });

          commissionsGenerated++;
          totalAmount += monthlyCommission;
          results.push({
            memberId: member.id,
            username: member.username,
            referralCount,
            amount: monthlyCommission,
          });

          console.log(`💰 Generated $${(monthlyCommission / 100).toFixed(2)} permanent residual for ${member.username} (${referralCount} referrals)`);
        }
      }

      res.json({
        success: true,
        message: `Generated permanent residual commissions for ${commissionsGenerated} members${skippedNotEligible > 0 ? ` (${skippedNotEligible} skipped - not yet eligible, need 60 days enrollment)` : ''}`,
        totalAmount: totalAmount / 100,
        commissionsGenerated,
        skippedNotEligible,
        results,
      });
    } catch (error: any) {
      console.error("Monthly commission generation error:", error);
      res.status(500).json({ message: "Error generating monthly commissions: " + error.message });
    }
  });

  // Get permanent residual income status for a member
  app.get("/api/members/:id/residual-income", async (req, res) => {
    try {
      const member = await storage.getMember(req.params.id);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }

      const permanentReferrals = member.permanentReferralCount || 0;
      const monthlyResidual = (PERMANENT_RESIDUAL_RATE * permanentReferrals) / 100;
      const yearlyResidual = monthlyResidual * 12;

      res.json({
        permanentReferrals,
        currentRate: PERMANENT_RESIDUAL_RATE / 100, // $5
        monthlyResidual,
        yearlyResidual,
        message: permanentReferrals > 0
          ? `You earn $${monthlyResidual.toFixed(2)}/month FOREVER from ${permanentReferrals} locked-in referral${permanentReferrals > 1 ? 's' : ''}. This never stops, even if they cancel.`
          : `Refer your first member to start earning $5/month permanent residual income. Once locked in, it never stops!`,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching residual income: " + error.message });
    }
  });

  // Calculator endpoint with tiered commission structure (3-tier system)
  app.post("/api/calculator/potential", async (req, res) => {
    try {
      const { directReferrals, currentTier } = z.object({
        directReferrals: z.number().int().min(1),
        currentTier: z.string().optional().default("gold")
      }).parse(req.body);
      
      // Calculate network size at each level (5-tier system)
      const level1Count = directReferrals;
      const level2Count = directReferrals * 5;
      const level3Count = level2Count * 5;
      const level4Count = level3Count * 5;
      const level5Count = level4Count * 5;
      
      const totalReferrals = level1Count + level2Count + level3Count + level4Count + level5Count;
      
      // Calculate potential commissions for each tier
      const tierProjections = Object.entries(TIER_REQUIREMENTS).map(([tierKey, tierInfo]) => {
        const personalSalesRate = 0.10; // 10% conversion rate
        const networkOverrideRate = 0.05; // 5% network override
        
        const personalSales = Math.round(level1Count * personalSalesRate);
        const networkOverrideSales = Math.round((level2Count + level3Count + level4Count + level5Count) * networkOverrideRate);
        const estimatedMonthlySales = personalSales + networkOverrideSales;
        
        const potentialMonthlyCommissions = estimatedMonthlySales * tierInfo.commissionRate;
        const potentialYearlyCommissions = potentialMonthlyCommissions * 12;
        
        return {
          tier: tierKey,
          tierName: tierInfo.name,
          commissionRate: tierInfo.commissionRate,
          minSales: tierInfo.minSales,
          maxSales: tierInfo.maxSales === Infinity ? "unlimited" : tierInfo.maxSales,
          monthlyCommissions: potentialMonthlyCommissions,
          yearlyCommissions: potentialYearlyCommissions,
          estimatedMonthlySales
        };
      });
      
      // Current tier projection
      const currentTierInfo = TIER_REQUIREMENTS[currentTier as keyof typeof TIER_REQUIREMENTS] || TIER_REQUIREMENTS.gold;
      const personalSalesRate = 0.10;
      const networkOverrideRate = 0.05;
      const personalSales = Math.round(level1Count * personalSalesRate);
      const networkOverrideSales = Math.round((level2Count + level3Count + level4Count + level5Count) * networkOverrideRate);
      const estimatedMonthlySales = personalSales + networkOverrideSales;
      
      res.json({
        directReferrals,
        totalReferrals,
        currentTier,
        estimatedMonthlySales,
        tierProjections,
        levels: {
          level1: level1Count,
          level2: level2Count,
          level3: level3Count,
          level4: level4Count,
          level5: level5Count,
        }
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Member profile
  app.get("/api/member/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const member = await storage.getMember(memberId);
      
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      res.json({ member });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/member/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const updates = req.body;
      
      const updatedMember = await storage.updateMember(memberId, updates);
      
      if (!updatedMember) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      res.json({ member: updatedMember });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Network growth statistics
  app.get("/api/network-growth/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Get all members (for owner/admin view)
      const allMembers = await storage.getAllMembers();
      
      // Sort by join date (newest first)
      const sortedMembers = allMembers
        .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
      
      // Get recent joins
      const recentJoins = sortedMembers.slice(0, limit).map(member => ({
        id: member.id,
        name: `${member.firstName} ${member.lastName}`,
        email: member.email,
        joinDate: member.joinDate,
        memberNumber: member.memberNumber,
        isFoundingMember: member.isFoundingMember,
      }));
      
      res.json({
        totalMembers: allMembers.length,
        foundingMembers: allMembers.filter(m => m.isFoundingMember).length,
        recentJoins,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Transactions
  app.get("/api/transactions/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const transactions = await storage.getTransactions(memberId);
      
      res.json({ transactions });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Tier information
  app.get("/api/tier/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const tierInfo = await storage.getTierInfo(memberId);
      
      if (!tierInfo) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      res.json(tierInfo);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Record a sale
  app.post("/api/sale/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const { saleAmount } = z.object({
        saleAmount: z.number().optional().default(5000)
      }).parse(req.body);
      
      const result = await storage.recordSale(memberId, saleAmount);
      
      res.json({
        member: result.member,
        bonusesAwarded: result.bonusesAwarded,
        message: result.bonusesAwarded.length > 0 
          ? `Sale recorded! You've earned ${result.bonusesAwarded.length} bonus(es)!`
          : "Sale recorded successfully!"
      });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
    }
  });
  
  // Get tier requirements
  app.get("/api/tiers", async (req, res) => {
    try {
      res.json({
        tiers: TIER_REQUIREMENTS,
        affiliateTiers: AFFILIATE_TIERS
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Charity search routes
  app.get("/api/charities/search", async (req, res) => {
    try {
      const { q = "", letter = "", state = "", page = "1", pageSize = "20" } = req.query;
      
      // Build search URL for ProPublica API
      let searchUrl = "https://projects.propublica.org/nonprofits/api/v2/search.json";
      const params = new URLSearchParams();
      
      if (q && typeof q === "string") {
        params.append("q", q);
      }
      
      if (letter && typeof letter === "string") {
        params.append("q", letter + "*"); // Search for names starting with letter
      }
      
      if (state && typeof state === "string") {
        params.append("state", state);
      }
      
      // Set page (ProPublica uses 0-based indexing)
      const pageNum = Math.max(0, parseInt(page as string) - 1);
      params.append("page", pageNum.toString());
      
      if (params.toString()) {
        searchUrl += "?" + params.toString();
      }
      
      // Fetch from ProPublica API
      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error(`ProPublica API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform ProPublica response to our format
      const organizations: CharitySearchResult[] = (data.organizations || []).map((org: any) => ({
        ein: org.ein,
        name: org.name,
        city: org.city || undefined,
        state: org.state || undefined,
        website: org.website || undefined,
        category: org.ntee_code || undefined,
        revenue: org.revenue_amount || undefined,
        assets: org.asset_amount || undefined,
      }));
      
      const searchResponse: CharitySearchResponse = {
        organizations,
        total: data.total_results || organizations.length,
        page: parseInt(page as string),
        pageSize: parseInt(pageSize as string),
        hasNextPage: organizations.length === parseInt(pageSize as string),
      };
      
      res.json(searchResponse);
    } catch (error) {
      console.error("Charity search error:", error);
      res.status(500).json({ message: "Failed to search charities" });
    }
  });

  // Get charity preference for member
  app.get("/api/member/:memberId/charity", async (req, res) => {
    try {
      const { memberId } = req.params;
      const preference = await storage.getCharityPreference(memberId);
      
      res.json({ preference });
    } catch (error) {
      console.error("Get charity preference error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Set charity preference for member
  app.post("/api/member/:memberId/charity", async (req, res) => {
    try {
      const { memberId } = req.params;
      const preferenceData = { ...req.body, memberId };
      
      const validatedPreference = insertCharityPreferenceSchema.parse(preferenceData);
      const preference = await storage.setCharityPreference(validatedPreference);
      
      res.json({ preference });
    } catch (error) {
      console.error("Set charity preference error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid preference data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Profile picture upload
  app.post("/api/members/:memberId/profile-picture", upload.single('profilePicture'), async (req, res) => {
    try {
      const { memberId } = req.params;
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      let relativePath: string;
      
      if (objectStorage) {
        // Use Object Storage (permanent)
        const filename = `profile-pictures/${memberId}-${Date.now()}${path.extname(req.file.originalname)}`;
        await objectStorage.uploadFromBytes(filename, req.file.buffer);
        relativePath = `/api/profile-pictures/${filename}`;
      } else {
        // Fallback: local storage (temporary)
        const filename = `${memberId}-${Date.now()}${path.extname(req.file.originalname)}`;
        const filepath = path.join(uploadDir, filename);
        await fs.writeFile(filepath, req.file.buffer);
        relativePath = `/uploads/profile-pictures/${filename}`;
      }
      
      // Update member's profile picture in storage
      const updatedMember = await storage.updateProfilePicture(memberId, relativePath);
      
      if (!updatedMember) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      res.json({ 
        message: "Profile picture uploaded successfully",
        profilePicture: relativePath,
        member: updatedMember
      });
    } catch (error) {
      console.error("Profile picture upload error:", error);
      res.status(500).json({ message: "Upload failed" });
    }
  });

  // Serve profile pictures from Object Storage
  app.get("/api/profile-pictures/:filename", async (req, res) => {
    try {
      if (!objectStorage) {
        return res.status(404).json({ message: "Object storage not available" });
      }
      
      const { filename } = req.params;
      const result = await objectStorage.downloadAsBytes(`profile-pictures/${filename}`);
      
      if (!result.ok) {
        return res.status(404).json({ message: "Profile picture not found" });
      }
      
      const fileBuffer = result.value;
      
      // Determine content type based on file extension
      const ext = path.extname(filename).toLowerCase();
      const contentTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
      };
      const contentType = contentTypes[ext] || 'application/octet-stream';
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
      res.send(Buffer.from(fileBuffer));
    } catch (error) {
      console.error("Profile picture serve error:", error);
      res.status(404).json({ message: "Profile picture not found" });
    }
  });

  // Delete profile picture
  app.delete("/api/members/:memberId/profile-picture", async (req, res) => {
    try {
      const { memberId } = req.params;
      
      const member = await storage.getMember(memberId);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      // Remove the profile picture file if it exists
      if (member.profilePicture) {
        const filePath = path.join(process.cwd(), "client/public", member.profilePicture);
        await fs.unlink(filePath).catch(() => {}); // Ignore errors if file doesn't exist
      }
      
      // Update member to remove profile picture
      const updatedMember = await storage.updateProfilePicture(memberId, "");
      
      res.json({ 
        message: "Profile picture removed successfully",
        member: updatedMember
      });
    } catch (error) {
      console.error("Profile picture deletion error:", error);
      res.status(500).json({ message: "Deletion failed" });
    }
  });

  // Banking information routes
  
  // Get banking information for member
  app.get("/api/members/:memberId/banking", async (req, res) => {
    try {
      const { memberId } = req.params;
      const bankingInfo = await storage.getBankingInformation(memberId);
      
      res.json({ bankingInformation: bankingInfo });
    } catch (error) {
      console.error("Get banking information error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Set/Update banking information for member
  app.post("/api/members/:memberId/banking", async (req, res) => {
    try {
      const { memberId } = req.params;
      const bankingData = { ...req.body, memberId };
      
      const validatedBanking = insertBankingInformationSchema.parse(bankingData);
      const bankingInfo = await storage.setBankingInformation(validatedBanking);
      
      res.json({ 
        message: "Banking information saved successfully",
        bankingInformation: bankingInfo 
      });
    } catch (error) {
      console.error("Set banking information error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid banking information", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Delete banking information for member
  app.delete("/api/members/:memberId/banking", async (req, res) => {
    try {
      const { memberId } = req.params;
      const deleted = await storage.deleteBankingInformation(memberId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Banking information not found" });
      }
      
      res.json({ message: "Banking information removed successfully" });
    } catch (error) {
      console.error("Delete banking information error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Metal Business Card Order Routes
  app.post("/api/metal-business-cards/orders", async (req, res) => {
    try {
      const validatedOrder = insertMetalBusinessCardOrderSchema.parse(req.body);
      const order = await storage.createMetalBusinessCardOrder(validatedOrder);
      
      res.json({
        success: true,
        order,
        message: "Metal business card order created successfully"
      });
    } catch (error) {
      console.error("Error creating metal business card order:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid order data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/metal-business-cards/orders/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const orders = await storage.getMetalBusinessCardOrders(memberId);
      
      res.json({
        success: true,
        orders
      });
    } catch (error) {
      console.error("Error fetching metal business card orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/metal-business-cards/orders", async (req, res) => {
    try {
      const orders = await storage.getAllMetalBusinessCardOrders();
      
      res.json({
        success: true,
        orders: orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      });
    } catch (error) {
      console.error("Error fetching all metal business card orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.put("/api/metal-business-cards/orders/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const updates = req.body;
      
      const updatedOrder = await storage.updateMetalBusinessCardOrder(orderId, updates);
      
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json({
        success: true,
        order: updatedOrder,
        message: "Order updated successfully"
      });
    } catch (error) {
      console.error("Error updating metal business card order:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  app.get("/api/metal-business-cards/orders/details/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await storage.getMetalBusinessCardOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json({
        success: true,
        order
      });
    } catch (error) {
      console.error("Error fetching metal business card order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Financial Asset Savings Routes
  app.get("/api/savings/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const account = await storage.getSavingsAccount(memberId);
      const balance = await storage.getSavingsBalance(memberId);
      const canWithdraw = await storage.canWithdrawFromSavings(memberId);
      const transactions = await storage.getSavingsTransactions(memberId);
      
      res.json({
        success: true,
        account: account || null,
        balance,
        canWithdraw,
        transactions: transactions.slice(0, 20) // Last 20 transactions
      });
    } catch (error) {
      console.error("Error fetching Financial Asset Savings:", error);
      res.status(500).json({ message: "Failed to fetch Financial Asset Savings" });
    }
  });

  app.get("/api/savings/:memberId/balance", async (req, res) => {
    try {
      const { memberId } = req.params;
      const balance = await storage.getSavingsBalance(memberId);
      
      res.json({
        success: true,
        balance,
        balanceFormatted: `$${(balance / 100).toFixed(2)}`
      });
    } catch (error) {
      console.error("Error fetching savings balance:", error);
      res.status(500).json({ message: "Failed to fetch savings balance" });
    }
  });

  app.get("/api/savings/:memberId/transactions", async (req, res) => {
    try {
      const { memberId } = req.params;
      const transactions = await storage.getSavingsTransactions(memberId);
      
      res.json({
        success: true,
        transactions
      });
    } catch (error) {
      console.error("Error fetching savings transactions:", error);
      res.status(500).json({ message: "Failed to fetch savings transactions" });
    }
  });

  app.post("/api/savings/:memberId/withdraw", async (req, res) => {
    try {
      const { memberId } = req.params;
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid withdrawal amount" });
      }
      
      const amountInCents = Math.round(amount * 100); // Convert dollars to cents
      const result = await storage.processAnnualWithdrawal(memberId, amountInCents);
      
      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          transaction: result.transaction
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      res.status(500).json({ message: "Failed to process withdrawal" });
    }
  });

  app.get("/api/savings/:memberId/withdrawal-eligibility", async (req, res) => {
    try {
      const { memberId } = req.params;
      const canWithdraw = await storage.canWithdrawFromSavings(memberId);
      const account = await storage.getSavingsAccount(memberId);
      
      res.json({
        success: true,
        canWithdraw,
        nextWithdrawalDate: account?.nextWithdrawalDate || null,
        lastWithdrawalDate: account?.lastWithdrawalDate || null
      });
    } catch (error) {
      console.error("Error checking withdrawal eligibility:", error);
      res.status(500).json({ message: "Failed to check withdrawal eligibility" });
    }
  });

  app.post("/api/savings/:memberId/create", async (req, res) => {
    try {
      const { memberId } = req.params;
      
      // Check if account already exists
      const existingAccount = await storage.getSavingsAccount(memberId);
      if (existingAccount) {
        return res.json({
          success: true,
          account: existingAccount,
          message: "Financial Asset Savings already exists"
        });
      }
      
      const account = await storage.createSavingsAccount({
        memberId,
        balance: 0,
        totalDeposited: 0,
        totalWithdrawn: 0,
        lastWithdrawalDate: null,
        nextWithdrawalDate: null,
      });
      
      res.json({
        success: true,
        account,
        message: "Financial Asset Savings created successfully"
      });
    } catch (error) {
      console.error("Error creating Financial Asset Savings:", error);
      res.status(500).json({ message: "Failed to create Financial Asset Savings" });
    }
  });

  // Achievement Routes
  app.get("/api/achievements/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const achievements = await storage.getMemberAchievements(memberId);
      const member = await storage.getMember(memberId);
      
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      // Return achievements with member name for certificate personalization
      res.json({
        success: true,
        achievements: achievements.map(achievement => ({
          ...achievement,
          memberName: `${member.firstName} ${member.lastName}`,
          tierName: achievement.tier.charAt(0).toUpperCase() + achievement.tier.slice(1),
        }))
      });
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.post("/api/achievements/:memberId/check", async (req, res) => {
    try {
      const { memberId } = req.params;
      const newAchievements = await storage.checkAndAwardAchievements(memberId);
      
      res.json({
        success: true,
        newAchievements,
        message: newAchievements.length > 0 
          ? `Congratulations! You've earned ${newAchievements.length} new achievement(s)!`
          : "No new achievements at this time."
      });
    } catch (error) {
      console.error("Error checking achievements:", error);
      res.status(500).json({ message: "Failed to check achievements" });
    }
  });

  // Upload certificate background template (admin only)
  app.post("/api/admin/certificates/:tier/upload", upload.single("certificate"), async (req, res) => {
    try {
      const { tier } = req.params;
      const allowedTiers = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
      
      if (!allowedTiers.includes(tier)) {
        return res.status(400).json({ message: "Invalid tier" });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Save certificate background with tier-specific filename to dedicated certificates directory
      const filename = `${tier}_certificate.png`;
      const filepath = path.join(certificatesDir, filename);
      await fs.writeFile(filepath, req.file.buffer);
      
      res.json({ 
        success: true,
        message: `${tier.charAt(0).toUpperCase() + tier.slice(1)} certificate template uploaded successfully`,
        tier,
        filename
      });
    } catch (error) {
      console.error("Error uploading certificate template:", error);
      res.status(500).json({ message: "Failed to upload certificate template" });
    }
  });

  // Generate PDF certificate with Canva background or fallback to coded design
  app.get("/api/achievements/:memberId/certificate/:tier", async (req, res) => {
    try {
      const { memberId, tier } = req.params;
      const member = await storage.getMember(memberId);
      
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      const achievements = await storage.getMemberAchievements(memberId);
      const achievement = achievements.find(a => a.tier === tier);
      
      if (!achievement) {
        return res.status(404).json({ message: "Achievement not found" });
      }
      
      // Check if custom certificate background exists in dedicated certificates directory
      const certificateBackgroundPath = path.join(certificatesDir, `${tier}_certificate.png`);
      let hasCustomBackground = false;
      try {
        await fs.access(certificateBackgroundPath);
        hasCustomBackground = true;
      } catch {
        hasCustomBackground = false;
      }
      
      const doc = new PDFDocument({ size: 'LETTER', layout: 'landscape' });
      
      // Set response headers for PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=FR2P_${tier}_Certificate_${member.firstName}_${member.lastName}.pdf`);
      
      // Pipe the PDF to response
      doc.pipe(res);
      
      // Define tier-specific colors and visual elements
      const tierColors: Record<string, { primary: string; accent: string; name: string }> = {
        bronze: { primary: '#CD7F32', accent: '#B8732D', name: 'Bronze' },
        silver: { primary: '#C0C0C0', accent: '#A8A8A8', name: 'Silver' },
        gold: { primary: '#FFD700', accent: '#FFC700', name: 'Gold' },
        platinum: { primary: '#E5E4E2', accent: '#D3D3D3', name: 'Platinum' },
        diamond: { primary: '#B9F2FF', accent: '#A0E7FF', name: 'Diamond' }
      };
      
      const tierColor = tierColors[tier] || tierColors.gold;
      const navyBlue = '#001f3f';
      const gold = '#FFD700';
      
      // If custom Canva background exists, use it; otherwise use coded design
      if (hasCustomBackground) {
        // Add custom Canva certificate background image
        // (This includes FR2P Logo in top left and tier badge at bottom)
        doc.image(certificateBackgroundPath, 0, 0, { width: 792, height: 612 });
        
        // Overlay ONLY member-specific information
        // (Avoid top left for FR2P logo and bottom for tier badges)
        
        // Member name in elegant cursive style - centered vertically
        doc.fontSize(48)
          .fillColor('#FFD700')
          .font('Helvetica-BoldOblique')
          .text(`${member.firstName} ${member.lastName}`, 0, 280, { align: 'center', width: 792 });
        
        // Tier name with tier-specific color
        doc.fontSize(28)
          .fillColor(tierColor.primary)
          .font('Helvetica-BoldOblique')
          .text(`${tierColor.name} Affiliate Ambassador`, 0, 350, { align: 'center', width: 792 });
        
        // Date - positioned to avoid bottom tier badge
        const earnedDate = new Date(achievement.earnedAt);
        const formattedDate = earnedDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        doc.fontSize(13)
          .fillColor('#FFD700')
          .font('Helvetica-Oblique')
          .text(`Earned: ${formattedDate}`, 0, 420, { align: 'center', width: 792 });
        
      } else {
        // Fallback: Use coded design if no custom background
        // Add navy background
        doc.rect(0, 0, 792, 612).fill(navyBlue);
        
        // Add tier-specific colored border
        doc.rect(30, 30, 732, 552)
          .lineWidth(8)
          .stroke(tierColor.primary);
        
        // Add inner gold border
        doc.rect(45, 45, 702, 522)
          .lineWidth(2)
          .stroke(gold);
        
        // Draw tier-specific badge/icon in top right
        const badgeX = 680;
        const badgeY = 80;
        
        // Draw decorative tier badge
        if (tier === 'diamond') {
          // Diamond shape
          doc.save()
            .translate(badgeX, badgeY)
            .moveTo(0, -20)
            .lineTo(15, 0)
            .lineTo(0, 20)
            .lineTo(-15, 0)
            .closePath()
            .lineWidth(3)
            .stroke(tierColor.primary)
            .fillColor(tierColor.accent)
            .fill()
            .restore();
        } else {
          // Circle badge for other tiers
          doc.circle(badgeX, badgeY, 25)
            .lineWidth(3)
            .stroke(tierColor.primary)
            .fillColor(tierColor.accent)
            .fill();
        }
        
        // The FR2P Club Logo text in top left
        doc.fontSize(24)
          .fillColor(gold)
          .font('Helvetica-Bold')
          .text('FR2P', 60, 60, { width: 100 });
        doc.fontSize(10)
          .fillColor('#FFFFFF')
          .font('Helvetica')
          .text('CLUB', 60, 88, { width: 100 });
        
        // Title - using Helvetica-Oblique for cursive effect
        doc.fontSize(52)
          .fillColor(gold)
          .font('Helvetica-BoldOblique')
          .text('Certificate of Achievement', 0, 130, { align: 'center' });
        
        // Subtitle
        doc.fontSize(18)
          .fillColor('#FFFFFF')
          .font('Helvetica-Oblique')
          .text('Financial Roadway 2 Prosperity', 0, 190, { align: 'center' });
        
        // Achievement message
        doc.fontSize(16)
          .fillColor(gold)
          .font('Helvetica-Oblique')
          .text('This certifies that', 0, 230, { align: 'center' });
        
        // Member name in elegant cursive style
        doc.fontSize(44)
          .fillColor('#FFFFFF')
          .font('Helvetica-BoldOblique')
          .text(`${member.firstName} ${member.lastName}`, 0, 265, { align: 'center' });
        
        // Tier achieved with tier-specific color
        doc.fontSize(32)
          .fillColor(tierColor.primary)
          .font('Helvetica-BoldOblique')
          .text(`${tierColor.name} Affiliate Ambassador`, 0, 330, { align: 'center' });
        
        // Message
        doc.fontSize(14)
          .fillColor('#FFFFFF')
          .font('Helvetica-Oblique')
          .text('has successfully achieved this prestigious level through dedication', 0, 390, { align: 'center' })
          .text('to the "Get 5, Teach 5" duplication model of The FR2P Club', 0, 410, { align: 'center' });
        
        // Date
        const earnedDate = new Date(achievement.earnedAt);
        const formattedDate = earnedDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        doc.fontSize(13)
          .fillColor(gold)
          .font('Helvetica-Oblique')
          .text(`Earned on ${formattedDate}`, 0, 460, { align: 'center' });
        
        // Signature line
        doc.moveTo(280, 515).lineTo(510, 515).stroke(gold);
        doc.fontSize(16)
          .fillColor('#FFFFFF')
          .font('Helvetica-BoldOblique')
          .text('Derrick Taylor', 0, 525, { align: 'center' });
        doc.fontSize(11)
          .fillColor(gold)
          .font('Helvetica-Oblique')
          .text('Founder, The FR2P Club', 0, 548, { align: 'center' });
      }
      
      // Finalize the PDF
      doc.end();
    } catch (error) {
      console.error("Error generating certificate:", error);
      res.status(500).json({ message: "Failed to generate certificate" });
    }
  });

  // Magazine subscription routes
  app.post("/api/magazine/subscribe", async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email("Valid email required"),
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().nullable().optional(),
        memberId: z.string().nullable().optional(),
      });
      const parsed = schema.parse(req.body);
      const subscriber = await storage.subscribeMagazine({
        email: parsed.email,
        firstName: parsed.firstName,
        lastName: parsed.lastName || null,
        memberId: parsed.memberId || null,
        isSubscribed: true,
      });

      try {
        const { sendMagazineWelcomeEmail } = await import("./services/email");
        await sendMagazineWelcomeEmail({ email: parsed.email, firstName: parsed.firstName });
      } catch (emailError) {
        console.error("Failed to send magazine welcome email:", emailError);
      }

      res.json({ success: true, subscriber });
    } catch (error) {
      console.error("Magazine subscription error:", error);
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });

  app.post("/api/magazine/unsubscribe", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const result = await storage.unsubscribeMagazine(email);
      res.json({ success: result });
    } catch (error) {
      console.error("Magazine unsubscribe error:", error);
      res.status(500).json({ message: "Failed to unsubscribe" });
    }
  });

  app.get("/api/magazine/status/:email", async (req, res) => {
    try {
      const subscription = await storage.getMagazineSubscription(req.params.email);
      res.json({ subscribed: subscription?.isSubscribed || false });
    } catch (error) {
      res.status(500).json({ message: "Failed to check subscription status" });
    }
  });

  app.get("/api/magazine/count", async (req, res) => {
    try {
      const count = await storage.getMagazineSubscriberCount();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to get subscriber count" });
    }
  });

  // Marketplace / Business Listings
  app.get("/api/marketplace/listings", async (req, res) => {
    try {
      const listings = await storage.getAllBusinessListings();
      res.json({ listings });
    } catch (error) {
      res.status(500).json({ message: "Failed to get listings" });
    }
  });

  app.get("/api/marketplace/my-listing/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const listing = await storage.getBusinessListingByMember(memberId);
      res.json({ listing: listing || null });
    } catch (error) {
      res.status(500).json({ message: "Failed to get listing" });
    }
  });

  app.post("/api/marketplace/listings", async (req, res) => {
    try {
      const { memberId, ...rest } = req.body;
      if (!memberId) return res.status(400).json({ message: "Member ID required" });

      const existing = await storage.getBusinessListingByMember(memberId);
      if (existing) {
        const updated = await storage.updateBusinessListing(existing.id, rest);
        return res.json({ listing: updated });
      }
      const listing = await storage.createBusinessListing({ memberId, ...rest });
      res.json({ listing });
    } catch (error) {
      res.status(500).json({ message: "Failed to save listing" });
    }
  });

  app.delete("/api/marketplace/listings/:id", async (req, res) => {
    try {
      await storage.deleteBusinessListing(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete listing" });
    }
  });

  app.post("/api/marketplace/track-view/:id", async (req, res) => {
    try {
      await storage.trackBusinessListingView(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to track view" });
    }
  });

  app.post("/api/marketplace/track-click/:id", async (req, res) => {
    try {
      await storage.trackBusinessListingClick(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to track click" });
    }
  });

  app.post("/api/marketplace/upgrade-session", async (req, res) => {
    try {
      const { memberId, packageType } = req.body;
      if (!memberId || !packageType) return res.status(400).json({ message: "Missing required fields" });

      const member = await storage.getMember(memberId);
      if (!member) return res.status(404).json({ message: "Member not found" });

      const prices: Record<string, number> = {
        featured_weekly: 2500,
        featured_monthly: 10000,
      };
      const amount = prices[packageType];
      if (!amount) return res.status(400).json({ message: "Invalid package type" });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: packageType === "featured_weekly" ? "Member Featured Listing (1 Week)" : "Member Featured Listing (1 Month)",
              description: "Upgrade your The FR2P Club business listing to featured placement",
            },
            unit_amount: amount,
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: `${req.headers.origin}/marketplace?upgraded=true`,
        cancel_url: `${req.headers.origin}/marketplace`,
        metadata: { memberId, packageType, listingType: "member" },
      });

      res.json({ url: session.url });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to create upgrade session" });
    }
  });

  // Non-member guest advertising session
  app.post("/api/marketplace/guest-ad-session", async (req, res) => {
    try {
      const { packageType, businessName, advertiserName, advertiserEmail, description, category, website, phone, email, city, state, tagline, weeklyPromo } = req.body;
      if (!packageType || !businessName || !advertiserName || !advertiserEmail) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const prices: Record<string, { amount: number; label: string }> = {
        guest_basic: { amount: 7500, label: "Guest Basic Listing (1 Month)" },
        guest_featured_weekly: { amount: 7500, label: "Guest Featured Listing (1 Week)" },
        guest_featured_monthly: { amount: 25000, label: "Guest Featured Listing (1 Month)" },
      };
      const pkg = prices[packageType];
      if (!pkg) return res.status(400).json({ message: "Invalid package type" });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: pkg.label,
              description: `Advertise ${businessName} on The FR2P Club Member Marketplace`,
            },
            unit_amount: pkg.amount,
          },
          quantity: 1,
        }],
        mode: "payment",
        customer_email: advertiserEmail,
        success_url: `${req.headers.origin}/marketplace?guest_success=true`,
        cancel_url: `${req.headers.origin}/marketplace#advertise`,
        metadata: {
          listingType: "guest",
          packageType,
          businessName,
          advertiserName,
          advertiserEmail,
          description: description?.substring(0, 400) || "",
          category: category || "Other",
          website: website || "",
          phone: phone || "",
          email: email || "",
          city: city || "",
          state: state || "",
          tagline: tagline || "",
          weeklyPromo: weeklyPromo || "",
        },
      });

      res.json({ url: session.url });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to create guest ad session" });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket Server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Track connected clients
  const clients = new Map<string, { ws: WebSocket; memberId: string; memberName: string }>();
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection established');
    let currentMemberId: string | null = null;
    
    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different message types
        if (data.type === 'join') {
          // Member joining chat
          if (!data.memberId || !data.memberName) {
            console.error('Join message missing required fields');
            return;
          }
          currentMemberId = data.memberId;
          const memberName = data.memberName;
          clients.set(currentMemberId, { ws, memberId: currentMemberId, memberName });
          
          // Update online presence in database
          await storage.upsertOnlinePresence({
            memberId: currentMemberId,
            memberName: memberName,
            isOnline: true,
            lastSeen: new Date(),
            socketId: currentMemberId,
          });
          
          // Broadcast updated online users list
          const onlineUsers = await storage.getOnlineMembers();
          broadcast({ 
            type: 'onlineUsers', 
            users: onlineUsers 
          });
          
          // Send recent messages to newly joined member
          const recentMessages = await storage.getRecentChatMessages(50);
          ws.send(JSON.stringify({ 
            type: 'chatHistory', 
            messages: recentMessages 
          }));
          
          console.log(`Member ${memberName} (${currentMemberId}) joined chat`);
        }
        
        if (data.type === 'chatMessage') {
          // Member sending a message
          const { memberId, memberName, message: chatMessage, isFromAdmin } = data;
          
          // Save message to database
          const savedMessage = await storage.createChatMessage({
            senderId: memberId,
            senderName: memberName,
            message: chatMessage,
            isFromAdmin: isFromAdmin || false,
          });
          
          // Broadcast to all connected clients
          broadcast({
            type: 'newMessage',
            message: savedMessage
          });
          
          console.log(`Message from ${memberName}: ${chatMessage}`);
        }
        
        if (data.type === 'typing') {
          // Broadcast typing indicator (excluding sender)
          const { memberId, memberName, isTyping } = data;
          broadcastExcept(currentMemberId, {
            type: 'typing',
            memberId,
            memberName,
            isTyping
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', async () => {
      if (currentMemberId) {
        // Remove from clients map
        clients.delete(currentMemberId);
        
        // Update online presence
        await storage.updateOnlinePresence(currentMemberId, false);
        
        // Broadcast updated online users list
        const onlineUsers = await storage.getOnlineMembers();
        broadcast({ 
          type: 'onlineUsers', 
          users: onlineUsers 
        });
        
        console.log(`Member ${currentMemberId} disconnected from chat`);
      }
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
  
  // Helper function to broadcast to all clients
  function broadcast(message: any) {
    const messageStr = JSON.stringify(message);
    clients.forEach(({ ws }) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(messageStr);
      }
    });
  }
  
  // ── PLAYLIST ROUTES ──────────────────────────────────────────
  app.get("/api/playlist/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const tracks = await db
        .select()
        .from(memberPlaylists)
        .where(eq(memberPlaylists.memberId, memberId))
        .orderBy(memberPlaylists.sortOrder, memberPlaylists.createdAt);
      res.json(tracks);
    } catch (error) {
      console.error("Error fetching playlist:", error);
      res.status(500).json({ message: "Failed to fetch playlist" });
    }
  });

  app.post("/api/playlist/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const { name, url } = req.body;
      if (!name || !url) return res.status(400).json({ message: "name and url required" });
      const countResult = await db
        .select()
        .from(memberPlaylists)
        .where(eq(memberPlaylists.memberId, memberId));
      const sortOrder = countResult.length;
      const [track] = await db
        .insert(memberPlaylists)
        .values({ memberId, name, url, sortOrder })
        .returning();
      res.json(track);
    } catch (error) {
      console.error("Error adding track:", error);
      res.status(500).json({ message: "Failed to add track" });
    }
  });

  app.delete("/api/playlist/:memberId/:trackId", async (req, res) => {
    try {
      const { memberId, trackId } = req.params;
      await db
        .delete(memberPlaylists)
        .where(eq(memberPlaylists.id, trackId));
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing track:", error);
      res.status(500).json({ message: "Failed to remove track" });
    }
  });

  // ── Prospect Manager Routes ──────────────────────────────────────────
  app.get("/api/prospects/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const rows = await db.select().from(prospects).where(eq(prospects.memberId, memberId));
      res.json(rows);
    } catch (error) {
      console.error("Error fetching prospects:", error);
      res.status(500).json({ message: "Failed to fetch prospects" });
    }
  });

  app.post("/api/prospects", async (req, res) => {
    try {
      const parsed = insertProspectSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
      const [created] = await db.insert(prospects).values(parsed.data).returning();
      res.json(created);
    } catch (error) {
      console.error("Error creating prospect:", error);
      res.status(500).json({ message: "Failed to create prospect" });
    }
  });

  app.patch("/api/prospects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await db.update(prospects).set(req.body).where(eq(prospects.id, id)).returning();
      if (!updated) return res.status(404).json({ message: "Prospect not found" });
      res.json(updated);
    } catch (error) {
      console.error("Error updating prospect:", error);
      res.status(500).json({ message: "Failed to update prospect" });
    }
  });

  app.delete("/api/prospects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(prospects).where(eq(prospects.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting prospect:", error);
      res.status(500).json({ message: "Failed to delete prospect" });
    }
  });

  // Side Hustle Incubator Waitlist
  app.post("/api/hustle-incubator/waitlist", async (req, res) => {
    try {
      const schema = z.object({
        firstName: z.string().min(1, "First name is required"),
        email: z.string().email("Valid email required"),
        tier: z.string().nullable().optional(),
        track: z.string().nullable().optional(),
      });
      const parsed = schema.parse(req.body);
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "The FR2P Club <noreply@thefr2pclub.com>",
          to: parsed.email,
          subject: "You're a Founding Member — FR2P Side Hustle Incubator 🔥",
          html: `
            <div style="background:#001f3f;padding:40px;font-family:Arial,sans-serif;color:#fff;max-width:600px;margin:0 auto;border-radius:12px;">
              <h1 style="color:#FFD700;text-align:center;">You're In! 🔥</h1>
              <h2 style="color:#fff;text-align:center;">Founding Member Spot Reserved</h2>
              <p>Hi ${parsed.firstName},</p>
              <p>You're officially on the founding member waitlist for the <strong style="color:#FFD700;">FR2P AI-Powered Side Hustle Incubator</strong>.</p>
              ${parsed.tier ? `<p>Tier interested in: <strong style="color:#FFD700;">${parsed.tier}</strong></p>` : ""}
              ${parsed.track ? `<p>Skill track: <strong style="color:#FFD700;">${parsed.track}</strong></p>` : ""}
              <div style="background:#002855;border:1px solid #FFD700;border-radius:8px;padding:20px;margin:20px 0;">
                <h3 style="color:#FFD700;margin:0 0 10px;">What Happens Next</h3>
                <p style="margin:4px 0;">✅ You get early access before the public</p>
                <p style="margin:4px 0;">✅ Founding member pricing (locked in for you)</p>
                <p style="margin:4px 0;">✅ First pick of coaching slots and skill tracks</p>
              </div>
              <p>Keep building your FR2P network — active members get priority placement when we open doors.</p>
              <p style="color:#FFD700;font-weight:bold;">— Derrick Taylor &amp; The FR2P Club Team</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Hustle Incubator waitlist email error:", emailErr);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Hustle Incubator waitlist error:", error);
      res.status(500).json({ message: "Failed to join waitlist" });
    }
  });

  // Pocket Booster Waitlist
  app.post("/api/pocket-booster/waitlist", async (req, res) => {
    try {
      const schema = z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().nullable().optional(),
        email: z.string().email("Valid email required"),
        phone: z.string().nullable().optional(),
        memberId: z.string().nullable().optional(),
        loanAmount: z.string().nullable().optional(),
        purpose: z.string().nullable().optional(),
      });
      const parsed = schema.parse(req.body);
      const entry = await db.insert(pocketBoosterWaitlist).values({
        firstName: parsed.firstName,
        lastName: parsed.lastName || null,
        email: parsed.email,
        phone: parsed.phone || null,
        memberId: parsed.memberId || null,
        loanAmount: parsed.loanAmount || null,
        purpose: parsed.purpose || null,
      }).returning();
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "The FR2P Club <noreply@thefr2pclub.com>",
          to: parsed.email,
          subject: "You're on the Pocket Booster Waitlist!",
          html: `
            <div style="background:#001f3f;padding:40px;font-family:Arial,sans-serif;color:#fff;max-width:600px;margin:0 auto;border-radius:12px;">
              <h1 style="color:#FFD700;text-align:center;">You're In! 🚀</h1>
              <h2 style="color:#fff;text-align:center;">Pocket Booster Waitlist Confirmed</h2>
              <p>Hi ${parsed.firstName},</p>
              <p>You're officially on the Pocket Booster waitlist. When we launch, you'll be among the first to access community-backed micro-loans from <strong style="color:#FFD700;">$100 to $1,000</strong> — no hard credit pull, fast decisions.</p>
              <div style="background:#002855;border:1px solid #FFD700;border-radius:8px;padding:20px;margin:20px 0;">
                <h3 style="color:#FFD700;margin:0 0 10px;">Your Waitlist Details</h3>
                <p style="margin:4px 0;">Name: ${parsed.firstName} ${parsed.lastName || ""}</p>
                <p style="margin:4px 0;">Email: ${parsed.email}</p>
                ${parsed.loanAmount ? `<p style="margin:4px 0;">Loan Amount Interested In: ${parsed.loanAmount}</p>` : ""}
              </div>
              <p>We'll notify you the moment Pocket Booster goes live. Stay connected — your financial boost is coming.</p>
              <p style="color:#FFD700;font-weight:bold;">— The FR2P Club Team</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Pocket Booster waitlist email error:", emailErr);
      }
      res.json({ success: true, entry: entry[0] });
    } catch (error) {
      console.error("Pocket Booster waitlist error:", error);
      res.status(500).json({ message: "Failed to join waitlist" });
    }
  });

  app.get("/api/pocket-booster/waitlist-count", async (req, res) => {
    try {
      const result = await db.select({ count: sql<number>`count(*)` }).from(pocketBoosterWaitlist);
      res.json({ count: Number(result[0]?.count || 0) });
    } catch (error) {
      res.status(500).json({ message: "Failed to get count" });
    }
  });

  // Helper function to broadcast to all except one
  function broadcastExcept(excludeMemberId: string | null, message: any) {
    const messageStr = JSON.stringify(message);
    clients.forEach(({ ws, memberId }) => {
      if (memberId !== excludeMemberId && ws.readyState === WebSocket.OPEN) {
        ws.send(messageStr);
      }
    });
  }
  
  return httpServer;
}
