import { sessionStorageService } from '../../services/sessionStorage';
import { InterviewSession, InterviewTranscript } from '../../types';

// Create a proper localStorage mock that persists between calls
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
};

const localStorageMock = createLocalStorageMock();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('SessionStorageService', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('saveSession and getSession', () => {
    it('saves and retrieves a session', () => {
      const session: InterviewSession = {
        id: 'session-123',
        userId: 'user-123',
        jobType: 'software-engineer',
        difficulty: 'mid',
        questions: [],
        responses: [],
        feedback: [],
        createdAt: new Date(),
      };

      sessionStorageService.saveSession(session);
      const retrieved = sessionStorageService.getSession('session-123');

      expect(retrieved).toBeTruthy();
      expect(retrieved?.id).toBe('session-123');
      expect(retrieved?.jobType).toBe('software-engineer');
    });

    it('returns null for non-existent session', () => {
      const session = sessionStorageService.getSession('non-existent');
      expect(session).toBeNull();
    });
  });

  describe('getAllSessions', () => {
    it('returns empty array when no sessions exist', () => {
      const sessions = sessionStorageService.getAllSessions();
      expect(sessions).toEqual([]);
    });

    it('returns all saved sessions', () => {
      const session1: InterviewSession = {
        id: 'session-1',
        userId: 'user-123',
        jobType: 'software-engineer',
        difficulty: 'mid',
        questions: [],
        responses: [],
        feedback: [],
        createdAt: new Date(),
      };
      const session2: InterviewSession = {
        id: 'session-2',
        userId: 'user-123',
        jobType: 'product-manager',
        difficulty: 'senior',
        questions: [],
        responses: [],
        feedback: [],
        createdAt: new Date(),
      };

      sessionStorageService.saveSession(session1);
      sessionStorageService.saveSession(session2);

      const sessions = sessionStorageService.getAllSessions();
      expect(sessions.length).toBe(2);
    });
  });

  describe('deleteSession', () => {
    it('deletes a session', () => {
      const session: InterviewSession = {
        id: 'session-to-delete',
        userId: 'user-123',
        jobType: 'general',
        difficulty: 'entry',
        questions: [],
        responses: [],
        feedback: [],
        createdAt: new Date(),
      };

      sessionStorageService.saveSession(session);
      expect(sessionStorageService.getSession('session-to-delete')).toBeTruthy();

      sessionStorageService.deleteSession('session-to-delete');
      expect(sessionStorageService.getSession('session-to-delete')).toBeNull();
    });
  });

  describe('currentSession', () => {
    it('sets and gets current session', () => {
      const session: InterviewSession = {
        id: 'current-session',
        userId: 'user-123',
        jobType: 'marketing',
        difficulty: 'mid',
        questions: [],
        responses: [],
        feedback: [],
        createdAt: new Date(),
      };

      sessionStorageService.setCurrentSession(session);
      const current = sessionStorageService.getCurrentSession();

      expect(current).toBeTruthy();
      expect(current?.id).toBe('current-session');
    });

    it('clears current session', () => {
      const session: InterviewSession = {
        id: 'current-session',
        userId: 'user-123',
        jobType: 'marketing',
        difficulty: 'mid',
        questions: [],
        responses: [],
        feedback: [],
        createdAt: new Date(),
      };

      sessionStorageService.setCurrentSession(session);
      sessionStorageService.clearCurrentSession();

      expect(sessionStorageService.getCurrentSession()).toBeNull();
    });
  });

  describe('generateTranscriptText', () => {
    it('generates text transcript', () => {
      const transcript: InterviewTranscript = {
        sessionId: 'session-123',
        jobType: 'software-engineer',
        questions: [
          {
            question: 'Tell me about yourself',
            response: 'I am a software developer...',
            feedback: {
              questionId: 'q1',
              score: 8,
              strengths: ['Clear communication'],
              improvements: ['More specific examples'],
              suggestions: 'Add metrics to your response',
            },
          },
        ],
        overallScore: 8,
        summary: 'Excellent interview performance',
        generatedAt: new Date(),
      };

      const text = sessionStorageService.generateTranscriptText(transcript);

      expect(text).toContain('INTERVIEW TRANSCRIPT');
      expect(text).toContain('session-123');
      expect(text).toContain('software-engineer');
      expect(text).toContain('Tell me about yourself');
      expect(text).toContain('I am a software developer');
      expect(text).toContain('Clear communication');
      expect(text).toContain('More specific examples');
    });
  });

  describe('clearAll', () => {
    it('clears all stored data', () => {
      const session: InterviewSession = {
        id: 'session-1',
        userId: 'user-123',
        jobType: 'general',
        difficulty: 'entry',
        questions: [],
        responses: [],
        feedback: [],
        createdAt: new Date(),
      };

      sessionStorageService.saveSession(session);
      sessionStorageService.setCurrentSession(session);

      sessionStorageService.clearAll();

      expect(sessionStorageService.getAllSessions()).toEqual([]);
      expect(sessionStorageService.getCurrentSession()).toBeNull();
    });
  });
});
