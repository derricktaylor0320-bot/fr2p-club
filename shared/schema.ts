import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const members = pgTable("members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  profilePicture: text("profile_picture"), // Path to uploaded profile picture
  address: text("address"), // Street address
  city: text("city"), // City
  state: text("state"), // State
  zipCode: text("zip_code"), // ZIP/Postal code
  phoneNumber: text("phone_number"), // Phone number
  referrerId: varchar("referrer_id").references((): any => members.id),
  level: integer("level").notNull().default(1),
  isActive: boolean("is_active").notNull().default(false),
  rank: text("rank").notNull().default("Affiliate"),
  membershipPlan: text("membership_plan").notNull().default("monthly"), // "monthly" or "annual"
  membershipLevel: text("membership_level").notNull().default("standard"), // "standard" or "premium"
  affiliateTier: text("affiliate_tier").notNull().default("bronze"), // "bronze", "silver", "gold", "platinum", "diamond"
  totalSales: integer("total_sales").notNull().default(0),
  memberNumber: integer("member_number"), // Sequential member number for founding member status
  isFoundingMember: boolean("is_founding_member").notNull().default(false), // First 500 members
  isFounding50Member: boolean("is_founding_50_member").notNull().default(false), // First 50 free-trial members
  founding50TrialEnds: timestamp("founding_50_trial_ends"), // When their free trial expires
  isActiveMember: boolean("is_active_member").notNull().default(true), // Activity status for spillover eligibility
  bonusesEarned: integer("bonuses_earned").notNull().default(0), // Amount in cents
  spilloverCommissions: integer("spillover_commissions").notNull().default(0), // Total spillover commissions earned in cents
  membershipPaidUntil: timestamp("membership_paid_until").notNull().default(sql`CURRENT_DATE + INTERVAL '30 days'`), // Current membership status
  lastMembershipPayment: timestamp("last_membership_payment").notNull().defaultNow(),
  stripeCustomerId: text("stripe_customer_id"), // Stripe customer ID for payments
  stripeSubscriptionId: text("stripe_subscription_id"), // Stripe subscription ID for monthly members
  subscriptionStatus: text("subscription_status").notNull().default("active"), // "active", "canceled", "past_due", "incomplete"
  permanentReferralCount: integer("permanent_referral_count").notNull().default(0), // Locked-in referrals that earn permanent $5/month residual income forever
  joinDate: timestamp("join_date").notNull().defaultNow(),
});

export const affiliateStats = pgTable("affiliate_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull().references(() => members.id),
  level1Count: integer("level1_count").notNull().default(0),
  level2Count: integer("level2_count").notNull().default(0),
  level3Count: integer("level3_count").notNull().default(0),
  level4Count: integer("level4_count").notNull().default(0),
  level5Count: integer("level5_count").notNull().default(0),
  totalReferrals: integer("total_referrals").notNull().default(0),
  monthlyCommissions: integer("monthly_commissions").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull().references(() => members.id),
  amount: integer("amount").notNull(), // Amount in cents
  type: text("type").notNull(), // "commission", "bonus", "payment", "spillover"
  commissionType: text("commission_type"), // "direct", "spillover" for commission transactions
  isRecurring: boolean("is_recurring").notNull().default(false), // True for monthly recurring commissions, false for one-time
  recurringSourceMemberId: varchar("recurring_source_member_id").references(() => members.id), // The member who generates this recurring commission (the referral)
  commissionRate: integer("commission_rate"), // Commission rate in cents (e.g., 500 = $5)
  sourceTransactionId: varchar("source_transaction_id").references((): any => transactions.id), // Reference to original sale for spillovers
  sourceMemberId: varchar("source_member_id").references(() => members.id), // Member who made the original sale
  status: text("status").notNull().default("holding"), // "holding", "available", "paid" - now 30-day holding period with investor funding
  earnedAt: timestamp("earned_at").notNull().defaultNow(), // When commission was earned
  availableAt: timestamp("available_at").notNull(), // When commission becomes available for payout (30 days later with investor funding)
  paidAt: timestamp("paid_at"), // When commission was actually paid out
  description: text("description").notNull(), // Human-readable description
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const charityPreferences = pgTable("charity_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull().references(() => members.id),
  ein: text("ein").notNull(), // Employer Identification Number from IRS
  name: text("name").notNull(), // Charity display name
  city: text("city"), // Charity city
  state: text("state"), // Charity state
  website: text("website"), // Optional charity website
  source: text("source").notNull().default("propublica"), // "propublica", "charity-navigator", "irs"
  selectedAt: timestamp("selected_at").notNull().defaultNow(),
});

export const bankingInformation = pgTable("banking_information", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull().references(() => members.id),
  accountHolderName: text("account_holder_name").notNull(),
  bankName: text("bank_name").notNull(),
  routingNumber: text("routing_number").notNull(), // 9-digit routing number
  accountNumber: text("account_number").notNull(),
  accountType: text("account_type").notNull().default("checking"), // "checking" or "savings"
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const metalBusinessCardOrders = pgTable("metal_business_card_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull().references(() => members.id),
  quantity: integer("quantity").notNull(), // 100, 500, or 1000
  totalAmount: integer("total_amount").notNull(), // Amount in cents (FR2P price)
  amazonCost: integer("amazon_cost").notNull(), // Amazon cost in cents for reference
  status: text("status").notNull().default("pending"), // "pending", "processing", "shipped", "delivered"
  
  // Customer personalization details
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  qrCodeUrl: text("qr_code_url"), // URL to uploaded QR code file
  customText: text("custom_text"), // Additional text for back of card
  
  // Shipping information
  shippingName: text("shipping_name").notNull(),
  shippingAddress1: text("shipping_address1").notNull(),
  shippingAddress2: text("shipping_address2"),
  shippingCity: text("shipping_city").notNull(),
  shippingState: text("shipping_state").notNull(),
  shippingZip: text("shipping_zip").notNull(),
  
  // Order tracking
  paymentStatus: text("payment_status").notNull().default("pending"), // "pending", "paid", "refunded"
  amazonOrderId: text("amazon_order_id"), // Order ID from Amazon when processed
  trackingNumber: text("tracking_number"), // Shipping tracking number
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const savingsAccounts = pgTable("savings_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull().references(() => members.id).unique(),
  balance: integer("balance").notNull().default(0), // Balance in cents
  totalDeposited: integer("total_deposited").notNull().default(0), // Total deposited over time in cents
  totalWithdrawn: integer("total_withdrawn").notNull().default(0), // Total withdrawn over time in cents
  lastWithdrawalDate: timestamp("last_withdrawal_date"), // Date of last annual withdrawal
  nextWithdrawalDate: timestamp("next_withdrawal_date"), // When next withdrawal is allowed
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const savingsTransactions = pgTable("savings_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  savingsAccountId: varchar("savings_account_id").notNull().references(() => savingsAccounts.id),
  memberId: varchar("member_id").notNull().references(() => members.id),
  amount: integer("amount").notNull(), // Amount in cents (positive for deposits, negative for withdrawals)
  type: text("type").notNull(), // "deposit", "withdrawal"
  source: text("source"), // "commission_deduction", "manual_deposit", "annual_withdrawal"
  sourceTransactionId: varchar("source_transaction_id").references((): any => transactions.id), // Reference to original commission transaction
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const magazineSubscribers = pgTable("magazine_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").references(() => members.id),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  isSubscribed: boolean("is_subscribed").notNull().default(true),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at"),
});

export const insertMagazineSubscriberSchema = createInsertSchema(magazineSubscribers).omit({
  id: true,
  subscribedAt: true,
  unsubscribedAt: true,
});

export type MagazineSubscriber = typeof magazineSubscribers.$inferSelect;
export type InsertMagazineSubscriber = z.infer<typeof insertMagazineSubscriberSchema>;

export const memberPlaylists = pgTable("member_playlists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull().references(() => members.id),
  name: text("name").notNull(),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMemberPlaylistSchema = createInsertSchema(memberPlaylists).omit({ id: true, createdAt: true });
export type MemberPlaylist = typeof memberPlaylists.$inferSelect;
export type InsertMemberPlaylist = z.infer<typeof insertMemberPlaylistSchema>;

export const businessListings = pgTable("business_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").references(() => members.id),
  listingType: text("listing_type").notNull().default("member"),
  advertiserName: text("advertiser_name"),
  advertiserEmail: text("advertiser_email"),
  businessName: text("business_name").notNull(),
  tagline: text("tagline"),
  description: text("description").notNull(),
  category: text("category").notNull().default("other"),
  logoUrl: text("logo_url"),
  website: text("website"),
  phone: text("phone"),
  email: text("email"),
  city: text("city"),
  state: text("state"),
  packageType: text("package_type").notNull().default("free"),
  featuredUntil: timestamp("featured_until"),
  weeklyPromo: text("weekly_promo"),
  stripePaymentId: text("stripe_payment_id"),
  isActive: boolean("is_active").notNull().default(true),
  viewCount: integer("view_count").notNull().default(0),
  clickCount: integer("click_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBusinessListingSchema = createInsertSchema(businessListings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  clickCount: true,
});

export type BusinessListing = typeof businessListings.$inferSelect;
export type InsertBusinessListing = z.infer<typeof insertBusinessListingSchema>;

export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
  joinDate: true,
  membershipPlan: true, // Omit so it defaults to "basic" in database
});

export const insertAffiliateStatsSchema = createInsertSchema(affiliateStats).omit({
  id: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertCharityPreferenceSchema = createInsertSchema(charityPreferences).omit({
  id: true,
  selectedAt: true,
});

export const insertBankingInformationSchema = createInsertSchema(bankingInformation).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  routingNumber: z.string().length(9, "Routing number must be exactly 9 digits").regex(/^\d+$/, "Routing number must contain only digits"),
  accountNumber: z.string().min(4, "Account number must be at least 4 digits").max(17, "Account number cannot exceed 17 digits").regex(/^\d+$/, "Account number must contain only digits"),
  accountType: z.enum(["checking", "savings"]),
});

export const insertMetalBusinessCardOrderSchema = createInsertSchema(metalBusinessCardOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  quantity: z.number().refine((val) => [100, 500, 1000].includes(val), {
    message: "Quantity must be 100, 500, or 1000 cards",
  }),
  customerEmail: z.string().email("Please enter a valid email address"),
  customerPhone: z.string().optional(),
  shippingZip: z.string().min(5, "ZIP code must be at least 5 digits").max(10, "ZIP code cannot exceed 10 characters"),
});

export const insertSavingsAccountSchema = createInsertSchema(savingsAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSavingsTransactionSchema = createInsertSchema(savingsTransactions).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

// Tier system constants - 5-tier achievement structure based on 5 circles of influence
// NEW: "Bronze Affiliate Ambassador" → "Diamond Affiliate Ambassador" naming
export const AFFILIATE_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  DIAMOND: 'diamond'
} as const;

// TIER-BASED COMMISSION RATES (Higher tier = Higher commission per direct referral)
// Based on sponsor's tier, not the referral's tier
export const TIER_COMMISSION_RATES = {
  [AFFILIATE_TIERS.BRONZE]: 1400,   // $14/month per direct referral
  [AFFILIATE_TIERS.SILVER]: 1500,   // $15/month per direct referral
  [AFFILIATE_TIERS.GOLD]: 1700,     // $17/month per direct referral
  [AFFILIATE_TIERS.PLATINUM]: 1800, // $18/month per direct referral
  [AFFILIATE_TIERS.DIAMOND]: 2000,  // $20/month per direct referral
} as const;

// Affiliate Ambassador tier names for display
export const TIER_DISPLAY_NAMES = {
  [AFFILIATE_TIERS.BRONZE]: 'Bronze Affiliate Ambassador',
  [AFFILIATE_TIERS.SILVER]: 'Silver Affiliate Ambassador',
  [AFFILIATE_TIERS.GOLD]: 'Gold Affiliate Ambassador',
  [AFFILIATE_TIERS.PLATINUM]: 'Platinum Affiliate Ambassador',
  [AFFILIATE_TIERS.DIAMOND]: 'Diamond Affiliate Ambassador',
} as const;

export const TIER_REQUIREMENTS = {
  [AFFILIATE_TIERS.BRONZE]: { minSales: 0, maxSales: 4, commissionRate: 14, spilloverRate: 2, name: 'Bronze Affiliate Ambassador', circle: 1, totalNetwork: 5, networkRequired: 5 },
  [AFFILIATE_TIERS.SILVER]: { minSales: 5, maxSales: 24, commissionRate: 15, spilloverRate: 3, name: 'Silver Affiliate Ambassador', circle: 2, totalNetwork: 30, networkRequired: 25 },
  [AFFILIATE_TIERS.GOLD]: { minSales: 25, maxSales: 124, commissionRate: 17, spilloverRate: 4, name: 'Gold Affiliate Ambassador', circle: 3, totalNetwork: 155, networkRequired: 125 },
  [AFFILIATE_TIERS.PLATINUM]: { minSales: 125, maxSales: 624, commissionRate: 18, spilloverRate: 5, name: 'Platinum Affiliate Ambassador', circle: 4, totalNetwork: 780, networkRequired: 625 },
  [AFFILIATE_TIERS.DIAMOND]: { minSales: 625, maxSales: Infinity, commissionRate: 20, spilloverRate: 6, name: 'Diamond Affiliate Ambassador', circle: 5, totalNetwork: 3906, networkRequired: 3125 }
} as const;

// CIRCLE COMPLETION BONUSES (One-time rewards when completing each circle)
export const CIRCLE_COMPLETION_BONUSES = {
  [AFFILIATE_TIERS.BRONZE]: { networkRequired: 5, bonusAmount: 2500, description: 'Bronze Circle Complete - 5 Active Members' }, // $25
  [AFFILIATE_TIERS.SILVER]: { networkRequired: 25, bonusAmount: 5000, description: 'Silver Circle Complete - 25 Active Members' }, // $50
  [AFFILIATE_TIERS.GOLD]: { networkRequired: 125, bonusAmount: 10000, description: 'Gold Circle Complete - 125 Active Members' }, // $100
  [AFFILIATE_TIERS.PLATINUM]: { networkRequired: 625, bonusAmount: 25000, description: 'Platinum Circle Complete - 625 Active Members' }, // $250
  [AFFILIATE_TIERS.DIAMOND]: { networkRequired: 3125, bonusAmount: 50000, description: 'Diamond Circle Complete - 3,125 Active Members (Full Network!)' }, // $500
} as const;

// TOTAL COMPLETION BONUSES: $925 ($25 + $50 + $100 + $250 + $500)

export const MILESTONE_BONUSES = [
  { salesRequired: 5, bonusAmount: 2500, description: 'Bronze Affiliate Ambassador Achievement' }, // $25 in cents
  { salesRequired: 25, bonusAmount: 5000, description: 'Silver Affiliate Ambassador Achievement' }, // $50 in cents
  { salesRequired: 125, bonusAmount: 10000, description: 'Gold Affiliate Ambassador Achievement' }, // $100 in cents
  { salesRequired: 625, bonusAmount: 25000, description: 'Platinum Affiliate Ambassador Achievement' }, // $250 in cents
  { salesRequired: 3125, bonusAmount: 50000, description: 'Diamond Affiliate Ambassador Achievement' } // $500 in cents
] as const;

// Membership Pricing - TWO-TIER STRUCTURE
// STANDARD TIER - Affiliate system, education, community
export const MEMBERSHIP_FEE_MONTHLY = 3500; // $35/month Standard membership fee in cents
export const MEMBERSHIP_FEE_ANNUAL = 35000; // $350/year Standard (vs $420 monthly) - saves $70
export const ANNUAL_SAVINGS_AMOUNT = 7000; // $70 savings when paying annually ($420 - $350)
export const ANNUAL_SAVINGS_PERCENTAGE = 17; // 17% savings when paying annually

// PREMIUM TIER - Everything in Standard + KonnectMD Healthcare Access
export const PREMIUM_MEMBERSHIP_FEE_MONTHLY = 5000; // $50/month Premium membership fee in cents
export const PREMIUM_MEMBERSHIP_FEE_ANNUAL = 50000; // $500/year Premium (vs $600 monthly) - saves $100
export const PREMIUM_ANNUAL_SAVINGS_AMOUNT = 10000; // $100 savings when paying annually ($600 - $500)
export const PREMIUM_ANNUAL_SAVINGS_PERCENTAGE = 17; // 17% savings when paying annually

// Membership Level Constants
export const MEMBERSHIP_LEVELS = {
  STANDARD: 'standard',
  PREMIUM: 'premium'
} as const;

// KonnectMD Healthcare Access (Premium members only)
export const KONNECTMD_LIFESTYLE_PRICE = 9999; // $99.99/month - paid directly to KonnectMD
export const KONNECTMD_AMBASSADOR_LINK = 'https://konnectmdagency.com/index.aspx?ReferringDealerID=816491';

// PERMANENT RESIDUAL INCOME MODEL
// Every referral is "locked in" forever - once you refer someone and they make their first payment,
// you earn $5/month PERMANENTLY for that referral, even if they cancel their membership.
// This teaches members the power of residual income that never stops.
// Future goal: Increase from $5 to $25 as momentum builds.
export const PERMANENT_RESIDUAL_RATE = 500; // $5/month per locked-in referral in cents
export const FUTURE_RESIDUAL_RATE = 2500; // Future goal: $25/month per referral once momentum builds

// TIER-BASED RECURRING COMMISSION MODEL - NEW 5x5 MATRIX STRUCTURE
// Your commission rate depends on YOUR tier level (higher tier = higher earnings)
// Bronze: $14/month, Silver: $15/month, Gold: $17/month, Platinum: $18/month, Diamond: $20/month
// Commission comes from your DIRECT referrals only (your personal 5)

// Starting commission rate for new members (before reaching Bronze)
export const STARTING_COMMISSION_RATE = 1200; // $12/month per referral (Affiliate Ambassador - no tier yet)

// Maximum commission rate (Diamond Affiliate Ambassador)
export const MAX_COMMISSION_RATE = 2000; // $20/month per referral

// REVENUE SPLIT: $35/month membership
// - Up to $20 goes to direct sponsor (based on their tier)
// - $15-23 stays for operating costs
export const OPERATING_COST_MINIMUM = 1500; // Minimum $15/month for operations per member

// Annual Members: Sponsors earn based on tier (one-time equivalent)
export const ANNUAL_COMMISSION_MULTIPLIER = 10; // 10 months worth of commission (2 months free for member)

// Legacy One-Time Commission (deprecated in favor of tier-based recurring model)
export const MEMBERSHIP_FEE_SIGNUP = 3500; // $35 signup fee in cents (legacy)

// Spillover Commission Constants (still one-time per signup)
export const SPILLOVER_COMMISSION_RATE = 500; // $5 per sale in cents

// Founding Members Program - First 500 members get enhanced rewards
export const FOUNDING_MEMBERS_LIMIT = 500;
export const FOUNDING_MEMBER_COMMISSION_RATE = 5000; // $50 per referral instead of $25 (legacy one-time model)
export const FOUNDING_MEMBER_SPILLOVER_RATE = 1000; // 10% spillover instead of 5%
export const FOUNDING_MEMBER_BONUS_MULTIPLIER = 2; // Double all tier bonuses

// Commission Payout Rules - With Investor Funding
export const COMMISSION_HOLDING_PERIOD_DAYS = 30; // Hold commissions for 30 days before payout (with investor funding)
export const COMMISSION_HOLDING_PERIOD_MONTHS = 1; // 1 month holding period (down from 3 months)
export const MIN_PAYOUT_AMOUNT = 2500; // Minimum $25 to trigger payout

// Commission Eligibility - Must be enrolled and paid for 2 consecutive months (60 days)
// "Separating the curious from the serious" - proves commitment before earning
export const COMMISSION_ELIGIBILITY_DAYS = 60; // 60 days (2 months paid) before eligible for commissions
export const COMMISSION_ELIGIBILITY_PAYMENTS = 2; // Must have made at least 2 membership payments

// Account Grace Period - Inactive accounts kept for 90 days for reactivation
// After 90 days without payment, member must rejoin as new member
export const ACCOUNT_GRACE_PERIOD_DAYS = 90; // 90-day window to return and reactivate
export const ACCOUNT_GRACE_PERIOD_STATUS = "grace_period" as const; // Status during grace period

// Activity-Based Spillover System - "Where Effort Meets Reward"
export const INACTIVE_MEMBER_SPILLOVER_RATE = 200; // 2% baseline spillover for inactive members
export const ACTIVE_MEMBER_SPILLOVER_RATE = 500; // 5% enhanced spillover for active members
export const FOUNDING_INACTIVE_SPILLOVER_RATE = 400; // 4% for inactive founding members (2x baseline)
export const FOUNDING_ACTIVE_SPILLOVER_RATE = 1000; // 10% for active founding members (2x enhanced)

export const COMMISSION_TYPES = {
  DIRECT: 'direct',
  SPILLOVER: 'spillover'
} as const;

// Financial Asset Savings Constants
// $35 deducted only when monthly commission reaches $70+ (14+ referrals at $5 each)
// Must earn at least double the deduction to qualify
// At year end: 12 × $35 = $420 in savings (covers annual membership cost)
export const AUTOMATIC_SAVINGS_DEDUCTION = 3500; // $35 automatically deducted from commissions in cents
export const SAVINGS_DEDUCTION_THRESHOLD = 7000; // $70 minimum commission required before $35 savings deduction applies (in cents)
export const SAVINGS_WITHDRAWAL_PERIOD_MONTHS = 12; // Annual withdrawal - once per year

// Helper functions
export function getTierFromSales(totalSales: number): keyof typeof TIER_REQUIREMENTS {
  if (totalSales >= TIER_REQUIREMENTS.diamond.minSales) return AFFILIATE_TIERS.DIAMOND;
  if (totalSales >= TIER_REQUIREMENTS.platinum.minSales) return AFFILIATE_TIERS.PLATINUM;
  if (totalSales >= TIER_REQUIREMENTS.gold.minSales) return AFFILIATE_TIERS.GOLD;
  if (totalSales >= TIER_REQUIREMENTS.silver.minSales) return AFFILIATE_TIERS.SILVER;
  return AFFILIATE_TIERS.BRONZE;
}

export function getCommissionRate(tier: keyof typeof TIER_REQUIREMENTS): number {
  return TIER_REQUIREMENTS[tier].commissionRate;
}

// NEW: Get tier-based monthly commission rate in cents
// Higher tier = Higher commission per direct referral
export function getTierCommissionRate(tier: keyof typeof TIER_COMMISSION_RATES): number {
  return TIER_COMMISSION_RATES[tier] || STARTING_COMMISSION_RATE;
}

// Get the display name for a tier
export function getTierDisplayName(tier: string): string {
  const tierKey = tier.toLowerCase() as keyof typeof TIER_DISPLAY_NAMES;
  return TIER_DISPLAY_NAMES[tierKey] || 'Affiliate Ambassador';
}

// Calculate monthly earnings based on sponsor's tier and number of active referrals
export function calculateMonthlyEarnings(sponsorTier: keyof typeof TIER_COMMISSION_RATES, activeReferrals: number): number {
  const commissionRate = getTierCommissionRate(sponsorTier);
  return commissionRate * activeReferrals;
}

// Calculate potential earnings at each tier level with 5 direct referrals
export function calculateTierEarningsPotential(): Array<{ tier: string; displayName: string; rate: number; monthlyWith5: number }> {
  return [
    { tier: 'bronze', displayName: 'Bronze Affiliate Ambassador', rate: 14, monthlyWith5: 70 },
    { tier: 'silver', displayName: 'Silver Affiliate Ambassador', rate: 15, monthlyWith5: 75 },
    { tier: 'gold', displayName: 'Gold Affiliate Ambassador', rate: 17, monthlyWith5: 85 },
    { tier: 'platinum', displayName: 'Platinum Affiliate Ambassador', rate: 18, monthlyWith5: 90 },
    { tier: 'diamond', displayName: 'Diamond Affiliate Ambassador', rate: 20, monthlyWith5: 100 },
  ];
}

export function getNextTierInfo(currentSales: number): { nextTier: string; salesNeeded: number } | null {
  if (currentSales < TIER_REQUIREMENTS.silver.minSales) {
    return {
      nextTier: TIER_REQUIREMENTS.silver.name,
      salesNeeded: TIER_REQUIREMENTS.silver.minSales - currentSales
    };
  }
  if (currentSales < TIER_REQUIREMENTS.gold.minSales) {
    return {
      nextTier: TIER_REQUIREMENTS.gold.name,
      salesNeeded: TIER_REQUIREMENTS.gold.minSales - currentSales
    };
  }
  if (currentSales < TIER_REQUIREMENTS.platinum.minSales) {
    return {
      nextTier: TIER_REQUIREMENTS.platinum.name,
      salesNeeded: TIER_REQUIREMENTS.platinum.minSales - currentSales
    };
  }
  if (currentSales < TIER_REQUIREMENTS.diamond.minSales) {
    return {
      nextTier: TIER_REQUIREMENTS.diamond.name,
      salesNeeded: TIER_REQUIREMENTS.diamond.minSales - currentSales
    };
  }
  return null; // Already at highest tier
}

export function calculateEligibleBonuses(currentSales: number, previousSales: number = 0, isFoundingMember: boolean = false): Array<{ amount: number; description: string }> {
  const eligibleBonuses: Array<{ amount: number; description: string }> = [];
  
  MILESTONE_BONUSES.forEach(milestone => {
    // Check if this milestone was crossed (previous sales below requirement, current sales meet or exceed)
    if (previousSales < milestone.salesRequired && currentSales >= milestone.salesRequired) {
      const bonusAmount = isFoundingMember ? milestone.bonusAmount * FOUNDING_MEMBER_BONUS_MULTIPLIER : milestone.bonusAmount;
      const description = isFoundingMember ? `${milestone.description} (Founding Member 2x Bonus)` : milestone.description;
      
      eligibleBonuses.push({
        amount: bonusAmount,
        description: description
      });
    }
  });
  
  return eligibleBonuses;
}

// Helper function to determine founding member status and commission rates
export function getCommissionAmount(isFoundingMember: boolean): number {
  return isFoundingMember ? FOUNDING_MEMBER_COMMISSION_RATE : MEMBERSHIP_FEE_SIGNUP;
}

export function getSpilloverRate(isFoundingMember: boolean, isActiveMember: boolean): number {
  if (isFoundingMember) {
    return isActiveMember ? FOUNDING_ACTIVE_SPILLOVER_RATE : FOUNDING_INACTIVE_SPILLOVER_RATE;
  }
  return isActiveMember ? ACTIVE_MEMBER_SPILLOVER_RATE : INACTIVE_MEMBER_SPILLOVER_RATE;
}

// Annual membership calculation functions
export function calculateAnnualSavings(): { annualCost: number; monthlyCost: number; savings: number; percentSaved: number } {
  const monthlyCost = MEMBERSHIP_FEE_MONTHLY * 12;
  const annualCost = MEMBERSHIP_FEE_ANNUAL;
  const savings = monthlyCost - annualCost;
  const percentSaved = Math.round((savings / monthlyCost) * 100);
  
  return {
    annualCost,
    monthlyCost,
    savings,
    percentSaved
  };
}

// Activity status determination
export function determineActivityStatus(member: Member, lastLoginDate?: Date, lastReferralDate?: Date): boolean {
  // Member is active if they have:
  // 1. Logged in within the last 30 days, OR
  // 2. Made a referral within the last 30 days, OR
  // 3. Made a purchase/payment within the last 30 days
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Check if membership payment is current (indicates recent purchase)
  const hasCurrentMembership = new Date(member.membershipPaidUntil) >= new Date();
  
  // Check recent login or referral activity (if provided)
  const hasRecentLogin = lastLoginDate ? lastLoginDate >= thirtyDaysAgo : false;
  const hasRecentReferral = lastReferralDate ? lastReferralDate >= thirtyDaysAgo : false;
  
  return hasCurrentMembership || hasRecentLogin || hasRecentReferral;
}

export function isEligibleForFoundingMember(memberNumber: number | null): boolean {
  return memberNumber !== null && memberNumber <= FOUNDING_MEMBERS_LIMIT;
}

// Commission timing and payout functions
export function calculateAvailableDate(earnedDate: Date): Date {
  const availableDate = new Date(earnedDate);
  // With investor funding, we now use 30-day holding period instead of 3 months
  availableDate.setDate(availableDate.getDate() + COMMISSION_HOLDING_PERIOD_DAYS);
  return availableDate;
}

export function isCommissionAvailable(availableAt: Date): boolean {
  return new Date() >= new Date(availableAt);
}

export function getCommissionStatus(earnedAt: Date, availableAt: Date, paidAt: Date | null): 'holding' | 'available' | 'paid' {
  if (paidAt) return 'paid';
  if (isCommissionAvailable(availableAt)) return 'available';
  return 'holding';
}

// Helper function to check if member is eligible for spillover commissions
export function isMembershipCurrent(member: Member): boolean {
  return new Date(member.membershipPaidUntil) >= new Date();
}

// Commission Eligibility: Must be enrolled for 60+ days (2 paid months) before earning commissions
// "Separating the curious from the serious"
export function isCommissionEligible(member: Member): boolean {
  const joinDate = new Date(member.joinDate);
  const now = new Date();
  const daysSinceJoin = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
  return daysSinceJoin >= COMMISSION_ELIGIBILITY_DAYS;
}

// Account Grace Period: Returns account status based on payment history
// - "active": Membership is current
// - "grace_period": Membership expired but within 90-day return window
// - "expired": Past 90-day grace period, must rejoin as new member
export function getAccountStatus(member: Member): 'active' | 'grace_period' | 'expired' {
  // Trial members are active as long as their trial period hasn't ended
  if (member.subscriptionStatus === 'trial') {
    const trialEnd = member.founding50TrialEnds ? new Date(member.founding50TrialEnds) : null;
    if (!trialEnd || trialEnd >= new Date()) return 'active';
  }

  const now = new Date();
  const paidUntil = member.membershipPaidUntil ? new Date(member.membershipPaidUntil) : null;

  if (!paidUntil || isNaN(paidUntil.getTime())) return 'grace_period';
  if (paidUntil >= now) return 'active';
  
  const daysSinceExpiry = Math.floor((now.getTime() - paidUntil.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceExpiry <= ACCOUNT_GRACE_PERIOD_DAYS) return 'grace_period';
  
  return 'expired';
}

// Get days remaining in grace period (0 if active or expired)
export function getGracePeriodDaysRemaining(member: Member): number {
  const now = new Date();
  const paidUntil = new Date(member.membershipPaidUntil);
  
  if (paidUntil >= now) return 0; // Still active
  
  const daysSinceExpiry = Math.floor((now.getTime() - paidUntil.getTime()) / (1000 * 60 * 60 * 24));
  const remaining = ACCOUNT_GRACE_PERIOD_DAYS - daysSinceExpiry;
  return Math.max(0, remaining);
}

// Get days until commission eligibility (0 if already eligible)
export function getDaysUntilCommissionEligible(member: Member): number {
  const joinDate = new Date(member.joinDate);
  const now = new Date();
  const daysSinceJoin = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, COMMISSION_ELIGIBILITY_DAYS - daysSinceJoin);
}

// Helper function to get eligible downline members for spillover
export function calculateSpilloverEligibility(allMembers: Member[], sellerId: string): Member[] {
  const seller = allMembers.find(m => m.id === sellerId);
  if (!seller || !seller.referrerId) return [];
  
  // Find all members in the seller's upline who have current membership
  const eligibleMembers: Member[] = [];
  let currentMember = allMembers.find(m => m.id === seller.referrerId);
  
  // Traverse up the upline chain
  while (currentMember) {
    if (isMembershipCurrent(currentMember)) {
      eligibleMembers.push(currentMember);
    }
    // Move up one level
    currentMember = currentMember.referrerId ? 
      allMembers.find(m => m.id === currentMember!.referrerId) : 
      undefined;
  }
  
  return eligibleMembers;
}

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => members.id),
  senderName: text("sender_name").notNull(), // Denormalized for performance
  message: text("message").notNull(),
  isFromAdmin: boolean("is_from_admin").notNull().default(false), // Flag if message is from admin
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const onlinePresence = pgTable("online_presence", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull().references(() => members.id).unique(),
  memberName: text("member_name").notNull(), // Denormalized for performance
  isOnline: boolean("is_online").notNull().default(false),
  lastSeen: timestamp("last_seen").notNull().defaultNow(),
  socketId: text("socket_id"), // WebSocket connection ID
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull().references(() => members.id),
  tier: text("tier").notNull(), // "bronze", "silver", "gold", "platinum", "diamond"
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
  certificateUrl: text("certificate_url"), // Path to the certificate template image
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertOnlinePresenceSchema = createInsertSchema(onlinePresence).omit({
  id: true,
  updatedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  earnedAt: true,
});

export type Member = typeof members.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type AffiliateStats = typeof affiliateStats.$inferSelect;
export type InsertAffiliateStats = z.infer<typeof insertAffiliateStatsSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type CharityPreference = typeof charityPreferences.$inferSelect;
export type InsertCharityPreference = z.infer<typeof insertCharityPreferenceSchema>;
export type BankingInformation = typeof bankingInformation.$inferSelect;
export type InsertBankingInformation = z.infer<typeof insertBankingInformationSchema>;
export type SavingsAccount = typeof savingsAccounts.$inferSelect;
export type InsertSavingsAccount = z.infer<typeof insertSavingsAccountSchema>;
export type SavingsTransaction = typeof savingsTransactions.$inferSelect;
export type InsertSavingsTransaction = z.infer<typeof insertSavingsTransactionSchema>;

export type MetalBusinessCardOrder = typeof metalBusinessCardOrders.$inferSelect;
export type InsertMetalBusinessCardOrder = z.infer<typeof insertMetalBusinessCardOrderSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type OnlinePresence = typeof onlinePresence.$inferSelect;
export type InsertOnlinePresence = z.infer<typeof insertOnlinePresenceSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type LoginRequest = z.infer<typeof loginSchema>;
export type AffiliateTier = keyof typeof TIER_REQUIREMENTS;
export type CommissionType = keyof typeof COMMISSION_TYPES;

// API Response Types
export interface MemberResponse {
  member: Member;
}

export interface DashboardResponse {
  member: Member;
  stats: AffiliateStats;
  recentTransactions: Transaction[];
  recentReferrals: Array<{
    id: string;
    firstName: string;
    lastName: string;
    level: number;
    isActive: boolean;
    joinDate: string;
  }>;
}

export interface TierResponse {
  totalSales: number;
  commissionRate: number;
  bonusesEarned: number;
  nextTier?: {
    nextTier: string;
    salesNeeded: number;
  };
}

// Charity Search Types
export const prospects = pgTable("prospects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull().references(() => members.id),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  socialPlatform: text("social_platform"),
  socialHandle: text("social_handle"),
  marketType: text("market_type").notNull().default("warm"),
  status: text("status").notNull().default("new"),
  notes: text("notes"),
  followUpDate: timestamp("follow_up_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProspectSchema = createInsertSchema(prospects).omit({ id: true, createdAt: true });

export const pocketBoosterWaitlist = pgTable("pocket_booster_waitlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  email: text("email").notNull(),
  phone: text("phone"),
  memberId: varchar("member_id").references(() => members.id),
  loanAmount: text("loan_amount"),
  purpose: text("purpose"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const insertPocketBoosterWaitlistSchema = createInsertSchema(pocketBoosterWaitlist).omit({ id: true, joinedAt: true });
export type PocketBoosterWaitlist = typeof pocketBoosterWaitlist.$inferSelect;
export type InsertPocketBoosterWaitlist = z.infer<typeof insertPocketBoosterWaitlistSchema>;
export type InsertProspect = z.infer<typeof insertProspectSchema>;
export type Prospect = typeof prospects.$inferSelect;

export const hustleInvestments = pgTable("hustle_investments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull().references(() => members.id),
  tier: text("tier").notNull(), // "Basic" | "Growth" | "Elite"
  amount: integer("amount").notNull(), // in cents: 100000, 250000, 500000
  skillTrack: text("skill_track"),
  status: text("status").notNull().default("active"), // active | completed | paused
  investedAt: timestamp("invested_at").notNull().defaultNow(),
  currentPhase: integer("current_phase").notNull().default(1), // 1-5
  notes: text("notes"),
});

export const insertHustleInvestmentSchema = createInsertSchema(hustleInvestments).omit({ id: true, investedAt: true });
export type HustleInvestment = typeof hustleInvestments.$inferSelect;
export type InsertHustleInvestment = z.infer<typeof insertHustleInvestmentSchema>;

export interface CharitySearchResult {
  ein: string; // Employer Identification Number
  name: string; // Organization name
  city?: string; // City location
  state?: string; // State abbreviation
  website?: string; // Organization website
  category?: string; // NTEE category/classification
  revenue?: number; // Annual revenue in dollars
  assets?: number; // Total assets in dollars
}

export interface CharitySearchResponse {
  organizations: CharitySearchResult[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface CharityPreferenceResponse {
  preference: CharityPreference | null;
}
