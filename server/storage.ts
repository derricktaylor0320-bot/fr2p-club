import { type Member, type InsertMember, type AffiliateStats, type InsertAffiliateStats, type Transaction, type InsertTransaction, type CharityPreference, type InsertCharityPreference, type BankingInformation, type InsertBankingInformation, type MetalBusinessCardOrder, type InsertMetalBusinessCardOrder, type SavingsAccount, type InsertSavingsAccount, type SavingsTransaction, type InsertSavingsTransaction, type ChatMessage, type InsertChatMessage, type OnlinePresence, type InsertOnlinePresence, type Achievement, type InsertAchievement, type MagazineSubscriber, type InsertMagazineSubscriber, type BusinessListing, type InsertBusinessListing, getTierFromSales, getCommissionRate, calculateEligibleBonuses, calculateSpilloverEligibility, isMembershipCurrent, getCommissionAmount, getSpilloverRate, isEligibleForFoundingMember, calculateAvailableDate, calculateAnnualSavings, determineActivityStatus, AFFILIATE_TIERS, SPILLOVER_COMMISSION_RATE, COMMISSION_TYPES, FOUNDING_MEMBERS_LIMIT, AUTOMATIC_SAVINGS_DEDUCTION, SAVINGS_DEDUCTION_THRESHOLD, SAVINGS_WITHDRAWAL_PERIOD_MONTHS } from "@shared/schema";
import { members, affiliateStats, transactions, charityPreferences, bankingInformation, metalBusinessCardOrders, savingsAccounts, savingsTransactions, chatMessages, onlinePresence, achievements, magazineSubscribers, businessListings } from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc, and, count } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Member operations
  getMember(id: string): Promise<Member | undefined>;
  getMemberByUsername(username: string): Promise<Member | undefined>;
  getMemberByEmail(email: string): Promise<Member | undefined>;
  getAllMembers(): Promise<Member[]>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: string, updates: Partial<Member>): Promise<Member | undefined>;
  getMembersByLevel(referrerId: string, level: number): Promise<Member[]>;
  getDirectReferrals(referrerId: string): Promise<Member[]>;
  
  // Affiliate stats operations
  getAffiliateStats(memberId: string): Promise<AffiliateStats | undefined>;
  createAffiliateStats(stats: InsertAffiliateStats): Promise<AffiliateStats>;
  updateAffiliateStats(memberId: string, updates: Partial<AffiliateStats>): Promise<AffiliateStats | undefined>;
  
  // Transaction operations
  getTransactions(memberId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Dashboard data
  getDashboardData(memberId: string): Promise<{
    member: Member;
    stats: AffiliateStats;
    recentTransactions: Transaction[];
    recentReferrals: Member[];
  } | undefined>;
  
  // Tier management operations
  recordSale(memberId: string, saleAmount?: number): Promise<{ member: Member; bonusesAwarded: Array<{ amount: number; description: string }>; spilloverCommissions: Array<{ memberId: string; memberName: string; amount: number }> }>;
  getTierInfo(memberId: string): Promise<{
    currentTier: string;
    commissionRate: number;
    nextTier: { nextTier: string; salesNeeded: number } | null;
    totalSales: number;
    bonusesEarned: number;
    spilloverCommissions: number;
  } | undefined>;
  
  // Spillover commission operations
  getCommissionBreakdown(memberId: string): Promise<{
    directCommissions: Transaction[];
    spilloverCommissions: Transaction[];
    totalDirectAmount: number;
    totalSpilloverAmount: number;
  } | undefined>;
  
  // Membership operations  
  updateMembershipStatus(memberId: string): Promise<Member | undefined>;
  
  // Charity preference operations
  getCharityPreference(memberId: string): Promise<CharityPreference | undefined>;
  setCharityPreference(preference: InsertCharityPreference): Promise<CharityPreference>;
  deleteCharityPreference(memberId: string): Promise<boolean>;
  
  // Profile picture operations
  updateProfilePicture(memberId: string, picturePath: string): Promise<Member | undefined>;
  
  // Banking information operations
  getBankingInformation(memberId: string): Promise<BankingInformation | undefined>;
  setBankingInformation(bankingInfo: InsertBankingInformation): Promise<BankingInformation>;
  updateBankingInformation(memberId: string, updates: Partial<BankingInformation>): Promise<BankingInformation | undefined>;
  deleteBankingInformation(memberId: string): Promise<boolean>;
  
  // Metal business card order operations
  getMetalBusinessCardOrders(memberId: string): Promise<MetalBusinessCardOrder[]>;
  createMetalBusinessCardOrder(order: InsertMetalBusinessCardOrder): Promise<MetalBusinessCardOrder>;
  updateMetalBusinessCardOrder(orderId: string, updates: Partial<MetalBusinessCardOrder>): Promise<MetalBusinessCardOrder | undefined>;
  getMetalBusinessCardOrder(orderId: string): Promise<MetalBusinessCardOrder | undefined>;
  getAllMetalBusinessCardOrders(): Promise<MetalBusinessCardOrder[]>;
  
  // Financial Asset Savings operations
  getSavingsAccount(memberId: string): Promise<SavingsAccount | undefined>;
  createSavingsAccount(account: InsertSavingsAccount): Promise<SavingsAccount>;
  updateSavingsAccount(memberId: string, updates: Partial<SavingsAccount>): Promise<SavingsAccount | undefined>;
  addSavingsTransaction(transaction: InsertSavingsTransaction): Promise<SavingsTransaction>;
  getSavingsTransactions(memberId: string): Promise<SavingsTransaction[]>;
  getSavingsBalance(memberId: string): Promise<number>;
  canWithdrawFromSavings(memberId: string): Promise<boolean>;
  processAnnualWithdrawal(memberId: string, amount: number): Promise<{ success: boolean; message: string; transaction?: SavingsTransaction }>;
  processSavingsDeduction(memberId: string, sourceTransactionId: string, commissionAmount?: number): Promise<SavingsTransaction | undefined>;
  
  // Chat operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getRecentChatMessages(limit?: number): Promise<ChatMessage[]>;
  
  // Online presence operations
  upsertOnlinePresence(presence: InsertOnlinePresence): Promise<OnlinePresence>;
  updateOnlinePresence(memberId: string, isOnline: boolean): Promise<void>;
  getOnlineMembers(): Promise<OnlinePresence[]>;
  
  // Achievement operations
  getMemberAchievements(memberId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  checkAndAwardAchievements(memberId: string): Promise<Achievement[]>;

  // Magazine subscriber operations
  subscribeMagazine(subscriber: InsertMagazineSubscriber): Promise<MagazineSubscriber>;
  unsubscribeMagazine(email: string): Promise<boolean>;
  getMagazineSubscription(email: string): Promise<MagazineSubscriber | undefined>;
  getMagazineSubscriberCount(): Promise<number>;

  // Business listing (marketplace) operations
  getAllBusinessListings(): Promise<(BusinessListing & { memberFirstName: string; memberLastName: string })[]>;
  getBusinessListingByMember(memberId: string): Promise<BusinessListing | undefined>;
  createBusinessListing(listing: InsertBusinessListing): Promise<BusinessListing>;
  updateBusinessListing(id: string, updates: Partial<BusinessListing>): Promise<BusinessListing | undefined>;
  deleteBusinessListing(id: string): Promise<boolean>;
  trackBusinessListingView(id: string): Promise<void>;
  trackBusinessListingClick(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private members: Map<string, Member>;
  private affiliateStats: Map<string, AffiliateStats>;
  private transactions: Map<string, Transaction>;
  private charityPreferences: Map<string, CharityPreference>;
  private bankingInformation: Map<string, BankingInformation>;
  private metalBusinessCardOrders: Map<string, MetalBusinessCardOrder>;
  private savingsAccounts: Map<string, SavingsAccount>;
  private savingsTransactions: Map<string, SavingsTransaction>;
  private nextMemberNumber: number = 1; // Track sequential member numbers

  constructor() {
    this.members = new Map();
    this.affiliateStats = new Map();
    this.transactions = new Map();
    this.charityPreferences = new Map();
    this.bankingInformation = new Map();
    this.metalBusinessCardOrders = new Map();
    this.savingsAccounts = new Map();
    this.savingsTransactions = new Map();
    
    // Create demo user
    this.initializeDemoData();
  }

  private async initializeDemoData() {
    const demoMember: Member = {
      id: "fr2p-founder",
      username: "fr2pfounder",
      email: "founder@fr2pclub.com",
      password: "password123",
      firstName: "Founder",
      lastName: "FR2P",
      profilePicture: null,
      referrerId: null,
      level: 1,
      isActive: true,
      rank: "Founder & CEO",
      membershipPlan: "premium",
      affiliateTier: AFFILIATE_TIERS.DIAMOND,
      totalSales: 3150,
      memberNumber: 1, // Founder is member #1
      isFoundingMember: true,
      isActiveMember: true, // Founder is always active
      bonusesEarned: 166000, // $1,660 in bonuses (all tier bonuses)
      spilloverCommissions: 95000, // $950 in spillover commissions
      membershipPaidUntil: new Date("2026-01-01"), // Lifetime membership
      lastMembershipPayment: new Date("2024-01-01"),
      joinDate: new Date("2024-01-01"),
    };
    
    this.nextMemberNumber = 2; // Next member will be #2
    
    this.members.set(demoMember.id, demoMember);
    
    const demoStats: AffiliateStats = {
      id: randomUUID(),
      memberId: demoMember.id,
      level1Count: 5,
      level2Count: 25,
      level3Count: 125,
      level4Count: 0,
      level5Count: 0,
      totalReferrals: 155, // Only 3 tiers: 5 + 25 + 125 = 155
      monthlyCommissions: 1952500, // $19,525 in cents
      updatedAt: new Date(),
    };
    
    this.affiliateStats.set(demoMember.id, demoStats);
    
    // Create some demo referrals
    const referrals = [
      { name: "Sarah Miller", level: 1 },
      { name: "Mike Johnson", level: 2 },
      { name: "Jessica Davis", level: 1 },
      { name: "David Wilson", level: 3 },
      { name: "Emily Brown", level: 1 },
    ];
    
    referrals.forEach((referral, index) => {
      const totalSales = Math.floor(Math.random() * 15); // Random sales between 0-14
      const memberNumber = this.nextMemberNumber++;
      const isFoundingMember = memberNumber <= FOUNDING_MEMBERS_LIMIT;
      
      const member: Member = {
        id: `referral-${index + 1}`,
        username: referral.name.toLowerCase().replace(" ", ""),
        email: `${referral.name.toLowerCase().replace(" ", ".")}@example.com`,
        password: "password123",
        firstName: referral.name.split(" ")[0],
        lastName: referral.name.split(" ")[1],
        profilePicture: null,
        referrerId: demoMember.id,
        level: referral.level,
        isActive: Math.random() > 0.3,
        rank: isFoundingMember ? "Founding Member" : "Active Affiliate",
        membershipPlan: "monthly",
        isActiveMember: Math.random() > 0.2, // 80% are active members
        affiliateTier: getTierFromSales(totalSales),
        totalSales,
        memberNumber,
        isFoundingMember,
        bonusesEarned: totalSales >= 5 ? (isFoundingMember ? 10000 : 5000) : 0, // Double bonus for founding members
        spilloverCommissions: Math.floor(Math.random() * 2500), // Random spillover earnings
        membershipPaidUntil: Math.random() > 0.3 ? new Date("2025-01-01") : new Date("2024-06-01"), // Some have expired memberships
        lastMembershipPayment: new Date(2024, 0, 5 + index),
        joinDate: new Date(2024, 0, 10 + index),
      };
      this.members.set(member.id, member);
      
      // Create transactions with proper commission timing
      const earnedDate = new Date(2024, 0, 15 + index);
      const transaction: Transaction = {
        id: randomUUID(),
        memberId: member.id,
        amount: isFoundingMember ? 5000 : 2500, // Founding members get $50, regular get $25
        type: "commission",
        commissionType: "direct",
        sourceTransactionId: null,
        sourceMemberId: null,
        status: "holding", // All commissions start in holding period
        earnedAt: earnedDate,
        availableAt: calculateAvailableDate(earnedDate),
        paidAt: null,
        description: `Direct referral commission from ${demoMember.firstName} ${demoMember.lastName}${isFoundingMember ? ' (Founding Member 2x)' : ''}`,
        createdAt: earnedDate,
      };
      this.transactions.set(transaction.id, transaction);
    });
  }

  async getMember(id: string): Promise<Member | undefined> {
    return this.members.get(id);
  }

  async getMemberByUsername(username: string): Promise<Member | undefined> {
    return Array.from(this.members.values()).find(
      (member) => member.username === username,
    );
  }

  async getMemberByEmail(email: string): Promise<Member | undefined> {
    return Array.from(this.members.values()).find(
      (member) => member.email === email,
    );
  }

  async getAllMembers(): Promise<Member[]> {
    return Array.from(this.members.values());
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    const id = randomUUID();
    const memberNumber = this.nextMemberNumber++;
    const isFoundingMember = memberNumber <= FOUNDING_MEMBERS_LIMIT;
    
    const member: Member = { 
      ...insertMember, 
      id,
      profilePicture: null,
      referrerId: insertMember.referrerId || null,
      level: insertMember.level || 1,
      isActive: insertMember.isActive ?? false,
      rank: isFoundingMember ? "Founding Member" : (insertMember.rank || "Affiliate"),
      membershipPlan: "monthly",
      affiliateTier: "bronze",
      totalSales: 0,
      memberNumber,
      isFoundingMember,
      isActiveMember: insertMember.isActiveMember ?? true, // Default to active
      bonusesEarned: 0,
      spilloverCommissions: 0,
      membershipPaidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      lastMembershipPayment: new Date(),
      joinDate: new Date(),
    };
    this.members.set(id, member);
    
    // Create initial affiliate stats
    const stats: AffiliateStats = {
      id: randomUUID(),
      memberId: id,
      level1Count: 0,
      level2Count: 0,
      level3Count: 0,
      level4Count: 0,
      level5Count: 0,
      totalReferrals: 0,
      monthlyCommissions: 0,
      updatedAt: new Date(),
    };
    this.affiliateStats.set(id, stats);
    
    return member;
  }

  async updateMember(id: string, updates: Partial<Member>): Promise<Member | undefined> {
    const member = this.members.get(id);
    if (!member) return undefined;
    
    const updatedMember = { ...member, ...updates };
    this.members.set(id, updatedMember);
    return updatedMember;
  }

  async getMembersByLevel(referrerId: string, level: number): Promise<Member[]> {
    return Array.from(this.members.values()).filter(
      (member) => member.referrerId === referrerId && member.level === level,
    );
  }

  async getDirectReferrals(referrerId: string): Promise<Member[]> {
    return Array.from(this.members.values()).filter(
      (member) => member.referrerId === referrerId,
    );
  }

  async getAffiliateStats(memberId: string): Promise<AffiliateStats | undefined> {
    return this.affiliateStats.get(memberId);
  }

  async createAffiliateStats(stats: InsertAffiliateStats): Promise<AffiliateStats> {
    const id = randomUUID();
    const affiliateStat: AffiliateStats = { 
      ...stats, 
      id,
      level1Count: stats.level1Count || 0,
      level2Count: stats.level2Count || 0,
      level3Count: stats.level3Count || 0,
      level4Count: stats.level4Count || 0,
      level5Count: stats.level5Count || 0,
      totalReferrals: stats.totalReferrals || 0,
      monthlyCommissions: stats.monthlyCommissions || 0,
      updatedAt: new Date(),
    };
    this.affiliateStats.set(stats.memberId, affiliateStat);
    return affiliateStat;
  }

  async updateAffiliateStats(memberId: string, updates: Partial<AffiliateStats>): Promise<AffiliateStats | undefined> {
    const stats = this.affiliateStats.get(memberId);
    if (!stats) return undefined;
    
    const updatedStats = { ...stats, ...updates, updatedAt: new Date() };
    this.affiliateStats.set(memberId, updatedStats);
    return updatedStats;
  }

  async getTransactions(memberId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.memberId === memberId,
    );
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const earnedAt = transaction.earnedAt || new Date();
    const newTransaction: Transaction = { 
      ...transaction, 
      id,
      commissionType: transaction.commissionType || null,
      sourceTransactionId: transaction.sourceTransactionId || null,
      sourceMemberId: transaction.sourceMemberId || null,
      status: transaction.status || "holding",
      earnedAt,
      availableAt: transaction.availableAt || calculateAvailableDate(earnedAt),
      paidAt: transaction.paidAt || null,
      description: transaction.description || "Commission payment",
      createdAt: new Date(),
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  async getDashboardData(memberId: string): Promise<{
    member: Member;
    stats: AffiliateStats;
    recentTransactions: Transaction[];
    recentReferrals: Member[];
  } | undefined> {
    const member = await this.getMember(memberId);
    if (!member) return undefined;
    
    const stats = await this.getAffiliateStats(memberId);
    if (!stats) return undefined;
    
    const recentTransactions = await this.getTransactions(memberId);
    const recentReferrals = await this.getDirectReferrals(memberId);
    
    return {
      member,
      stats,
      recentTransactions: recentTransactions.slice(0, 10),
      recentReferrals: recentReferrals.slice(0, 10),
    };
  }

  async recordSale(memberId: string, saleAmount: number = 5000): Promise<{ member: Member; bonusesAwarded: Array<{ amount: number; description: string }>; spilloverCommissions: Array<{ memberId: string; memberName: string; amount: number }> }> {
    const member = await this.getMember(memberId);
    if (!member) {
      throw new Error("Member not found");
    }

    const previousSales = member.totalSales;
    const newTotalSales = previousSales + 1;
    const newTier = getTierFromSales(newTotalSales);
    
    // Calculate eligible bonuses
    const bonusesAwarded = calculateEligibleBonuses(newTotalSales, previousSales);
    const totalBonusAmount = bonusesAwarded.reduce((sum, bonus) => sum + bonus.amount, 0);
    
    // Update member with new sales count, tier, and bonuses
    const updatedMember = await this.updateMember(memberId, {
      totalSales: newTotalSales,
      affiliateTier: newTier,
      bonusesEarned: member.bonusesEarned + totalBonusAmount
    });

    if (!updatedMember) {
      throw new Error("Failed to update member");
    }

    // Create commission transaction
    const commissionRate = getCommissionRate(newTier);
    const commissionTransaction = await this.createTransaction({
      memberId,
      amount: commissionRate * 100, // Convert to cents
      type: "commission",
      commissionType: COMMISSION_TYPES.DIRECT,
      status: "holding",
      availableAt: calculateAvailableDate(new Date()),
      description: `Direct referral commission - ${newTier} tier`
    });

    // Automatically deduct up to $35 to Financial Asset Savings from commission
    // (capped at commission amount to prevent negative cash)
    await this.processSavingsDeduction(memberId, commissionTransaction.id, commissionRate * 100);

    // Create bonus transactions
    for (const bonus of bonusesAwarded) {
      await this.createTransaction({
        memberId,
        amount: bonus.amount,
        type: "bonus",
        status: "holding",
        availableAt: calculateAvailableDate(new Date()),
        description: bonus.description
      });
    }

    // Distribute spillover commissions
    const allMembers = Array.from(this.members.values());
    const eligibleSpilloverMembers = calculateSpilloverEligibility(allMembers, memberId);
    const spilloverCommissions: Array<{ memberId: string; memberName: string; amount: number }> = [];
    
    for (const spilloverMember of eligibleSpilloverMembers) {
      // Create spillover commission transaction
      const spilloverTransaction = await this.createTransaction({
        memberId: spilloverMember.id,
        amount: SPILLOVER_COMMISSION_RATE,
        type: "commission",
        commissionType: COMMISSION_TYPES.SPILLOVER,
        sourceTransactionId: commissionTransaction.id,
        sourceMemberId: memberId,
        status: "holding",
        availableAt: calculateAvailableDate(new Date()),
        description: `Spillover commission from ${updatedMember.firstName} ${updatedMember.lastName}`
      });

      // Automatically deduct up to $35 to Financial Asset Savings from spillover commission
      // (capped at spillover amount to prevent negative cash)
      await this.processSavingsDeduction(spilloverMember.id, spilloverTransaction.id, SPILLOVER_COMMISSION_RATE);
      
      // Update spillover commissions total for the member
      await this.updateMember(spilloverMember.id, {
        spilloverCommissions: spilloverMember.spilloverCommissions + SPILLOVER_COMMISSION_RATE
      });
      
      spilloverCommissions.push({
        memberId: spilloverMember.id,
        memberName: `${spilloverMember.firstName} ${spilloverMember.lastName}`,
        amount: SPILLOVER_COMMISSION_RATE
      });
    }

    return { member: updatedMember, bonusesAwarded, spilloverCommissions };
  }

  async getTierInfo(memberId: string): Promise<{
    currentTier: string;
    commissionRate: number;
    nextTier: { nextTier: string; salesNeeded: number } | null;
    totalSales: number;
    bonusesEarned: number;
    spilloverCommissions: number;
  } | undefined> {
    const member = await this.getMember(memberId);
    if (!member) return undefined;

    const currentTier = member.affiliateTier;
    const commissionRate = getCommissionRate(currentTier as any);
    const nextTierInfo = this.getNextTierInfo(member.totalSales);

    return {
      currentTier,
      commissionRate,
      nextTier: nextTierInfo,
      totalSales: member.totalSales,
      bonusesEarned: member.bonusesEarned,
      spilloverCommissions: member.spilloverCommissions
    };
  }

  async getCommissionBreakdown(memberId: string): Promise<{
    directCommissions: Transaction[];
    spilloverCommissions: Transaction[];
    totalDirectAmount: number;
    totalSpilloverAmount: number;
  } | undefined> {
    const member = await this.getMember(memberId);
    if (!member) return undefined;
    
    const allTransactions = await this.getTransactions(memberId);
    
    const directCommissions = allTransactions.filter(
      t => t.type === 'commission' && t.commissionType === COMMISSION_TYPES.DIRECT
    );
    
    const spilloverCommissions = allTransactions.filter(
      t => t.type === 'commission' && t.commissionType === COMMISSION_TYPES.SPILLOVER
    );
    
    const totalDirectAmount = directCommissions.reduce((sum, t) => sum + t.amount, 0);
    const totalSpilloverAmount = spilloverCommissions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      directCommissions,
      spilloverCommissions,
      totalDirectAmount,
      totalSpilloverAmount
    };
  }
  
  async updateMembershipStatus(memberId: string): Promise<Member | undefined> {
    const member = await this.getMember(memberId);
    if (!member) return undefined;
    
    // Extend membership by 30 days
    const newExpirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    return await this.updateMember(memberId, {
      membershipPaidUntil: newExpirationDate,
      lastMembershipPayment: new Date()
    });
  }

  private getNextTierInfo(currentSales: number): { nextTier: string; salesNeeded: number } | null {
    if (currentSales < 5) {
      return { nextTier: "Silver", salesNeeded: 5 - currentSales };
    }
    if (currentSales < 20) {
      return { nextTier: "Gold", salesNeeded: 20 - currentSales };
    }
    return null; // Already at highest tier
  }
  
  // Charity preference operations
  async getCharityPreference(memberId: string): Promise<CharityPreference | undefined> {
    return Array.from(this.charityPreferences.values()).find(
      (preference) => preference.memberId === memberId
    );
  }

  async setCharityPreference(insertPreference: InsertCharityPreference): Promise<CharityPreference> {
    // Remove existing preference for this member
    await this.deleteCharityPreference(insertPreference.memberId);
    
    const id = randomUUID();
    const preference: CharityPreference = {
      ...insertPreference,
      id,
      city: insertPreference.city || null,
      state: insertPreference.state || null,
      website: insertPreference.website || null,
      source: insertPreference.source || "propublica",
      selectedAt: new Date(),
    };
    
    this.charityPreferences.set(id, preference);
    return preference;
  }

  async deleteCharityPreference(memberId: string): Promise<boolean> {
    const existingPreference = await this.getCharityPreference(memberId);
    if (existingPreference) {
      this.charityPreferences.delete(existingPreference.id);
      return true;
    }
    return false;
  }
  
  // Profile picture operations
  async updateProfilePicture(memberId: string, picturePath: string): Promise<Member | undefined> {
    const member = await this.getMember(memberId);
    if (!member) return undefined;
    
    return await this.updateMember(memberId, {
      profilePicture: picturePath
    });
  }
  
  // Banking information operations
  async getBankingInformation(memberId: string): Promise<BankingInformation | undefined> {
    return Array.from(this.bankingInformation.values()).find(
      (banking) => banking.memberId === memberId
    );
  }

  async setBankingInformation(insertBankingInfo: InsertBankingInformation): Promise<BankingInformation> {
    // Remove existing banking info for this member
    await this.deleteBankingInformation(insertBankingInfo.memberId);
    
    const id = randomUUID();
    const bankingInfo: BankingInformation = {
      ...insertBankingInfo,
      id,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.bankingInformation.set(id, bankingInfo);
    return bankingInfo;
  }

  async updateBankingInformation(memberId: string, updates: Partial<BankingInformation>): Promise<BankingInformation | undefined> {
    const existingBanking = await this.getBankingInformation(memberId);
    if (!existingBanking) return undefined;
    
    const updatedBanking: BankingInformation = {
      ...existingBanking,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.bankingInformation.set(existingBanking.id, updatedBanking);
    return updatedBanking;
  }

  async deleteBankingInformation(memberId: string): Promise<boolean> {
    const existingBanking = await this.getBankingInformation(memberId);
    if (existingBanking) {
      this.bankingInformation.delete(existingBanking.id);
      return true;
    }
    return false;
  }

  // Metal Business Card Order Methods
  async getMetalBusinessCardOrders(memberId: string): Promise<MetalBusinessCardOrder[]> {
    const orders = Array.from(this.metalBusinessCardOrders.values());
    return orders.filter(order => order.memberId === memberId);
  }

  async createMetalBusinessCardOrder(insertOrder: InsertMetalBusinessCardOrder): Promise<MetalBusinessCardOrder> {
    const id = randomUUID();
    const order: MetalBusinessCardOrder = {
      ...insertOrder,
      id,
      status: insertOrder.status || "pending",
      paymentStatus: insertOrder.paymentStatus || "pending",
      customerPhone: insertOrder.customerPhone || null,
      qrCodeUrl: insertOrder.qrCodeUrl || null,
      customText: insertOrder.customText || null,
      shippingAddress2: insertOrder.shippingAddress2 || null,
      amazonOrderId: insertOrder.amazonOrderId || null,
      trackingNumber: insertOrder.trackingNumber || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.metalBusinessCardOrders.set(id, order);
    return order;
  }

  async updateMetalBusinessCardOrder(orderId: string, updates: Partial<MetalBusinessCardOrder>): Promise<MetalBusinessCardOrder | undefined> {
    const existingOrder = this.metalBusinessCardOrders.get(orderId);
    if (!existingOrder) return undefined;
    
    const updatedOrder: MetalBusinessCardOrder = {
      ...existingOrder,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.metalBusinessCardOrders.set(orderId, updatedOrder);
    return updatedOrder;
  }

  async getMetalBusinessCardOrder(orderId: string): Promise<MetalBusinessCardOrder | undefined> {
    return this.metalBusinessCardOrders.get(orderId);
  }

  async getAllMetalBusinessCardOrders(): Promise<MetalBusinessCardOrder[]> {
    return Array.from(this.metalBusinessCardOrders.values());
  }

  // Financial Asset Savings Methods
  async getSavingsAccount(memberId: string): Promise<SavingsAccount | undefined> {
    const accounts = Array.from(this.savingsAccounts.values());
    return accounts.find(account => account.memberId === memberId);
  }

  async createSavingsAccount(account: InsertSavingsAccount): Promise<SavingsAccount> {
    const id = randomUUID();
    const now = new Date();
    const nextWithdrawalDate = new Date();
    nextWithdrawalDate.setFullYear(nextWithdrawalDate.getFullYear() + 1); // Next year
    
    const savingsAccount: SavingsAccount = {
      id,
      memberId: account.memberId,
      balance: account.balance || 0,
      totalDeposited: account.totalDeposited || 0,
      totalWithdrawn: account.totalWithdrawn || 0,
      lastWithdrawalDate: account.lastWithdrawalDate || null,
      nextWithdrawalDate,
      createdAt: now,
      updatedAt: now,
    };
    
    this.savingsAccounts.set(id, savingsAccount);
    return savingsAccount;
  }

  async updateSavingsAccount(memberId: string, updates: Partial<SavingsAccount>): Promise<SavingsAccount | undefined> {
    const existingAccount = await this.getSavingsAccount(memberId);
    if (!existingAccount) return undefined;
    
    const updatedAccount: SavingsAccount = {
      ...existingAccount,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.savingsAccounts.set(existingAccount.id, updatedAccount);
    return updatedAccount;
  }

  async addSavingsTransaction(transaction: InsertSavingsTransaction): Promise<SavingsTransaction> {
    const id = randomUUID();
    const savingsTransaction: SavingsTransaction = {
      id,
      savingsAccountId: transaction.savingsAccountId,
      memberId: transaction.memberId,
      amount: transaction.amount,
      type: transaction.type,
      source: transaction.source || null,
      sourceTransactionId: transaction.sourceTransactionId || null,
      description: transaction.description,
      createdAt: new Date(),
    };
    
    this.savingsTransactions.set(id, savingsTransaction);
    
    // Update Financial Asset Savings balance
    const account = await this.getSavingsAccount(transaction.memberId);
    if (account) {
      const newBalance = account.balance + transaction.amount;
      const totalDeposited = transaction.amount > 0 ? account.totalDeposited + transaction.amount : account.totalDeposited;
      const totalWithdrawn = transaction.amount < 0 ? account.totalWithdrawn + Math.abs(transaction.amount) : account.totalWithdrawn;
      
      await this.updateSavingsAccount(transaction.memberId, {
        balance: newBalance,
        totalDeposited,
        totalWithdrawn,
      });
    }
    
    return savingsTransaction;
  }

  async getSavingsTransactions(memberId: string): Promise<SavingsTransaction[]> {
    const transactions = Array.from(this.savingsTransactions.values());
    return transactions.filter(transaction => transaction.memberId === memberId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getSavingsBalance(memberId: string): Promise<number> {
    const account = await this.getSavingsAccount(memberId);
    return account?.balance || 0;
  }

  async canWithdrawFromSavings(memberId: string): Promise<boolean> {
    const account = await this.getSavingsAccount(memberId);
    if (!account) return false;
    
    const now = new Date();
    return account.nextWithdrawalDate ? now >= account.nextWithdrawalDate : true;
  }

  async processAnnualWithdrawal(memberId: string, amount: number): Promise<{ success: boolean; message: string; transaction?: SavingsTransaction }> {
    const canWithdraw = await this.canWithdrawFromSavings(memberId);
    const account = await this.getSavingsAccount(memberId);
    
    if (!account) {
      return { success: false, message: "Financial Asset Savings not found" };
    }
    
    if (!canWithdraw) {
      const nextDate = account.nextWithdrawalDate?.toLocaleDateString() || "unknown";
      return { success: false, message: `Annual withdrawal not available until ${nextDate}` };
    }
    
    if (amount > account.balance) {
      return { success: false, message: `Insufficient funds. Available balance: $${(account.balance / 100).toFixed(2)}` };
    }
    
    if (amount <= 0) {
      return { success: false, message: "Withdrawal amount must be greater than $0" };
    }
    
    // Process withdrawal
    const transaction = await this.addSavingsTransaction({
      savingsAccountId: account.id,
      memberId,
      amount: -amount, // Negative for withdrawal
      type: "withdrawal",
      source: "annual_withdrawal",
      description: `Annual savings withdrawal: $${(amount / 100).toFixed(2)}`,
    });
    
    // Update next withdrawal date (1 year from now)
    const nextWithdrawalDate = new Date();
    nextWithdrawalDate.setFullYear(nextWithdrawalDate.getFullYear() + 1);
    
    await this.updateSavingsAccount(memberId, {
      lastWithdrawalDate: new Date(),
      nextWithdrawalDate,
    });
    
    return { 
      success: true, 
      message: `Successfully withdrew $${(amount / 100).toFixed(2)} from Financial Asset Savings`,
      transaction 
    };
  }

  async processSavingsDeduction(memberId: string, sourceTransactionId: string, commissionAmount?: number): Promise<SavingsTransaction | undefined> {
    // Ensure Financial Asset Savings exists
    let account = await this.getSavingsAccount(memberId);
    if (!account) {
      account = await this.createSavingsAccount({
        memberId,
        balance: 0,
        totalDeposited: 0,
        totalWithdrawn: 0,
        lastWithdrawalDate: null,
        nextWithdrawalDate: null,
      });
    }
    
    // Only deduct $35 when monthly commission is at least $70
    // Members must earn at least double the deduction amount to qualify
    // - Commission < $70: No savings deduction (keep full commission)
    // - Commission >= $70: $35 goes to savings, remainder is cash
    if (commissionAmount !== undefined && commissionAmount < SAVINGS_DEDUCTION_THRESHOLD) {
      return undefined;
    }
    
    const deductionAmount = AUTOMATIC_SAVINGS_DEDUCTION;
    
    const transaction = await this.addSavingsTransaction({
      savingsAccountId: account.id,
      memberId,
      amount: deductionAmount,
      type: "deposit",
      source: "commission_deduction",
      sourceTransactionId,
      description: `Automatic savings deduction: $${(deductionAmount / 100).toFixed(2)}`,
    });
    
    return transaction;
  }
}

export class DatabaseStorage implements IStorage {
  // Member operations
  async getMember(id: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member || undefined;
  }

  async getMemberByUsername(username: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.username, username));
    return member || undefined;
  }

  async getMemberByEmail(email: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.email, email));
    return member || undefined;
  }

  async getAllMembers(): Promise<Member[]> {
    return await db.select().from(members);
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    // Get the next member number for founding member status
    const [countResult] = await db.select({ count: count() }).from(members);
    const nextMemberNumber = countResult.count + 1;
    
    const memberData = {
      ...insertMember,
      id: randomUUID(),
      memberNumber: nextMemberNumber,
      isFoundingMember: nextMemberNumber <= FOUNDING_MEMBERS_LIMIT,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const [member] = await db.insert(members).values(memberData).returning();
    
    // Create affiliate stats for the new member
    await this.createAffiliateStats({
      memberId: member.id,
      level1Count: 0,
      level2Count: 0,
      level3Count: 0,
      level4Count: 0,
      level5Count: 0,
      totalReferrals: 0,
      monthlyCommissions: 0,
    });
    
    // Update referrer's stats if this member was referred by someone
    if (member.referrerId) {
      const referrerStats = await this.getAffiliateStats(member.referrerId);
      
      if (referrerStats) {
        // Increment referrer's level 1 count and total referrals
        await this.updateAffiliateStats(member.referrerId, {
          level1Count: referrerStats.level1Count + 1,
          totalReferrals: referrerStats.totalReferrals + 1,
        });
      } else {
        // Create stats for referrer if they don't exist yet
        await this.createAffiliateStats({
          memberId: member.referrerId,
          level1Count: 1,
          level2Count: 0,
          level3Count: 0,
          level4Count: 0,
          level5Count: 0,
          totalReferrals: 1,
          monthlyCommissions: 0,
        });
      }
    }
    
    return member;
  }

  async updateMember(id: string, updates: Partial<Member>): Promise<Member | undefined> {
    const [member] = await db
      .update(members)
      .set(updates)
      .where(eq(members.id, id))
      .returning();
    return member || undefined;
  }

  // Profile picture operations
  async updateProfilePicture(memberId: string, picturePath: string): Promise<Member | undefined> {
    return await this.updateMember(memberId, { profilePicture: picturePath });
  }

  private memStorage = new MemStorage();

  // Banking information operations
  async getBankingInformation(memberId: string): Promise<BankingInformation | undefined> {
    const [banking] = await db
      .select()
      .from(bankingInformation)
      .where(eq(bankingInformation.memberId, memberId))
      .limit(1);
    return banking || undefined;
  }

  async setBankingInformation(insertBankingInfo: InsertBankingInformation): Promise<BankingInformation> {
    // Delete existing banking info for this member first
    await db.delete(bankingInformation).where(eq(bankingInformation.memberId, insertBankingInfo.memberId));
    
    const bankingData = {
      ...insertBankingInfo,
      id: randomUUID(),
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const [banking] = await db.insert(bankingInformation).values(bankingData).returning();
    return banking;
  }

  async updateBankingInformation(memberId: string, updates: Partial<BankingInformation>): Promise<BankingInformation | undefined> {
    const [banking] = await db
      .update(bankingInformation)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(bankingInformation.memberId, memberId))
      .returning();
    return banking || undefined;
  }

  async deleteBankingInformation(memberId: string): Promise<boolean> {
    const result = await db
      .delete(bankingInformation)
      .where(eq(bankingInformation.memberId, memberId));
    return result.rowCount > 0;
  }

  // Chat message operations
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getRecentChatMessages(limit: number = 50): Promise<ChatMessage[]> {
    const messages = await db
      .select()
      .from(chatMessages)
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
    return messages.reverse(); // Return in chronological order
  }

  // Online presence operations
  async upsertOnlinePresence(presence: InsertOnlinePresence): Promise<OnlinePresence> {
    const [existingPresence] = await db
      .select()
      .from(onlinePresence)
      .where(eq(onlinePresence.memberId, presence.memberId));

    if (existingPresence) {
      const [updated] = await db
        .update(onlinePresence)
        .set({
          ...presence,
          updatedAt: new Date(),
        })
        .where(eq(onlinePresence.memberId, presence.memberId))
        .returning();
      return updated;
    } else {
      const [newPresence] = await db
        .insert(onlinePresence)
        .values(presence)
        .returning();
      return newPresence;
    }
  }

  async updateOnlinePresence(memberId: string, isOnline: boolean): Promise<void> {
    await db
      .update(onlinePresence)
      .set({
        isOnline,
        lastSeen: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(onlinePresence.memberId, memberId));
  }

  async getOnlineMembers(): Promise<OnlinePresence[]> {
    const onlineMembers = await db
      .select()
      .from(onlinePresence)
      .where(eq(onlinePresence.isOnline, true))
      .orderBy(onlinePresence.memberName);
    return onlineMembers;
  }

  async getMembersByLevel(referrerId: string, level: number): Promise<Member[]> {
    return await db
      .select()
      .from(members)
      .where(and(eq(members.referrerId, referrerId), eq(members.level, level)));
  }

  async getDirectReferrals(referrerId: string): Promise<Member[]> {
    return await db
      .select()
      .from(members)
      .where(eq(members.referrerId, referrerId))
      .orderBy(desc(members.joinDate));
  }

  async getAffiliateStats(memberId: string): Promise<AffiliateStats | undefined> {
    const [stats] = await db
      .select()
      .from(affiliateStats)
      .where(eq(affiliateStats.memberId, memberId));
    return stats || undefined;
  }

  async createAffiliateStats(stats: InsertAffiliateStats): Promise<AffiliateStats> {
    const statsData = {
      id: randomUUID(),
      ...stats,
      level1Count: stats.level1Count || 0,
      level2Count: stats.level2Count || 0,
      level3Count: stats.level3Count || 0,
      level4Count: stats.level4Count || 0,
      level5Count: stats.level5Count || 0,
      totalReferrals: stats.totalReferrals || 0,
      monthlyCommissions: stats.monthlyCommissions || 0,
      updatedAt: new Date(),
    };

    const [newStats] = await db.insert(affiliateStats).values(statsData).returning();
    return newStats;
  }

  async updateAffiliateStats(memberId: string, updates: Partial<AffiliateStats>): Promise<AffiliateStats | undefined> {
    const [updatedStats] = await db
      .update(affiliateStats)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(affiliateStats.memberId, memberId))
      .returning();
    return updatedStats || undefined;
  }

  async getTransactions(memberId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.memberId, memberId))
      .orderBy(desc(transactions.createdAt));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const earnedAt = transaction.earnedAt || new Date();
    const transactionData = {
      id: randomUUID(),
      ...transaction,
      commissionType: transaction.commissionType || null,
      sourceTransactionId: transaction.sourceTransactionId || null,
      sourceMemberId: transaction.sourceMemberId || null,
      status: transaction.status || "holding",
      earnedAt,
      availableAt: transaction.availableAt || calculateAvailableDate(earnedAt),
      paidAt: transaction.paidAt || null,
      description: transaction.description || "Commission payment",
      createdAt: new Date(),
    };

    const [newTransaction] = await db.insert(transactions).values(transactionData).returning();
    return newTransaction;
  }

  async getDashboardData(memberId: string): Promise<{
    member: Member;
    stats: AffiliateStats;
    recentTransactions: Transaction[];
    recentReferrals: Member[];
  } | undefined> {
    const member = await this.getMember(memberId);
    if (!member) return undefined;
    
    const stats = await this.getAffiliateStats(memberId);
    if (!stats) return undefined;
    
    const recentTransactions = await this.getTransactions(memberId);
    const recentReferrals = await this.getDirectReferrals(memberId);
    
    return {
      member,
      stats,
      recentTransactions: recentTransactions.slice(0, 10),
      recentReferrals: recentReferrals.slice(0, 10),
    };
  }

  // For now, implement remaining methods with MemStorage fallback until full migration
  recordSale = this.memStorage.recordSale.bind(this.memStorage);
  getTierInfo = this.memStorage.getTierInfo.bind(this.memStorage);
  getCommissionBreakdown = this.memStorage.getCommissionBreakdown.bind(this.memStorage);
  updateMembershipStatus = this.memStorage.updateMembershipStatus.bind(this.memStorage);
  getCharityPreference = this.memStorage.getCharityPreference.bind(this.memStorage);
  setCharityPreference = this.memStorage.setCharityPreference.bind(this.memStorage);
  deleteCharityPreference = this.memStorage.deleteCharityPreference.bind(this.memStorage);
  getMetalBusinessCardOrders = this.memStorage.getMetalBusinessCardOrders.bind(this.memStorage);
  createMetalBusinessCardOrder = this.memStorage.createMetalBusinessCardOrder.bind(this.memStorage);
  updateMetalBusinessCardOrder = this.memStorage.updateMetalBusinessCardOrder.bind(this.memStorage);
  getMetalBusinessCardOrder = this.memStorage.getMetalBusinessCardOrder.bind(this.memStorage);
  getAllMetalBusinessCardOrders = this.memStorage.getAllMetalBusinessCardOrders.bind(this.memStorage);
  getSavingsAccount = this.memStorage.getSavingsAccount.bind(this.memStorage);
  createSavingsAccount = this.memStorage.createSavingsAccount.bind(this.memStorage);
  updateSavingsAccount = this.memStorage.updateSavingsAccount.bind(this.memStorage);
  getSavingsTransactions = this.memStorage.getSavingsTransactions.bind(this.memStorage);
  addSavingsTransaction = this.memStorage.addSavingsTransaction.bind(this.memStorage);
  getSavingsBalance = this.memStorage.getSavingsBalance.bind(this.memStorage);
  canWithdrawFromSavings = this.memStorage.canWithdrawFromSavings.bind(this.memStorage);
  processAnnualWithdrawal = this.memStorage.processAnnualWithdrawal.bind(this.memStorage);
  processSavingsDeduction = this.memStorage.processSavingsDeduction.bind(this.memStorage);
  
  // Achievement operations
  async getMemberAchievements(memberId: string): Promise<Achievement[]> {
    return await db.select().from(achievements).where(eq(achievements.memberId, memberId)).orderBy(achievements.earnedAt);
  }
  
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const achievementData = {
      id: randomUUID(),
      ...achievement,
      earnedAt: new Date(),
    };
    
    const [newAchievement] = await db.insert(achievements).values(achievementData).returning();
    return newAchievement;
  }
  
  async checkAndAwardAchievements(memberId: string): Promise<Achievement[]> {
    const member = await this.getMember(memberId);
    if (!member) return [];
    
    const existingAchievements = await this.getMemberAchievements(memberId);
    const earnedTiers = new Set(existingAchievements.map(a => a.tier));
    const newAchievements: Achievement[] = [];
    
    const currentTier = getTierFromSales(member.totalSales);
    const tierHierarchy = [AFFILIATE_TIERS.BRONZE, AFFILIATE_TIERS.SILVER, AFFILIATE_TIERS.GOLD, AFFILIATE_TIERS.PLATINUM, AFFILIATE_TIERS.DIAMOND];
    const currentTierIndex = tierHierarchy.indexOf(currentTier);
    
    for (let i = 0; i <= currentTierIndex; i++) {
      const tier = tierHierarchy[i];
      if (!earnedTiers.has(tier)) {
        const achievement = await this.createAchievement({
          memberId: member.id,
          tier: tier,
          certificateUrl: `/attached_assets/certificate_${tier}.jpg`,
        });
        newAchievements.push(achievement);
      }
    }
    
    return newAchievements;
  }
  async subscribeMagazine(subscriber: InsertMagazineSubscriber): Promise<MagazineSubscriber> {
    const existing = await this.getMagazineSubscription(subscriber.email);
    if (existing) {
      if (!existing.isSubscribed) {
        const [updated] = await db.update(magazineSubscribers)
          .set({ isSubscribed: true, unsubscribedAt: null, firstName: subscriber.firstName, lastName: subscriber.lastName, memberId: subscriber.memberId })
          .where(eq(magazineSubscribers.email, subscriber.email))
          .returning();
        return updated;
      }
      return existing;
    }
    const [result] = await db.insert(magazineSubscribers).values(subscriber).returning();
    return result;
  }

  async unsubscribeMagazine(email: string): Promise<boolean> {
    const result = await db.update(magazineSubscribers)
      .set({ isSubscribed: false, unsubscribedAt: new Date() })
      .where(eq(magazineSubscribers.email, email))
      .returning();
    return result.length > 0;
  }

  async getMagazineSubscription(email: string): Promise<MagazineSubscriber | undefined> {
    const [result] = await db.select().from(magazineSubscribers).where(eq(magazineSubscribers.email, email));
    return result;
  }

  async getMagazineSubscriberCount(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(magazineSubscribers).where(eq(magazineSubscribers.isSubscribed, true));
    return result?.count || 0;
  }

  async getAllBusinessListings(): Promise<(BusinessListing & { memberFirstName: string; memberLastName: string })[]> {
    const listings = await db
      .select({
        id: businessListings.id,
        memberId: businessListings.memberId,
        businessName: businessListings.businessName,
        tagline: businessListings.tagline,
        description: businessListings.description,
        category: businessListings.category,
        logoUrl: businessListings.logoUrl,
        website: businessListings.website,
        phone: businessListings.phone,
        email: businessListings.email,
        city: businessListings.city,
        state: businessListings.state,
        packageType: businessListings.packageType,
        featuredUntil: businessListings.featuredUntil,
        weeklyPromo: businessListings.weeklyPromo,
        stripePaymentId: businessListings.stripePaymentId,
        isActive: businessListings.isActive,
        viewCount: businessListings.viewCount,
        clickCount: businessListings.clickCount,
        createdAt: businessListings.createdAt,
        updatedAt: businessListings.updatedAt,
        memberFirstName: members.firstName,
        memberLastName: members.lastName,
      })
      .from(businessListings)
      .leftJoin(members, eq(businessListings.memberId, members.id))
      .where(eq(businessListings.isActive, true))
      .orderBy(desc(businessListings.packageType), desc(businessListings.createdAt));
    return listings as (BusinessListing & { memberFirstName: string; memberLastName: string })[];
  }

  async getBusinessListingByMember(memberId: string): Promise<BusinessListing | undefined> {
    const [listing] = await db.select().from(businessListings).where(eq(businessListings.memberId, memberId));
    return listing;
  }

  async createBusinessListing(listing: InsertBusinessListing): Promise<BusinessListing> {
    const [created] = await db.insert(businessListings).values(listing).returning();
    return created;
  }

  async updateBusinessListing(id: string, updates: Partial<BusinessListing>): Promise<BusinessListing | undefined> {
    const [updated] = await db.update(businessListings).set({ ...updates, updatedAt: new Date() }).where(eq(businessListings.id, id)).returning();
    return updated;
  }

  async deleteBusinessListing(id: string): Promise<boolean> {
    const result = await db.delete(businessListings).where(eq(businessListings.id, id));
    return true;
  }

  async trackBusinessListingView(id: string): Promise<void> {
    await db.update(businessListings).set({ viewCount: sql`${businessListings.viewCount} + 1` }).where(eq(businessListings.id, id));
  }

  async trackBusinessListingClick(id: string): Promise<void> {
    await db.update(businessListings).set({ clickCount: sql`${businessListings.clickCount} + 1` }).where(eq(businessListings.id, id));
  }
}

// Create instance
export const storage = new DatabaseStorage();
