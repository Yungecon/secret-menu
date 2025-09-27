import { describe, it, expect, beforeEach } from 'vitest'
import { generateRecommendations } from '../recommendationEngine'
import { QuizAnswers } from '../../types'

describe('Recommendation Engine', () => {
  beforeEach(() => {
    // Reset any state before each test
  })

  it('should return recommendations with valid structure', () => {
    const answers: QuizAnswers = {
      sweetVsBitter: 'sweet',
      citrusVsStone: 'citrus',
      lightVsBoozy: 'light',
      classicVsExperimental: 'classic',
      moodPreference: 'celebratory'
    }

    const result = generateRecommendations(answers)

    expect(result).toBeDefined()
    expect(result.primary).toBeDefined()
    expect(result.primary.id).toBeDefined()
    expect(result.primary.name).toBeDefined()
    expect(result.adjacent).toBeInstanceOf(Array)
    expect(result.matchScore).toBeGreaterThan(0)
    expect(result.matchScore).toBeLessThanOrEqual(100)
  })

  it('should return high match scores for complete answers', () => {
    const answers: QuizAnswers = {
      sweetVsBitter: 'sweet',
      citrusVsStone: 'citrus',
      lightVsBoozy: 'light',
      classicVsExperimental: 'classic',
      moodPreference: 'celebratory'
    }

    const result = generateRecommendations(answers)

    // The algorithm should return high scores (90-98%)
    expect(result.matchScore).toBeGreaterThanOrEqual(90)
    expect(result.matchScore).toBeLessThanOrEqual(98)
  })

  it('should handle partial answers gracefully', () => {
    const answers: QuizAnswers = {
      sweetVsBitter: 'sweet'
      // Only one answer provided
    }

    const result = generateRecommendations(answers)

    expect(result).toBeDefined()
    expect(result.primary).toBeDefined()
    expect(result.adjacent).toBeInstanceOf(Array)
    expect(result.matchScore).toBeGreaterThan(0)
  })

  it('should return adjacent cocktails that are different from primary', () => {
    const answers: QuizAnswers = {
      sweetVsBitter: 'sweet',
      citrusVsStone: 'citrus',
      moodPreference: 'celebratory'
    }

    const result = generateRecommendations(answers)

    expect(result.adjacent.length).toBeLessThanOrEqual(3)
    
    // Adjacent cocktails should not include the primary
    result.adjacent.forEach(cocktail => {
      expect(cocktail.id).not.toBe(result.primary.id)
    })
  })

  it('should handle empty answers object', () => {
    const answers: QuizAnswers = {}

    const result = generateRecommendations(answers)

    expect(result).toBeDefined()
    expect(result.primary).toBeDefined()
    expect(result.adjacent).toBeInstanceOf(Array)
    expect(result.matchScore).toBeGreaterThan(0)
  })

  it('should return integer match scores', () => {
    const answers: QuizAnswers = {
      sweetVsBitter: 'sweet',
      citrusVsStone: 'citrus',
      lightVsBoozy: 'light',
      classicVsExperimental: 'experimental',
      moodPreference: 'adventurous'
    }

    const result = generateRecommendations(answers)

    expect(Number.isInteger(result.matchScore)).toBe(true)
  })

  it('should return cocktails with required properties', () => {
    const answers: QuizAnswers = {
      sweetVsBitter: 'bitter',
      citrusVsStone: 'stone',
      lightVsBoozy: 'boozy',
      classicVsExperimental: 'classic',
      moodPreference: 'elegant'
    }

    const result = generateRecommendations(answers)

    // Check primary cocktail has all required properties
    expect(result.primary.name).toBeDefined()
    expect(result.primary.ingredients).toBeInstanceOf(Array)
    expect(result.primary.ingredients.length).toBeGreaterThan(0)
    expect(result.primary.garnish).toBeDefined()
    expect(result.primary.glassware).toBeDefined()
    expect(result.primary.flavor_tags).toBeInstanceOf(Array)
    expect(result.primary.mood_tags).toBeInstanceOf(Array)
  })
})