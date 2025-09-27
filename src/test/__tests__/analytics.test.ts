import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock Google Analytics
const mockGtag: any = vi.fn()
;(global as any).gtag = mockGtag

describe('Analytics Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should track quiz start events', async () => {
    const { trackQuizStart } = await import('../../services/analytics')
    
    trackQuizStart()
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'quiz_start', {
      event_category: 'engagement',
      event_label: 'cocktail_quiz'
    })
  })

  it('should track question answered events', async () => {
    const { trackQuestionAnswered } = await import('../../services/analytics')
    
    trackQuestionAnswered('sweetVsBitter', 'sweet', 1)
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'question_answered', {
      event_category: 'engagement',
      event_label: 'sweetVsBitter',
      custom_parameters: {
        question_id: 'sweetVsBitter',
        answer: 'sweet',
        question_number: 1
      }
    })
  })

  it('should track quiz completion events', async () => {
    const { trackQuizCompleted } = await import('../../services/analytics')
    
    trackQuizCompleted(5, 30000) // 5 questions, 30 seconds
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'quiz_completed', {
      event_category: 'engagement',
      event_label: 'cocktail_quiz',
      custom_parameters: {
        questions_answered: 5,
        completion_time_ms: 30000
      }
    })
  })

  it('should track recommendation viewed events', async () => {
    const { trackRecommendationViewed } = await import('../../services/analytics')
    
    trackRecommendationViewed('Negroni', 95)
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'recommendation_viewed', {
      event_category: 'engagement',
      event_label: 'Negroni',
      custom_parameters: {
        cocktail_name: 'Negroni',
        match_score: 95
      }
    })
  })

  it('should track quiz restart events', async () => {
    const { trackQuizRestart } = await import('../../services/analytics')
    
    trackQuizRestart()
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'quiz_restart', {
      event_category: 'engagement',
      event_label: 'try_another'
    })
  })

  it('should handle analytics failures gracefully', async () => {
    // Mock gtag to throw an error
    mockGtag.mockImplementation(() => {
      throw new Error('Analytics error')
    })
    
    const { trackQuizStart } = await import('../../services/analytics')
    
    // Should not throw error
    expect(() => trackQuizStart()).not.toThrow()
  })

  it('should work when gtag is not available', async () => {
    // Remove gtag
    (global as any).gtag = undefined as any
    
    const { trackQuizStart } = await import('../../services/analytics')
    
    // Should not throw error
    expect(() => trackQuizStart()).not.toThrow()
  })

  it('should track analytics events without errors', async () => {
    const { trackQuizStart } = await import('../../services/analytics')
    
    // Should not throw error
    expect(() => trackQuizStart()).not.toThrow()
  })
})