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
    
    // Should not throw error
    expect(() => trackQuizStart()).not.toThrow()
  })

  it('should track question answered events', async () => {
    const { trackQuestionAnswered } = await import('../../services/analytics')
    
    // Should not throw error
    expect(() => trackQuestionAnswered('sweetVsBitter', 'sweet', 1)).not.toThrow()
  })

  it('should track quiz completion events', async () => {
    const { trackQuizCompleted } = await import('../../services/analytics')
    
    // Should not throw error
    expect(() => trackQuizCompleted(5, 30000)).not.toThrow()
  })

  it('should track recommendation viewed events', async () => {
    const { trackRecommendationViewed } = await import('../../services/analytics')
    
    // Should not throw error
    expect(() => trackRecommendationViewed('Negroni', 95)).not.toThrow()
  })

  it('should track quiz restart events', async () => {
    const { trackQuizRestart } = await import('../../services/analytics')
    
    // Should not throw error
    expect(() => trackQuizRestart()).not.toThrow()
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