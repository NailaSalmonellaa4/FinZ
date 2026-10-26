// src/types/index.ts — Definisi Tipe Data TypeScript Bersama (DTO & API Responses)
// Referensi: AGENTS.md Section 3.3 — Tipe bersama di src/types/

// ─── Standardized API Response ────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiResponseMeta;
}

export interface ApiResponseMeta {
  xpGained?: number;
  leveledUp?: boolean;
  currentLevel?: number;
  currentXp?: number;
  totalItems?: number;
  page?: number;
  pageSize?: number;
}

// ─── User ─────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  virtualBalance: string; // BigInt serialized as string
  createdAt: string;
}

// ─── Transaction ──────────────────────────────────────────

export type TransactionTypeEnum = "INCOME" | "EXPENSE";

export interface TransactionItem {
  id: string;
  type: TransactionTypeEnum;
  category: string;
  amount: string; // BigInt serialized as string
  description: string;
  transactionDate: string;
  createdAt: string;
}

export const TRANSACTION_CATEGORIES = [
  "Makanan",
  "Transportasi",
  "Hiburan",
  "Belajar",
  "Uang Saku",
  "Lainnya",
] as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];

// ─── Budget ───────────────────────────────────────────────

export type BudgetStatusEnum = "SAFE" | "WARNING" | "OVERBUDGET";

export interface BudgetItem {
  id: string;
  category: string;
  limitAmount: string; // BigInt serialized as string
  spentAmount: string;
  remainingAmount: string;
  usagePercentage: number;
  status: BudgetStatusEnum;
  month: number;
  year: number;
}

// ─── Savings Goal ─────────────────────────────────────────

export type SavingsStatusEnum = "ACTIVE" | "COMPLETED";

export interface SavingsGoalItem {
  id: string;
  title: string;
  targetAmount: string;
  currentAmount: string;
  progressPercentage: number;
  targetDate: string | null;
  status: SavingsStatusEnum;
  createdAt: string;
}

// ─── Virtual Asset ────────────────────────────────────────

export interface VirtualAssetItem {
  id: string;
  code: string;
  name: string;
  category: string;
  riskProfile: string;
  currentPrice: string; // BigInt serialized as string
  description: string;
}

// ─── Portfolio ────────────────────────────────────────────

export interface PortfolioItem {
  id: string;
  assetId: string;
  assetCode: string;
  assetName: string;
  assetCategory: string;
  units: string; // Decimal serialized as string
  averageBuyPrice: string;
  currentPrice: string;
  marketValue: string;
  profitLoss: string;
  profitLossPercentage: number;
}

// ─── Investment History ───────────────────────────────────

export type InvestmentTradeTypeEnum = "BUY" | "SELL";

export interface InvestmentHistoryItem {
  id: string;
  assetCode: string;
  assetName: string;
  tradeType: InvestmentTradeTypeEnum;
  units: string; // Decimal serialized as string
  pricePerUnit: string;
  totalAmount: string;
  balanceAfter: string;
  createdAt: string;
}

// ─── Mission ──────────────────────────────────────────────

export type MissionTypeEnum =
  | "RECORD_TRANSACTION"
  | "CREATE_BUDGET"
  | "CREATE_SAVINGS"
  | "SIMULATE_INVESTMENT";

export interface MissionItem {
  id: string;
  title: string;
  description: string;
  missionType: MissionTypeEnum;
  targetCount: number;
  xpReward: number;
  currentCount: number;
  isCompleted: boolean;
  completedAt: string | null;
}

// ─── Dashboard ────────────────────────────────────────────

export interface DashboardData {
  user: UserProfile;
  cashflow: {
    totalIncome: string;
    totalExpense: string;
    netCashflow: string;
    month: number;
    year: number;
  };
  xpProgress: {
    currentXp: number;
    currentLevel: number;
    xpForNextLevel: number;
    progressPercentage: number;
  };
  budgetSummary: BudgetItem[];
  savingsSummary: SavingsGoalItem[];
  recentTransactions: TransactionItem[];
}

// ─── XP Constants ─────────────────────────────────────────

export const XP_REWARDS = {
  RECORD_TRANSACTION: 10,
  CREATE_BUDGET: 20,
  CREATE_SAVINGS: 25,
  SIMULATE_INVESTMENT: 30,
} as const;

export const XP_PER_LEVEL = 100;
export const MAX_DAILY_TRANSACTION_XP_CLAIMS = 5;
export const INITIAL_VIRTUAL_BALANCE = BigInt(10000000); // Rp 10.000.000
