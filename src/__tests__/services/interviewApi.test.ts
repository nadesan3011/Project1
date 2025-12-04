import { interviewApiService } from '../../services/interviewApi';

describe('InterviewApiService', () => {
  describe('getQuestions', () => {
    it('returns questions for software-engineer job type', () => {
      const questions = interviewApiService.getQuestions('software-engineer');
      expect(questions.length).toBeGreaterThan(0);
      expect(questions[0].jobType).toBe('software-engineer');
    });

    it('returns questions for general job type', () => {
      const questions = interviewApiService.getQuestions('general');
      expect(questions.length).toBeGreaterThan(0);
      expect(questions[0].jobType).toBe('general');
    });

    it('filters questions by difficulty', () => {
      const questions = interviewApiService.getQuestions('software-engineer', 'mid');
      questions.forEach((q) => {
        expect(q.difficulty).toBe('mid');
      });
    });

    it('returns questions for all job types', () => {
      const jobTypes = [
        'software-engineer',
        'product-manager',
        'data-scientist',
        'marketing',
        'finance',
        'sales',
        'customer-service',
        'general',
      ] as const;

      jobTypes.forEach((jobType) => {
        const questions = interviewApiService.getQuestions(jobType);
        expect(questions.length).toBeGreaterThan(0);
      });
    });
  });

  describe('analyzeResponse', () => {
    it('returns AI feedback for a response', async () => {
      const question = {
        id: 'test-1',
        question: 'Test question',
        category: 'behavioral',
        difficulty: 'mid' as const,
        jobType: 'general' as const,
      };
      const response = 'This is my test response to the question.';

      const feedback = await interviewApiService.analyzeResponse(question, response);

      expect(feedback).toHaveProperty('questionId', 'test-1');
      expect(feedback).toHaveProperty('score');
      expect(feedback.score).toBeGreaterThanOrEqual(1);
      expect(feedback.score).toBeLessThanOrEqual(10);
      expect(feedback).toHaveProperty('strengths');
      expect(feedback).toHaveProperty('improvements');
      expect(feedback).toHaveProperty('suggestions');
    });
  });

  describe('createSession', () => {
    it('creates a new interview session', async () => {
      const session = await interviewApiService.createSession(
        'user-123',
        'software-engineer',
        'mid'
      );

      expect(session).toHaveProperty('id');
      expect(session).toHaveProperty('userId', 'user-123');
      expect(session).toHaveProperty('jobType', 'software-engineer');
      expect(session).toHaveProperty('difficulty', 'mid');
      expect(session).toHaveProperty('questions');
      expect(session.questions.length).toBeGreaterThan(0);
      expect(session).toHaveProperty('responses');
      expect(session).toHaveProperty('feedback');
      expect(session).toHaveProperty('createdAt');
    });
  });

  describe('generateTranscript', () => {
    it('generates a transcript from a session', async () => {
      const session = await interviewApiService.createSession(
        'user-123',
        'general',
        'entry'
      );

      // Add mock responses and feedback
      session.responses = [
        {
          questionId: session.questions[0].id,
          response: 'Test response',
          timestamp: new Date(),
        },
      ];
      session.feedback = [
        {
          questionId: session.questions[0].id,
          score: 7,
          strengths: ['Good structure'],
          improvements: ['More examples'],
          suggestions: 'Add specific examples',
        },
      ];

      const transcript = interviewApiService.generateTranscript(session);

      expect(transcript).toHaveProperty('sessionId', session.id);
      expect(transcript).toHaveProperty('jobType', 'general');
      expect(transcript).toHaveProperty('questions');
      expect(transcript).toHaveProperty('overallScore');
      expect(transcript).toHaveProperty('summary');
      expect(transcript).toHaveProperty('generatedAt');
    });
  });

  describe('getPricingPlans', () => {
    it('returns pricing plans', () => {
      const plans = interviewApiService.getPricingPlans();

      expect(plans.length).toBe(3);
      expect(plans[0].tier).toBe('free');
      expect(plans[1].tier).toBe('pay-per-use');
      expect(plans[2].tier).toBe('monthly');
    });

    it('has correct pricing for each plan', () => {
      const plans = interviewApiService.getPricingPlans();

      expect(plans[0].price).toBe(0);
      expect(plans[1].price).toBe(2);
      expect(plans[2].price).toBe(10);
    });
  });

  describe('getUserProfile', () => {
    it('returns a user profile', async () => {
      const profile = await interviewApiService.getUserProfile('test@example.com');

      expect(profile).toHaveProperty('id');
      expect(profile).toHaveProperty('email', 'test@example.com');
      expect(profile).toHaveProperty('subscriptionTier', 'free');
      expect(profile).toHaveProperty('interviewsUsed');
      expect(profile).toHaveProperty('interviewsRemaining');
      expect(profile).toHaveProperty('createdAt');
    });
  });

  describe('getAnalytics', () => {
    it('returns analytics data', async () => {
      const analytics = await interviewApiService.getAnalytics();

      expect(analytics).toHaveProperty('totalInterviews');
      expect(analytics).toHaveProperty('jobTypeBreakdown');
      expect(analytics).toHaveProperty('averageScores');
      expect(analytics).toHaveProperty('popularQuestions');
      expect(analytics).toHaveProperty('userRetention');
    });
  });
});
