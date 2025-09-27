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
    // Enhanced tracking for new third options
    const isNewOption = this.isNewThirdOption(questionId, answer);
    
    this.trackEvent('quiz', 'question_answered', questionId, questionNumber, {
      answer,
      questionNumber,
      questionId,
      isNewThirdOption: isNewOption,
      optionType: this.getOptionType(questionId, answer)
    });
  }

  private isNewThirdOption(questionId: string, answer: string): boolean {
    const newOptions = {
      sweetVsBitter: ['balanced'],
      citrusVsStone: ['tropical'],
      lightVsBoozy: ['medium'],
      classicVsExperimental: ['modern']
    };
    
    return newOptions[questionId as keyof typeof newOptions]?.includes(answer) || false;
  }

  private getOptionType(questionId: string, answer: string): string {
    const optionTypes = {
      sweetVsBitter: {
        sweet: 'traditional',
        bitter: 'traditional', 
        balanced: 'enhanced'
      },
      citrusVsStone: {
        citrus: 'traditional',
        stone: 'traditional',
        tropical: 'enhanced'
      },
      lightVsBoozy: {
        light: 'traditional',
        boozy: 'traditional',
        medium: 'enhanced'
      },
      classicVsExperimental: {
        classic: 'traditional',
        experimental: 'traditional',
        modern: 'enhanced'
      }
    };
    
    const optionTypeMap = optionTypes[questionId as keyof typeof optionTypes];
    return optionTypeMap?.[answer as keyof typeof optionTypeMap] || 'unknown';
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

  trackEnhancedRecommendationViewed(cocktailName: string, matchScore: number, fuzzyMatches?: string[], fallbackUsed?: boolean) {
    this.trackEvent('recommendation', 'enhanced_viewed', cocktailName, matchScore, {
      cocktailName,
      matchScore,
      fuzzyMatches: fuzzyMatches || [],
      fallbackUsed: fallbackUsed || false,
      enhancedFeatures: true
    });
  }

  trackFuzzyMatchingUsage(questionId: string, answer: string, fuzzyMatches: string[]) {
    this.trackEvent('recommendation', 'fuzzy_matching_used', questionId, 0, {
      questionId,
      answer,
      fuzzyMatches,
      matchingMethod: 'fuzzy'
    });
  }

  trackCoverageGap(combination: string, missingTags: string[]) {
    this.trackEvent('system', 'coverage_gap_detected', combination, 0, {
      combination,
      missingTags,
      gapType: 'insufficient_tags'
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

// Export individual tracking functions for convenience
export const trackQuizStart = () => analytics.trackQuizStart();
export const trackQuestionAnswered = (questionId: string, answer: string, questionNumber: number) => 
  analytics.trackQuestionAnswered(questionId, answer, questionNumber);
export const trackQuizCompleted = (totalQuestions: number, completionTime: number) => 
  analytics.trackQuizCompleted(totalQuestions, completionTime);
export const trackRecommendationViewed = (cocktailName: string, matchScore: number) => 
  analytics.trackRecommendationViewed(cocktailName, matchScore);
export const trackEnhancedRecommendationViewed = (cocktailName: string, matchScore: number, fuzzyMatches?: string[], fallbackUsed?: boolean) => 
  analytics.trackEnhancedRecommendationViewed(cocktailName, matchScore, fuzzyMatches, fallbackUsed);
export const trackFuzzyMatchingUsage = (questionId: string, answer: string, fuzzyMatches: string[]) => 
  analytics.trackFuzzyMatchingUsage(questionId, answer, fuzzyMatches);
export const trackCoverageGap = (combination: string, missingTags: string[]) => 
  analytics.trackCoverageGap(combination, missingTags);
export const trackQuizRestart = () => analytics.trackQuizRestart();