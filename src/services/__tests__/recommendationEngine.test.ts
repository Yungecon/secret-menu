import { describe, it, expect, beforeEach } from 'vitest'
import { generateRecommendations, generateEnhancedRecommendations } from '../recommendationEngine'
import { QuizAnswers, EnhancedQuizAnswers } from '../../types'

describe('Recommendation Engine', () => {
  beforeEach(() => {
    // Reset any state before each test
  })

  it('should return recommendations with valid structure', async () => {
    const answers: QuizAnswers = {
      sweetVsBitter: 'sweet',
      citrusVsStone: 'citrus',
      lightVsBoozy: 'light',
      classicVsExperimental: 'classic',
      moodPreference: 'celebratory'
    }

    const result = await generateRecommendations(answers)

    expect(result).toBeDefined()
    expect(result.primary).toBeDefined()
    expect(result.primary.id).toBeDefined()
    expect(result.primary.name).toBeDefined()
    expect(result.adjacent).toBeInstanceOf(Array)
    expect(result.matchScore).toBeGreaterThan(0)
    expect(result.matchScore).toBeLessThanOrEqual(100)
  })

  it('should return high match scores for complete answers', async () => {
    const answers: QuizAnswers = {
      sweetVsBitter: 'sweet',
      citrusVsStone: 'citrus',
      lightVsBoozy: 'light',
      classicVsExperimental: 'classic',
      moodPreference: 'celebratory'
    }

    const result = await generateRecommendations(answers)

    // The algorithm should return high scores (90-98%)
    expect(result.matchScore).toBeGreaterThanOrEqual(90)
    expect(result.matchScore).toBeLessThanOrEqual(98)
  })

  it('should handle partial answers gracefully', async () => {
    const answers: QuizAnswers = {
      sweetVsBitter: 'sweet'
      // Only one answer provided
    }

    const result = await generateRecommendations(answers)

    expect(result).toBeDefined()
    expect(result.primary).toBeDefined()
    expect(result.adjacent).toBeInstanceOf(Array)
    expect(result.matchScore).toBeGreaterThan(0)
  })

  it('should return adjacent cocktails that are different from primary', async () => {
    const answers: QuizAnswers = {
      sweetVsBitter: 'sweet',
      citrusVsStone: 'citrus',
      moodPreference: 'celebratory'
    }

    const result = await generateRecommendations(answers)

    expect(result.adjacent.length).toBeLessThanOrEqual(3)
    
    // Adjacent cocktails should not include the primary
    result.adjacent.forEach(cocktail => {
      expect(cocktail.id).not.toBe(result.primary.id)
    })
  })

  it('should handle empty answers object', async () => {
    const answers: QuizAnswers = {}

    const result = await generateRecommendations(answers)

    expect(result).toBeDefined()
    expect(result.primary).toBeDefined()
    expect(result.adjacent).toBeInstanceOf(Array)
    expect(result.matchScore).toBeGreaterThan(0)
  })

  it('should return integer match scores', async () => {
    const answers: QuizAnswers = {
      sweetVsBitter: 'sweet',
      citrusVsStone: 'citrus',
      lightVsBoozy: 'light',
      classicVsExperimental: 'experimental',
      moodPreference: 'adventurous'
    }

    const result = await generateRecommendations(answers)

    expect(Number.isInteger(result.matchScore)).toBe(true)
  })

  it('should return cocktails with required properties', async () => {
    const answers: QuizAnswers = {
      sweetVsBitter: 'bitter',
      citrusVsStone: 'stone',
      lightVsBoozy: 'boozy',
      classicVsExperimental: 'classic',
      moodPreference: 'elegant'
    }

    const result = await generateRecommendations(answers)

    // Check primary cocktail has all required properties
    expect(result.primary.name).toBeDefined()
    expect(result.primary.ingredients).toBeInstanceOf(Array)
    expect(result.primary.ingredients.length).toBeGreaterThan(0)
    expect(result.primary.garnish).toBeDefined()
    expect(result.primary.glassware).toBeDefined()
    expect(result.primary.flavor_tags).toBeInstanceOf(Array)
    expect(result.primary.mood_tags).toBeInstanceOf(Array)
  })

  // Enhanced recommendation engine tests
  describe('Enhanced Recommendation Engine', () => {
    it('should return enhanced recommendations with fuzzy matching metadata', async () => {
      const answers: EnhancedQuizAnswers = {
        sweetVsBitter: 'sweet',
        citrusVsStone: 'citrus',
        lightVsBoozy: 'light',
        classicVsExperimental: 'modern',
        moodPreference: 'celebratory'
      }

      const result = await generateEnhancedRecommendations(answers)

      expect(result).toBeDefined()
      expect(result.primary).toBeDefined()
      expect(result.adjacent).toBeInstanceOf(Array)
      expect(result.matchScore).toBeGreaterThan(0)
      expect(result.fuzzyMatches).toBeInstanceOf(Array)
      expect(typeof result.fallbackUsed).toBe('boolean')
    })

    it('should handle new third options correctly', async () => {
      const answers: EnhancedQuizAnswers = {
        sweetVsBitter: 'balanced',
        citrusVsStone: 'tropical',
        lightVsBoozy: 'medium',
        classicVsExperimental: 'modern',
        moodPreference: 'elegant'
      }

      const result = await generateEnhancedRecommendations(answers)

      expect(result).toBeDefined()
      expect(result.primary).toBeDefined()
      expect(result.matchScore).toBeGreaterThanOrEqual(85)
    })

    it('should use fuzzy matching when exact tags are missing', async () => {
      // Test a combination that might require fuzzy matching
      const answers: EnhancedQuizAnswers = {
        sweetVsBitter: 'balanced',
        citrusVsStone: 'tropical',
        lightVsBoozy: 'medium',
        classicVsExperimental: 'modern',
        moodPreference: 'cozy'
      }

      const result = await generateEnhancedRecommendations(answers)

      expect(result).toBeDefined()
      expect(result.primary).toBeDefined()
      expect(result.matchScore).toBeGreaterThanOrEqual(85)
      
      // If fuzzy matching was used, it should be indicated
      if (result.fallbackUsed) {
        expect(result.fuzzyMatches).toBeInstanceOf(Array)
        expect(result.fuzzyMatches!.length).toBeGreaterThan(0)
      }
    })

    it('should provide high match scores for all combinations', async () => {
      const testCombinations = [
        {
          sweetVsBitter: 'sweet' as const,
          citrusVsStone: 'citrus' as const,
          lightVsBoozy: 'light' as const,
          classicVsExperimental: 'classic' as const,
          moodPreference: 'celebratory' as const
        },
        {
          sweetVsBitter: 'bitter' as const,
          citrusVsStone: 'stone' as const,
          lightVsBoozy: 'boozy' as const,
          classicVsExperimental: 'experimental' as const,
          moodPreference: 'adventurous' as const
        },
        {
          sweetVsBitter: 'balanced' as const,
          citrusVsStone: 'tropical' as const,
          lightVsBoozy: 'medium' as const,
          classicVsExperimental: 'modern' as const,
          moodPreference: 'elegant' as const
        }
      ]

      for (const answers of testCombinations) {
        const result = await generateEnhancedRecommendations(answers)
        expect(result.matchScore).toBeGreaterThanOrEqual(85)
        expect(result.primary).toBeDefined()
        expect(result.adjacent).toBeInstanceOf(Array)
      }
    })

    it('should return adjacent cocktails with good scores', async () => {
      const answers: EnhancedQuizAnswers = {
        sweetVsBitter: 'sweet',
        citrusVsStone: 'citrus',
        lightVsBoozy: 'light',
        classicVsExperimental: 'modern',
        moodPreference: 'celebratory'
      }

      const result = await generateEnhancedRecommendations(answers)

      expect(result.adjacent.length).toBeLessThanOrEqual(3)
      expect(result.adjacent.length).toBeGreaterThanOrEqual(0)
      
      // Adjacent cocktails should be different from primary
      result.adjacent.forEach(cocktail => {
        expect(cocktail.id).not.toBe(result.primary.id)
      })
    })
  })

  // Fuzzy matching tests
  describe('Fuzzy Matching', () => {
    it('should handle balanced flavor preference', async () => {
      const answers: QuizAnswers = {
        sweetVsBitter: 'balanced',
        citrusVsStone: 'citrus',
        lightVsBoozy: 'light',
        classicVsExperimental: 'modern',
        moodPreference: 'celebratory'
      }

      const result = await generateRecommendations(answers)

      expect(result).toBeDefined()
      expect(result.primary).toBeDefined()
      expect(result.matchScore).toBeGreaterThanOrEqual(85)
    })

    it('should handle tropical fruit preference', async () => {
      const answers: QuizAnswers = {
        sweetVsBitter: 'sweet',
        citrusVsStone: 'tropical',
        lightVsBoozy: 'light',
        classicVsExperimental: 'modern',
        moodPreference: 'adventurous'
      }

      const result = await generateRecommendations(answers)

      expect(result).toBeDefined()
      expect(result.primary).toBeDefined()
      expect(result.matchScore).toBeGreaterThanOrEqual(85)
    })

    it('should handle medium intensity preference', async () => {
      const answers: QuizAnswers = {
        sweetVsBitter: 'balanced',
        citrusVsStone: 'citrus',
        lightVsBoozy: 'medium',
        classicVsExperimental: 'modern',
        moodPreference: 'elegant'
      }

      const result = await generateRecommendations(answers)

      expect(result).toBeDefined()
      expect(result.primary).toBeDefined()
      expect(result.matchScore).toBeGreaterThanOrEqual(85)
    })

    it('should handle modern style preference', async () => {
      const answers: QuizAnswers = {
        sweetVsBitter: 'sweet',
        citrusVsStone: 'citrus',
        lightVsBoozy: 'light',
        classicVsExperimental: 'modern',
        moodPreference: 'celebratory'
      }

      const result = await generateRecommendations(answers)

      expect(result).toBeDefined()
      expect(result.primary).toBeDefined()
      expect(result.matchScore).toBeGreaterThanOrEqual(85)
    })
  })
})