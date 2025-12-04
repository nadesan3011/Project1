export interface DashboardFilters {
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  cardType: string;
  transactionType: string;
}

export interface TransactionData {
  date: string;
  volume: number;
}

export interface CardTypeData {
  type: string;
  count: number;
}

export interface FraudAlertData {
  date: string;
  alerts: number;
}

export interface TransactionTypeData {
  type: string;
  count: number;
}

export interface DashboardData {
  transactionVolume: TransactionData[];
  cardTypeDistribution: CardTypeData[];
  fraudAlerts: FraudAlertData[];
  transactionTypes: TransactionTypeData[];
}

export interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export interface FilterPanelProps {
  filters: DashboardFilters;
  onFilterChange: (filters: DashboardFilters) => void;
  onRefresh: () => void;
}

// ==================== Interview Prep Types ====================

export type JobType = 
  | 'software-engineer'
  | 'product-manager'
  | 'data-scientist'
  | 'marketing'
  | 'finance'
  | 'sales'
  | 'customer-service'
  | 'general';

export type InterviewDifficulty = 'entry' | 'mid' | 'senior';

export type SubscriptionTier = 'free' | 'pay-per-use' | 'monthly';

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: InterviewDifficulty;
  jobType: JobType;
}

export interface UserResponse {
  questionId: string;
  response: string;
  timestamp: Date;
}

export interface AIFeedback {
  questionId: string;
  score: number; // 1-10
  strengths: string[];
  improvements: string[];
  suggestions: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  jobType: JobType;
  difficulty: InterviewDifficulty;
  resumeText?: string;
  questions: InterviewQuestion[];
  responses: UserResponse[];
  feedback: AIFeedback[];
  overallScore?: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  subscriptionTier: SubscriptionTier;
  interviewsUsed: number;
  interviewsRemaining: number;
  createdAt: Date;
}

export interface ResumeData {
  fileName: string;
  fileSize: number;
  text: string;
  uploadedAt: Date;
}

export interface InterviewTranscript {
  sessionId: string;
  jobType: JobType;
  questions: Array<{
    question: string;
    response: string;
    feedback: AIFeedback;
  }>;
  overallScore: number;
  summary: string;
  generatedAt: Date;
}

export interface PricingPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  features: string[];
  interviewsIncluded: number | 'unlimited';
}

export interface AnalyticsData {
  totalInterviews: number;
  jobTypeBreakdown: Record<JobType, number>;
  averageScores: Record<JobType, number>;
  popularQuestions: Array<{ question: string; count: number }>;
  userRetention: number;
}
