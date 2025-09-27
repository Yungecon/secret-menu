// Simple analytics utility for tracking user interactions
// In production, this would integrate with Google Analytics 4 or similar

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  customData?: Record<string, any>;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private startTime: number;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.trackEvent('session', 'start', 'quiz_session');
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  trackEvent(category: string, action: string, label?: string, value?: number, customData?: Record<string, any>) {
    const event: AnalyticsEvent = {
      event: `${category}_${action}`,
      category,
      action,
      label,
      value,
      customData: {
        ...customData,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        sessionDuration: Date.now() - this.startTime
      }
    };

    this.events.push(event);
    
    // In production, send to analytics service
    console.log('📊 Analytics Event:', event);
    
    // For future Google Analytics 4 integration:
    // if (typeof gtag !== 'undefined') {
    //   gtag('event', action, {
    //     event_category: category,
    //     event_label: label,
    //     value: value,
    //     custom_parameter: customData
    //   });
    // }
  }

  // Quiz-specific tracking methods
  trackQuizStart() {
    this.trackEvent('quiz', 'start', 'quiz_flow');
  }

  trackQuestionAnswered(questionId: string, answer: string, questionNumber: number) {
    this.trackEvent('quiz', 'question_answered', questionId, questionNumber, {
      answer,
      questionNumber,
      questionId
    });
  }

  trackQuizCompleted(totalQuestions: number, completionTime: number) {
    this.trackEvent('quiz', 'completed', 'quiz_flow', totalQuestions, {
      totalQuestions,
      completionTime,
      averageTimePerQuestion: completionTime / totalQuestions
    });
  }

  trackRecommendationViewed(cocktailName: string, matchScore: number) {
    this.trackEvent('recommendation', 'viewed', cocktailName, matchScore, {
      cocktailName,
      matchScore
    });
  }

  trackQuizRestart() {
    this.trackEvent('quiz', 'restart', 'try_another');
  }

  // Get analytics summary for debugging
  getAnalyticsSummary() {
    return {
      sessionId: this.sessionId,
      totalEvents: this.events.length,
      sessionDuration: Date.now() - this.startTime,
      events: this.events
    };
  }
}

// Create singleton instance
export const analytics = new Analytics();

// General event helper for convenient imports
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number,
  customData?: Record<string, any>
) => analytics.trackEvent(category, action, label, value, customData);

// Export individual tracking functions for convenience
export const trackQuizStart = () => analytics.trackQuizStart();
export const trackQuestionAnswered = (questionId: string, answer: string, questionNumber: number) => 
  analytics.trackQuestionAnswered(questionId, answer, questionNumber);
export const trackQuizCompleted = (totalQuestions: number, completionTime: number) => 
  analytics.trackQuizCompleted(totalQuestions, completionTime);
export const trackRecommendationViewed = (cocktailName: string, matchScore: number) => 
  analytics.trackRecommendationViewed(cocktailName, matchScore);
export const trackQuizRestart = () => analytics.trackQuizRestart();