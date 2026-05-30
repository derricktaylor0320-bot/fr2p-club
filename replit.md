# The FR2P Club - Financial Roadway 2 Prosperity

## Overview
The FR2P Club is an **affiliate marketing investment platform and movement** focused on digital education, professional training, industry certifications, and wealth-building. It operates on a "Get 5, Teach 5" duplication model, empowering members to achieve financial freedom by referring just five individuals and teaching them to do the same. The platform offers a simple $5/month flat commission per direct referral, enhanced commissions for early "Founding Members," and achievement tier recognition. Inspired by a legacy of "everybody can win" business models, FR2P integrates wealth-building opportunities with lifestyle benefits, aiming to create a community built on brotherhood, harmony, and entrepreneurship. The long-term vision includes an exclusive Executive Investor Tier and securing grant funding for sustained growth and competitive commission payout terms.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
FR2P employs a monorepo architecture with distinct client, server, and shared components.

**UI/UX:** The platform features a **navy blue (#001f3f) and metallic gold (#FFD700) luxury theme** with high-contrast design, PWA capabilities, and a real-time community chat. All core UI elements use consistent branding with navy gradient backgrounds and gold accents.

**Technical Implementations:**
*   **Frontend:** React with TypeScript, Vite, Wouter for routing, Tailwind CSS, and shadcn/ui. TanStack Query manages server state.
*   **Backend:** Express.js with TypeScript on Node.js, providing RESTful APIs for authentication, member management, and data.
*   **Database:** PostgreSQL with Drizzle ORM for type-safe operations, including `Members` (with sponsor relationships), `Network Stats`, `Transactions`, `chat_messages`, and `online_presence`.

**Feature Specifications:**
*   **Authentication:** Standard username/password registration and login. Auth state stored in localStorage via `client/src/lib/auth.ts`. Login page at `/login`. All member pages read `getLoggedInMemberId()` — falls back to `fr2p-founder` if not logged in. Logout button in sidebar footer. Trial/founding50 members auto-logged in after registration.
*   **Referral System:** Unique referral links, direct sign-ups, and manual referrer search. Includes a "sizzle call" CTA for prospects.
*   **Financial System:** Integrates Stripe for secure payments and subscriptions.
    *   **2-Tier Membership:** Standard ($35/month or $350/year) and Premium ($50/month or $500/year).
    *   **FTC-Compliant Single-Tier Commission:** Flat $5/month per direct referral — **PERMANENT residual income** that continues forever even if the referral cancels their membership. Referrals are "locked in" on first payment. Future goal: increase from $5 to $25 as momentum builds.
    *   **Founding Member Enhanced Rates:** Tier-based enhanced commissions (e.g., $16-$22/referral) and 2x achievement bonuses for the first 500 members.
    *   **Achievement Tier Bonuses:** One-time recognition bonuses for reaching referral milestones (Bronze to Diamond).
    *   **Commission Eligibility:** Members must be enrolled and paid for 2 consecutive months (60 days) before they're eligible to earn commissions. "Separating the curious from the serious."
    *   **Commission Hold:** 30-day hold period.
    *   **Account Grace Period:** If a member stops paying, their account stays in the system for 90 days. They can log back in and pick up where they left off. After 90 days, they must rejoin as a new member.
    *   **Automated Savings:** Automatic $35 deduction from commissions into a "Financial Asset Savings" account — only applies when monthly commission reaches $70+ (14+ referrals). Must earn at least double the deduction amount to qualify. $35 × 12 = $420/year, covering the annual membership cost.
*   **Network Management:** Visual representation of downline members across 5 circles of influence with a **5-tier achievement affiliate system** (Bronze to Diamond Affiliate Ambassador). Tracks real-time affiliate stats.
*   **Achievement Certificates:** Personalized navy and gold digital certificates awarded for each tier milestone, viewable and downloadable by members.
*   **FTC Compliance:** Strictly single-tier affiliate model, earning only from direct referrals.
*   **Profile Management:** Member profile updates, including charity preferences via ProPublica API, and profile picture storage readiness.
*   **Email System:** Automated welcome emails via Resend with referral links and member numbers.
*   **Donation System:** Stripe-powered page for contributions to the business.
*   **Legal Compliance:** Comprehensive Terms & Conditions outlining IBO status, tax reporting, commission hold, capital reserve, and charity options.
*   **Content:** Educational resources (e.g., tax deductions article) and product updates.
*   **Professional Development:** Curated recommendations for 6 professional learning platforms (Coursera, LinkedIn Learning, edX, Skillshare, Khan Academy, Google Career Certificates).
*   **KonnectMD Integration:** Premium membership ($50/month) is the *gateway* to the KonnectMD marketplace — not a bundled healthcare plan. Members choose and pay for their own KonnectMD plan directly at official prices (no markup). Full catalog listed: Lifestyle/Travel ($49.99 VIP Booking Engine, $99.99 Lifestyle), Healthcare ($59.99 Silver, $79.99 Gold, $99.99 Platinum, $149.99 Titanium bundle), and Add-Ons ($19.99 Pet Care, $29.99 Medical Bill Advocate, $375 GLP-1). FR2P = access gateway. KonnectMD = service provider. "No Double Payment" messaging is explicit throughout.
*   **Store Products:** Curated merchandise (NFC business cards, rings), affiliate products (TexterGram SMS), and digital resources.
*   **Financial Model Tool:** Interactive HTML spreadsheet (`/fr2p-financial-model.html`) demonstrating financial projections and commission mechanics.
*   **Ambassador Partnership Program:** Dedicated `/ambassador` page (also accessible at `/partner`) for influencer outreach. Features 3 tiers: FR2P Ambassador (100+ followers), Brand Architect (1K+ followers), and Founding Partner (10K+ followers). Includes application form capturing name, email, social handles, follower count, niche, and motivation. Designed to attract influencers before funding by offering status, titles, and future benefits instead of upfront payment. Ambassadors join as paying members and earn commissions on their referrals.
*   **Consolidatus Empire Integration:** FR2P is part of the larger Consolidatus Empire founded by Derrick Taylor. Includes hub page at `/empire` (also `/consolidators`) showcasing all partner businesses: Khomplete Khemistri Apparel & Accessories (https://kkmgllc2023-derricktaylor03.replit.app/), GuardConnect DMV Security, and Studio Business. Empire links appear in sidebar navigation, dashboard, and store page. Members get cross-platform access and discounts across all empire businesses.
*   **Digital Products:** One-time purchase digital products in the store ($7-$297) including Financial Reset Starter Kit, Side Hustle Blueprint, Credit Boost Accelerator, Budgeting Mastery Toolkit, Money Mindset Audio Series, and Lifetime Access Bundle. These generate income regardless of membership retention.
*   **FR2P Certification Program:** Dedicated `/certifications` page with 4 certification levels: Financial Literacy Fundamentals ($49), Affiliate Marketing Mastery ($99), Digital Entrepreneurship ($149), and Wealth Building & Legacy ($199). Complete bundle available for $399. One-time purchase, no membership required.
*   **Investment & Wealth Building:** Comprehensive `/investments` (also `/wealth-building`) page showcasing the full FR2P financial ecosystem. Sections include: Derrick Taylor's vision statement, multi-stream ecosystem overview (6 income streams), Real Estate (Fundrise + Roots REIT coming soon), FR2P Broker Access (ETF/index funds, retirement accounts), Banking & Lending Access (mortgages/auto/business loans via warm banker introductions), Invest Into FR2P Itself (future transparency dashboard with fund allocation breakdown), "Why It Costs More to Leave Than Stay" comparison, and multi-stream income projection table (Year 1/3/5).
*   **FR2P Wealth Monthly Magazine:** Dedicated `/magazine` page for the monthly email magazine subscription. Features magazine preview with 6 content sections (Member Success Stories, Six-Figure Blueprint, FR2P Program Updates, Protection & Progress Tips, Derrick's Corner, Monthly Free Resource). Includes subscription form with Resend welcome email, subscriber count tracking, sample issue previews, and Derrick Taylor founder quote. Dashboard promo banner links to the magazine page. Database table `magazine_subscribers` tracks email subscriptions with subscribe/unsubscribe functionality.
*   **Founding 50 Free Trial:** First 50 members can join completely free for 30 days (no credit card required). Join page shows a live counter of spots remaining that updates every 30 seconds. Free members get `isFounding50Member=true`, `subscriptionStatus="trial"`, and `founding50TrialEnds` set to 30 days out. Dashboard shows a gold trial countdown banner (turns red urgent warning in the final 7 days) with a "Convert to Paid" CTA. All 50 spots tracked via `/api/founding-fifty-status`. Free registration route at `/api/auth/register-founding50` bypasses Stripe entirely.
*   **Prospect Manager:** Dedicated `/prospects` page that embeds the Prospect Identifier tool (https://prospect-identifier.replit.app) inside the member back office. Included free with every membership. Allows members and content creators to track warm market and cold market prospects with name, address, contact info, and follow-up status. Accessible from sidebar and dashboard banner. Supports fullscreen mode and new-tab launch as fallback.
*   **Member Business Marketplace:** Dedicated `/marketplace` page where members advertise their own businesses. Free listing for every member (business name, description, logo, contact info, location). Paid featured packages: Featured Weekly ($25/week) and Featured Monthly ($100/month) via Stripe, enabling top placement, gold badge, weekly promo posts, and analytics (views/clicks). Database table `business_listings` stores all listings with member join for display. Revenue potential: 20 paid members = $2,000+/month in additional platform revenue.

**System Design Choices:**
*   **Monorepo Structure:** For organized development and shared components.
*   **Modern Web Stack:** Leveraging React, TypeScript, and Node.js for scalability and developer experience.
*   **Serverless Database:** Utilizing Neon for PostgreSQL to ensure scalability and cost-efficiency.
*   **Modular Component Library:** Using shadcn/ui for consistent and accessible UI components.

## External Dependencies
*   **React Ecosystem:** React 18, Vite, Wouter.
*   **UI Components:** Radix UI primitives, shadcn/ui.
*   **Database:** Drizzle ORM, Neon serverless PostgreSQL.
*   **Payment Gateway:** Stripe.
*   **Email Service:** Resend.
*   **Third-party APIs:** ProPublica API.
*   **Hosting:** Replit App Storage (Object Storage) for profile pictures.