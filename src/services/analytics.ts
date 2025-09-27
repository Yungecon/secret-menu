// Simple analytics utility for tracking user interactions
// In production, this would integrate with Google Analytics 4 or similar

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID as string | undefined;

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
  private gaInitialized: boolean = false;
  private gaMeasurementId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.trackEvent('session', 'start', 'quiz_session');

    this.gaMeasurementId = GA_MEASUREMENT_ID;
    if (this.gaMeasurementId) {
      this.initializeGA(this.gaMeasurementId);
    }
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
    
    // Console for local debugging
    console.log('📊 Analytics Event:', event);

    // Forward to GA4 if initialized
    try {
      if (this.gaInitialized && typeof window.gtag === 'function') {
        window.gtag('event', action, {
          event_category: category,
          event_label: label,
          value,
          ...event.customData,
        });
      }
    } catch (err) {
      // Swallow errors to avoid impacting UX
    }
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

  // SPA page view tracking
  trackPageView(pathname: string, title?: string) {
    this.trackEvent('page', 'view', pathname, undefined, { title });
    try {
      if (this.gaInitialized && this.gaMeasurementId && typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', {
          page_title: title || document.title,
          page_location: window.location.href,
          page_path: pathname,
        });
      }
    } catch {
      // no-op
    }
  }

  // Initialize GA4
  private initializeGA(measurementId: string) {
    if (this.gaInitialized) return;
    // Create dataLayer and gtag shim
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      (window.dataLayer as unknown[]).push(arguments as unknown as any);
    } as unknown as (...args: unknown[]) => void;

    // Inject gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.onerror = () => {
      this.gaInitialized = false;
    };
    script.onload = () => {
      try {
        window.gtag && window.gtag('js', new Date());
        window.gtag && window.gtag('config', measurementId, { send_page_view: false });
        this.gaInitialized = true;
      } catch {
        this.gaInitialized = false;
      }
    };
    document.head.appendChild(script);
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
export const trackPageView = (pathname: string, title?: string) => analytics.trackPageView(pathname, title);
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number,
  customData?: Record<string, any>
) => analytics.trackEvent(category, action, label, value, customData);