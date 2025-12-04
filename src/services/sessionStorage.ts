import { InterviewSession, InterviewTranscript, UserProfile } from '../types';

/**
 * Session Storage Service
 * Handles storing and retrieving interview session data locally
 */
class SessionStorageService {
  private readonly SESSION_KEY = 'interview_sessions';
  private readonly USER_KEY = 'user_profile';
  private readonly CURRENT_SESSION_KEY = 'current_session';

  /**
   * Save a session to local storage
   */
  saveSession(session: InterviewSession): void {
    const sessions = this.getAllSessions();
    const existingIndex = sessions.findIndex((s) => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessions));
  }

  /**
   * Get all sessions from local storage
   */
  getAllSessions(): InterviewSession[] {
    const data = localStorage.getItem(this.SESSION_KEY);
    if (!data) {
      return [];
    }

    try {
      const sessions = JSON.parse(data) as InterviewSession[];
      return sessions.map((s) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        completedAt: s.completedAt ? new Date(s.completedAt) : undefined,
        responses: s.responses.map((r) => ({
          ...r,
          timestamp: new Date(r.timestamp),
        })),
      }));
    } catch {
      // Return empty array if stored data is corrupted or invalid JSON
      return [];
    }
  }

  /**
   * Get a specific session by ID
   */
  getSession(sessionId: string): InterviewSession | null {
    const sessions = this.getAllSessions();
    return sessions.find((s) => s.id === sessionId) || null;
  }

  /**
   * Delete a session
   */
  deleteSession(sessionId: string): void {
    const sessions = this.getAllSessions().filter((s) => s.id !== sessionId);
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessions));
  }

  /**
   * Set current active session
   */
  setCurrentSession(session: InterviewSession): void {
    localStorage.setItem(this.CURRENT_SESSION_KEY, JSON.stringify(session));
  }

  /**
   * Get current active session
   */
  getCurrentSession(): InterviewSession | null {
    const data = localStorage.getItem(this.CURRENT_SESSION_KEY);
    if (!data) {
      return null;
    }

    try {
      const session = JSON.parse(data) as InterviewSession;
      return {
        ...session,
        createdAt: new Date(session.createdAt),
        completedAt: session.completedAt ? new Date(session.completedAt) : undefined,
        responses: session.responses.map((r) => ({
          ...r,
          timestamp: new Date(r.timestamp),
        })),
      };
    } catch {
      // Return null if stored data is corrupted or invalid JSON
      return null;
    }
  }

  /**
   * Clear current session
   */
  clearCurrentSession(): void {
    localStorage.removeItem(this.CURRENT_SESSION_KEY);
  }

  /**
   * Save user profile
   */
  saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(profile));
  }

  /**
   * Get user profile
   */
  getUserProfile(): UserProfile | null {
    const data = localStorage.getItem(this.USER_KEY);
    if (!data) {
      return null;
    }

    try {
      const profile = JSON.parse(data) as UserProfile;
      return {
        ...profile,
        createdAt: new Date(profile.createdAt),
      };
    } catch {
      // Return null if stored data is corrupted or invalid JSON
      return null;
    }
  }

  /**
   * Clear user profile
   */
  clearUserProfile(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Generate transcript text for download
   */
  generateTranscriptText(transcript: InterviewTranscript): string {
    let text = `INTERVIEW TRANSCRIPT\n`;
    text += `${'='.repeat(50)}\n\n`;
    text += `Session ID: ${transcript.sessionId}\n`;
    text += `Job Type: ${transcript.jobType}\n`;
    text += `Overall Score: ${transcript.overallScore}/10\n`;
    text += `Generated: ${transcript.generatedAt.toLocaleString()}\n\n`;
    text += `${'='.repeat(50)}\n`;
    text += `SUMMARY\n`;
    text += `${'='.repeat(50)}\n`;
    text += `${transcript.summary}\n\n`;
    text += `${'='.repeat(50)}\n`;
    text += `QUESTIONS & RESPONSES\n`;
    text += `${'='.repeat(50)}\n\n`;

    transcript.questions.forEach((q, index) => {
      text += `Question ${index + 1}:\n`;
      text += `${q.question}\n\n`;
      text += `Your Response:\n`;
      text += `${q.response}\n\n`;
      text += `Score: ${q.feedback.score}/10\n\n`;
      text += `Strengths:\n`;
      q.feedback.strengths.forEach((s) => {
        text += `  • ${s}\n`;
      });
      text += `\nAreas for Improvement:\n`;
      q.feedback.improvements.forEach((i) => {
        text += `  • ${i}\n`;
      });
      text += `\nSuggestions:\n${q.feedback.suggestions}\n`;
      text += `\n${'-'.repeat(40)}\n\n`;
    });

    return text;
  }

  /**
   * Download transcript as text file
   */
  downloadTranscript(transcript: InterviewTranscript): void {
    const text = this.generateTranscriptText(transcript);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview-transcript-${transcript.sessionId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.CURRENT_SESSION_KEY);
  }
}

// Export singleton instance
export const sessionStorageService = new SessionStorageService();
export default SessionStorageService;
