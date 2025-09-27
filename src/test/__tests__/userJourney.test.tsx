import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '../utils'
import App from '../../App'

// Mock all the services
vi.mock('../../services/analytics', () => ({
  trackQuizStart: vi.fn(),
  trackQuestionAnswered: vi.fn(),
  trackQuizCompleted: vi.fn(),
  trackRecommendationViewed: vi.fn(),
  trackQuizRestart: vi.fn(),
}))

vi.mock('../../services/soundEffects', () => ({
  playButtonPress: vi.fn(),
  playComplimentReveal: vi.fn(),
  playQuizComplete: vi.fn(),
  playCocktailReveal: vi.fn(),
}))

vi.mock('../../services/recommendationEngine', () => ({
  generateRecommendations: vi.fn(() => ({
    primary: {
      id: '1',
      name: 'Perfect Match Cocktail',
      base_spirit_category: 'Vodka',
      base_brand: 'Premium Vodka',
      style: 'Elegant & Refined',
      build_type: 'Shaken',
      flavor_tags: ['sweet', 'citrus', 'bright'],
      mood_tags: ['celebratory', 'joyful'],
      ingredients: ['Premium Vodka', 'Fresh Lemon Juice', 'Elderflower Liqueur', 'Simple Syrup'],
      garnish: 'Lemon Twist & Edible Flower',
      glassware: 'Crystal Coupe',
      notes: 'A harmonious blend that captures your sophisticated palate perfectly'
    },
    adjacent: [
      {
        id: '2',
        name: 'Alternative Delight',
        base_spirit_category: 'Gin',
        base_brand: 'Craft Gin',
        style: 'Modern Classic',
        build_type: 'Stirred',
        flavor_tags: ['sweet', 'herbal'],
        mood_tags: ['elegant'],
        ingredients: ['Craft Gin', 'Elderflower', 'Lime'],
        garnish: 'Cucumber Ribbon',
        glassware: 'Nick & Nora',
        notes: 'An equally exquisite alternative'
      }
    ],
    matchScore: 97
  }))
}))

describe('Complete User Journey', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Start at the landing page
    window.history.pushState({}, '', '/')
  })

  it('should complete the full user journey from landing to results', async () => {
    render(<App />)

    // 1. Landing Page
    expect(screen.getByText('Secret Menu')).toBeInTheDocument()
    expect(screen.getByText('Discover a secret cocktail just for you')).toBeInTheDocument()
    
    const beginButton = screen.getByText('Begin Your Journey')
    expect(beginButton).toBeInTheDocument()

    // 2. Start Quiz
    fireEvent.click(beginButton)

    // Should navigate to quiz and show first question
    await waitFor(() => {
      expect(screen.getByText('What speaks to your refined palate?')).toBeInTheDocument()
    })

    // Verify quiz tracking
    const { trackQuizStart } = require('../../services/analytics')
    expect(trackQuizStart).toHaveBeenCalledTimes(1)

    // 3. Answer all quiz questions
    const answers = [
      'Sweet & Luxurious',      // Question 1
      'Citrus & Bright',        // Question 2  
      'Light & Refreshing',     // Question 3
      'Classic & Timeless',     // Question 4
      'Celebratory & Joyful'    // Question 5
    ]

    for (let i = 0; i < answers.length; i++) {
      // Find and click the answer
      const answerButton = screen.getByText(answers[i])
      expect(answerButton).toBeInTheDocument()
      fireEvent.click(answerButton)

      // Wait for compliment message
      await waitFor(() => {
        const complimentText = screen.getByText(/delightfully|sophisticated|refined|exquisite|wonderfully|magnificently/i)
        expect(complimentText).toBeInTheDocument()
      }, { timeout: 1000 })

      if (i < answers.length - 1) {
        // Wait for next question (except on last question)
        await waitFor(() => {
          expect(screen.getByText(`Question ${i + 2} of 5`)).toBeInTheDocument()
        }, { timeout: 3000 })
      }
    }

    // 4. Results Page
    // Should navigate to results after completing quiz
    await waitFor(() => {
      expect(screen.getByText('Perfect Match Cocktail')).toBeInTheDocument()
    }, { timeout: 5000 })

    // Verify results content
    expect(screen.getByText('97% Perfect Match')).toBeInTheDocument()
    expect(screen.getByText(/Your impeccable taste has led us to/)).toBeInTheDocument()
    expect(screen.getByText('A harmonious blend that captures your sophisticated palate perfectly')).toBeInTheDocument()

    // Check ingredients are displayed
    expect(screen.getByText('Premium Vodka')).toBeInTheDocument()
    expect(screen.getByText('Fresh Lemon Juice')).toBeInTheDocument()
    expect(screen.getByText('Elderflower Liqueur')).toBeInTheDocument()

    // Check garnish and glassware
    expect(screen.getByText(/Lemon Twist & Edible Flower/)).toBeInTheDocument()
    expect(screen.getByText(/Crystal Coupe/)).toBeInTheDocument()

    // Check adjacent recommendations
    expect(screen.getByText('Alternative Delight')).toBeInTheDocument()
    expect(screen.getByText('You might also enjoy...')).toBeInTheDocument()

    // 5. Try Another Journey
    const tryAnotherButton = screen.getByText('Discover Another Masterpiece')
    expect(tryAnotherButton).toBeInTheDocument()
    
    fireEvent.click(tryAnotherButton)

    // Should return to landing page
    await waitFor(() => {
      expect(screen.getByText('Secret Menu')).toBeInTheDocument()
      expect(screen.getByText('Begin Your Journey')).toBeInTheDocument()
    })

    // Verify analytics tracking
    const { trackQuestionAnswered, trackQuizCompleted, trackRecommendationViewed, trackQuizRestart } = require('../../services/analytics')
    
    expect(trackQuestionAnswered).toHaveBeenCalledTimes(5)
    expect(trackQuizCompleted).toHaveBeenCalledTimes(1)
    expect(trackRecommendationViewed).toHaveBeenCalledWith('Perfect Match Cocktail', 97)
    expect(trackQuizRestart).toHaveBeenCalledTimes(1)
  }, 15000) // Increase timeout for full journey

  it('should handle switching between adjacent cocktails', async () => {
    render(<App />)

    // Navigate through to results quickly
    fireEvent.click(screen.getByText('Begin Your Journey'))

    await waitFor(() => {
      expect(screen.getByText('What speaks to your refined palate?')).toBeInTheDocument()
    })

    // Answer all questions quickly
    const answers = ['Sweet & Luxurious', 'Citrus & Bright', 'Light & Refreshing', 'Classic & Timeless', 'Celebratory & Joyful']
    
    for (const answer of answers) {
      fireEvent.click(screen.getByText(answer))
      await waitFor(() => {}, { timeout: 100 }) // Brief wait
    }

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('Perfect Match Cocktail')).toBeInTheDocument()
    }, { timeout: 5000 })

    // Click on adjacent cocktail
    const adjacentCocktail = screen.getByText('Alternative Delight')
    fireEvent.click(adjacentCocktail)

    // Should track the new recommendation
    const { trackRecommendationViewed } = require('../../services/analytics')
    expect(trackRecommendationViewed).toHaveBeenCalledTimes(2) // Once for primary, once for adjacent
  })

  it('should show progress correctly throughout quiz', async () => {
    render(<App />)

    fireEvent.click(screen.getByText('Begin Your Journey'))

    await waitFor(() => {
      expect(screen.getByText('Question 1 of 5')).toBeInTheDocument()
      expect(screen.getByText('20% Complete')).toBeInTheDocument()
    })

    // Answer first question
    fireEvent.click(screen.getByText('Sweet & Luxurious'))

    await waitFor(() => {
      expect(screen.getByText('Question 2 of 5')).toBeInTheDocument()
      expect(screen.getByText('40% Complete')).toBeInTheDocument()
    }, { timeout: 3000 })

    // Answer second question
    fireEvent.click(screen.getByText('Citrus & Bright'))

    await waitFor(() => {
      expect(screen.getByText('Question 3 of 5')).toBeInTheDocument()
      expect(screen.getByText('60% Complete')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should show previous answers as user progresses', async () => {
    render(<App />)

    fireEvent.click(screen.getByText('Begin Your Journey'))

    await waitFor(() => {
      expect(screen.getByText('What speaks to your refined palate?')).toBeInTheDocument()
    })

    // Answer first question
    fireEvent.click(screen.getByText('Sweet & Luxurious'))

    // Wait for second question and check previous answer is shown
    await waitFor(() => {
      expect(screen.getByText('Which fruit family calls to you?')).toBeInTheDocument()
      expect(screen.getByText('Sweet & Luxurious')).toBeInTheDocument()
      expect(screen.getByText('Your exquisite choices so far...')).toBeInTheDocument()
    }, { timeout: 3000 })
  })
})