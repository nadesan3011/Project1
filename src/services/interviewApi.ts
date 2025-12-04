import axios, { AxiosInstance } from 'axios';
import {
  JobType,
  InterviewDifficulty,
  InterviewQuestion,
  AIFeedback,
  InterviewSession,
  UserProfile,
  InterviewTranscript,
  PricingPlan,
  AnalyticsData,
} from '../types';

/**
 * Interview API Service
 * Handles all interview-related API communications
 */
class InterviewApiService {
  private client: AxiosInstance;
  private mockDataEnabled: boolean;

  constructor(baseURL: string = 'https://api.interviewprep.com', useMock: boolean = true) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.mockDataEnabled = useMock;
  }

  /**
   * Pre-defined question sets for different job types
   */
  private questionSets: Record<JobType, InterviewQuestion[]> = {
    'software-engineer': [
      { id: 'se-1', question: 'Tell me about a challenging technical problem you solved recently.', category: 'behavioral', difficulty: 'mid', jobType: 'software-engineer' },
      { id: 'se-2', question: 'How do you approach code reviews?', category: 'technical', difficulty: 'mid', jobType: 'software-engineer' },
      { id: 'se-3', question: 'Describe your experience with system design.', category: 'technical', difficulty: 'senior', jobType: 'software-engineer' },
      { id: 'se-4', question: 'How do you handle disagreements with team members on technical decisions?', category: 'behavioral', difficulty: 'mid', jobType: 'software-engineer' },
      { id: 'se-5', question: 'Walk me through your debugging process.', category: 'technical', difficulty: 'entry', jobType: 'software-engineer' },
    ],
    'product-manager': [
      { id: 'pm-1', question: 'How do you prioritize features in a product roadmap?', category: 'strategy', difficulty: 'mid', jobType: 'product-manager' },
      { id: 'pm-2', question: 'Describe a product you launched from ideation to release.', category: 'behavioral', difficulty: 'mid', jobType: 'product-manager' },
      { id: 'pm-3', question: 'How do you handle stakeholder conflicts?', category: 'behavioral', difficulty: 'senior', jobType: 'product-manager' },
      { id: 'pm-4', question: 'What metrics would you use to measure product success?', category: 'strategy', difficulty: 'mid', jobType: 'product-manager' },
      { id: 'pm-5', question: 'How do you gather and incorporate user feedback?', category: 'strategy', difficulty: 'entry', jobType: 'product-manager' },
    ],
    'data-scientist': [
      { id: 'ds-1', question: 'Explain a machine learning project you worked on end-to-end.', category: 'technical', difficulty: 'mid', jobType: 'data-scientist' },
      { id: 'ds-2', question: 'How do you handle imbalanced datasets?', category: 'technical', difficulty: 'mid', jobType: 'data-scientist' },
      { id: 'ds-3', question: 'Describe your approach to feature engineering.', category: 'technical', difficulty: 'senior', jobType: 'data-scientist' },
      { id: 'ds-4', question: 'How do you communicate complex findings to non-technical stakeholders?', category: 'behavioral', difficulty: 'mid', jobType: 'data-scientist' },
      { id: 'ds-5', question: 'What tools and frameworks are you most comfortable with?', category: 'technical', difficulty: 'entry', jobType: 'data-scientist' },
    ],
    'marketing': [
      { id: 'mk-1', question: 'Describe a successful marketing campaign you led.', category: 'behavioral', difficulty: 'mid', jobType: 'marketing' },
      { id: 'mk-2', question: 'How do you measure ROI on marketing initiatives?', category: 'strategy', difficulty: 'mid', jobType: 'marketing' },
      { id: 'mk-3', question: 'What is your approach to content strategy?', category: 'strategy', difficulty: 'mid', jobType: 'marketing' },
      { id: 'mk-4', question: 'How do you stay updated with digital marketing trends?', category: 'behavioral', difficulty: 'entry', jobType: 'marketing' },
      { id: 'mk-5', question: 'Describe your experience with marketing automation tools.', category: 'technical', difficulty: 'mid', jobType: 'marketing' },
    ],
    'finance': [
      { id: 'fn-1', question: 'Walk me through a financial model you built.', category: 'technical', difficulty: 'mid', jobType: 'finance' },
      { id: 'fn-2', question: 'How do you approach risk assessment?', category: 'strategy', difficulty: 'mid', jobType: 'finance' },
      { id: 'fn-3', question: 'Describe a time you identified a cost-saving opportunity.', category: 'behavioral', difficulty: 'mid', jobType: 'finance' },
      { id: 'fn-4', question: 'What financial reporting tools are you proficient in?', category: 'technical', difficulty: 'entry', jobType: 'finance' },
      { id: 'fn-5', question: 'How do you ensure accuracy in financial analysis?', category: 'behavioral', difficulty: 'mid', jobType: 'finance' },
    ],
    'sales': [
      { id: 'sl-1', question: 'Describe your most successful sale and what made it successful.', category: 'behavioral', difficulty: 'mid', jobType: 'sales' },
      { id: 'sl-2', question: 'How do you handle rejection in sales?', category: 'behavioral', difficulty: 'entry', jobType: 'sales' },
      { id: 'sl-3', question: 'What is your approach to prospecting new clients?', category: 'strategy', difficulty: 'mid', jobType: 'sales' },
      { id: 'sl-4', question: 'How do you build long-term client relationships?', category: 'behavioral', difficulty: 'senior', jobType: 'sales' },
      { id: 'sl-5', question: 'Describe your experience with CRM systems.', category: 'technical', difficulty: 'entry', jobType: 'sales' },
    ],
    'customer-service': [
      { id: 'cs-1', question: 'How do you handle an angry customer?', category: 'behavioral', difficulty: 'entry', jobType: 'customer-service' },
      { id: 'cs-2', question: 'Describe a time you went above and beyond for a customer.', category: 'behavioral', difficulty: 'mid', jobType: 'customer-service' },
      { id: 'cs-3', question: 'How do you prioritize multiple customer requests?', category: 'strategy', difficulty: 'mid', jobType: 'customer-service' },
      { id: 'cs-4', question: 'What tools do you use for customer support?', category: 'technical', difficulty: 'entry', jobType: 'customer-service' },
      { id: 'cs-5', question: "How do you handle a situation where you don't know the answer?", category: 'behavioral', difficulty: 'entry', jobType: 'customer-service' },
    ],
    'general': [
      { id: 'gn-1', question: 'Tell me about yourself.', category: 'behavioral', difficulty: 'entry', jobType: 'general' },
      { id: 'gn-2', question: 'What are your greatest strengths and weaknesses?', category: 'behavioral', difficulty: 'entry', jobType: 'general' },
      { id: 'gn-3', question: 'Where do you see yourself in 5 years?', category: 'behavioral', difficulty: 'entry', jobType: 'general' },
      { id: 'gn-4', question: 'Why do you want to work for our company?', category: 'behavioral', difficulty: 'entry', jobType: 'general' },
      { id: 'gn-5', question: 'Describe a challenging situation and how you handled it.', category: 'behavioral', difficulty: 'mid', jobType: 'general' },
    ],
  };

  /**
   * Get questions for a specific job type and difficulty
   */
  getQuestions(jobType: JobType, difficulty?: InterviewDifficulty): InterviewQuestion[] {
    let questions = this.questionSets[jobType] || this.questionSets['general'];
    if (difficulty) {
      questions = questions.filter((q) => q.difficulty === difficulty);
    }
    return questions;
  }

  /**
   * Generate mock AI feedback for a response
   */
  private generateMockFeedback(questionId: string, response: string): AIFeedback {
    // Score constants for mock feedback generation
    const MIN_SCORE = 6;
    const SCORE_RANGE = 4; // Results in scores 6-10
    const STRONG_SCORE_THRESHOLD = 8;
    const CONCISE_RESPONSE_THRESHOLD = 100;

    const score = Math.floor(Math.random() * SCORE_RANGE) + MIN_SCORE;
    const strengths = [
      'Clear communication',
      'Good structure',
      'Specific examples provided',
      'Demonstrated relevant experience',
    ].slice(0, Math.floor(Math.random() * 3) + 1);

    const improvements = [
      'Could provide more specific metrics',
      'Consider using the STAR method',
      'Add more context about the outcome',
      'Be more concise',
    ].slice(0, Math.floor(Math.random() * 2) + 1);

    return {
      questionId,
      score,
      strengths,
      improvements,
      suggestions: `Your response demonstrates ${
        score >= STRONG_SCORE_THRESHOLD ? 'strong' : 'good'
      } understanding. ${
        response.length > CONCISE_RESPONSE_THRESHOLD
          ? 'Consider being more concise while maintaining key details.'
          : 'Try to elaborate more with specific examples.'
      }`,
    };
  }

  /**
   * Analyze a user response using AI (mock or real OpenAI)
   */
  async analyzeResponse(
    question: InterviewQuestion,
    response: string,
    resumeText?: string
  ): Promise<AIFeedback> {
    if (this.mockDataEnabled) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return this.generateMockFeedback(question.id, response);
    }

    try {
      const result = await this.client.post<AIFeedback>('/interview/analyze', {
        question: question.question,
        response,
        resumeText,
        jobType: question.jobType,
      });
      return result.data;
    } catch (error) {
      console.error('Error analyzing response:', error);
      throw new Error('Failed to analyze response');
    }
  }

  /**
   * Generate tailored interview questions based on resume
   */
  async generateTailoredQuestions(
    resumeText: string,
    jobType: JobType,
    count: number = 5
  ): Promise<InterviewQuestion[]> {
    if (this.mockDataEnabled) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return this.getQuestions(jobType).slice(0, count);
    }

    try {
      const result = await this.client.post<InterviewQuestion[]>('/interview/generate-questions', {
        resumeText,
        jobType,
        count,
      });
      return result.data;
    } catch (error) {
      console.error('Error generating questions:', error);
      throw new Error('Failed to generate questions');
    }
  }

  /**
   * Create a new interview session
   */
  async createSession(
    userId: string,
    jobType: JobType,
    difficulty: InterviewDifficulty,
    resumeText?: string
  ): Promise<InterviewSession> {
    const questions = resumeText
      ? await this.generateTailoredQuestions(resumeText, jobType)
      : this.getQuestions(jobType, difficulty);

    const session: InterviewSession = {
      id: `session-${Date.now()}`,
      userId,
      jobType,
      difficulty,
      resumeText,
      questions,
      responses: [],
      feedback: [],
      createdAt: new Date(),
    };

    // In a real app, this would be saved to a database
    if (!this.mockDataEnabled) {
      try {
        const result = await this.client.post<InterviewSession>('/session/create', session);
        return result.data;
      } catch (error) {
        console.error('Error creating session:', error);
        throw new Error('Failed to create session');
      }
    }

    return session;
  }

  /**
   * Generate interview transcript
   */
  generateTranscript(session: InterviewSession): InterviewTranscript {
    const questions = session.questions.map((q, index) => ({
      question: q.question,
      response: session.responses[index]?.response || 'No response provided',
      feedback: session.feedback[index] || {
        questionId: q.id,
        score: 0,
        strengths: [],
        improvements: [],
        suggestions: 'Not evaluated',
      },
    }));

    const overallScore =
      session.feedback.length > 0
        ? session.feedback.reduce((sum, f) => sum + f.score, 0) / session.feedback.length
        : 0;

    return {
      sessionId: session.id,
      jobType: session.jobType,
      questions,
      overallScore: Math.round(overallScore * 10) / 10,
      summary: `Interview practice for ${session.jobType} position. Overall performance: ${
        overallScore >= 8 ? 'Excellent' : overallScore >= 6 ? 'Good' : 'Needs Improvement'
      }`,
      generatedAt: new Date(),
    };
  }

  /**
   * Get pricing plans
   */
  getPricingPlans(): PricingPlan[] {
    return [
      {
        id: 'free',
        name: 'Free Trial',
        tier: 'free',
        price: 0,
        features: [
          '1 free interview',
          'Basic feedback',
          'Email transcript',
        ],
        interviewsIncluded: 1,
      },
      {
        id: 'pay-per-use',
        name: 'Pay Per Interview',
        tier: 'pay-per-use',
        price: 2,
        features: [
          '$2 per interview',
          'AI-powered feedback',
          'Downloadable reports',
          'Resume-tailored questions',
        ],
        interviewsIncluded: 1,
      },
      {
        id: 'monthly',
        name: 'Pro Monthly',
        tier: 'monthly',
        price: 10,
        features: [
          'Unlimited interviews',
          'Advanced AI feedback',
          'Priority support',
          'All job types',
          'Performance analytics',
        ],
        interviewsIncluded: 'unlimited',
      },
    ];
  }

  /**
   * Get mock user profile
   */
  async getUserProfile(email: string): Promise<UserProfile> {
    if (this.mockDataEnabled) {
      return {
        id: `user-${Date.now()}`,
        email,
        subscriptionTier: 'free',
        interviewsUsed: 0,
        interviewsRemaining: 1,
        createdAt: new Date(),
      };
    }

    try {
      const result = await this.client.get<UserProfile>(`/user/profile/${email}`);
      return result.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  /**
   * Get analytics data (mock)
   */
  async getAnalytics(): Promise<AnalyticsData> {
    return {
      totalInterviews: 1547,
      jobTypeBreakdown: {
        'software-engineer': 450,
        'product-manager': 280,
        'data-scientist': 220,
        'marketing': 180,
        'finance': 150,
        'sales': 120,
        'customer-service': 97,
        'general': 50,
      },
      averageScores: {
        'software-engineer': 7.2,
        'product-manager': 7.5,
        'data-scientist': 7.0,
        'marketing': 7.8,
        'finance': 7.3,
        'sales': 7.6,
        'customer-service': 7.9,
        'general': 7.1,
      },
      popularQuestions: [
        { question: 'Tell me about yourself', count: 892 },
        { question: 'Describe a challenging project', count: 654 },
        { question: 'Where do you see yourself in 5 years?', count: 523 },
      ],
      userRetention: 72.5,
    };
  }

  /**
   * Enable or disable mock data
   */
  setMockDataEnabled(enabled: boolean): void {
    this.mockDataEnabled = enabled;
  }
}

// Export singleton instance
export const interviewApiService = new InterviewApiService();
export default InterviewApiService;
