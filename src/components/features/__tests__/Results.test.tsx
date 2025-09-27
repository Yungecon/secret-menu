import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '../../../test/utils'
import Results from '../Results'
import { QuizAnswers } from '../../../types'

// Mock the services with simpler mocks
vi.mock('../../../services/analytics', () => ({
  trackRecommendationViewed: vi.fn(),
  trackQuizRestart: vi.fn(),
}))

vi.mock('../../../services/soundEffects', () => ({
  playCocktailReveal: vi.fn(),
}))

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock QuizContext with answers
const mockQuizContext = {
  answers: {
    sweetVsBitter: 'sweet',
    citrusVsStone: 'citrus',
    lightVsBoozy: 'light',
    classicVsExperimental: 'classic',
    moodPreference: 'celebratory'
  } as QuizAnswers,
  setAnswers: vi.fn(),
  resetQuiz: vi.fn()
}

vi.mock('../../../hooks/useQuiz', () => ({
  useQuiz: () => mockQuizContext
}))

describe('Results Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the primary cocktail recommendation', async () => {
    render(<Results />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Cocktail')).toBeInTheDocument()
    })
    
    expect(screen.getByText('95% Perfect Match')).toBeInTheDocument()
    expect(screen.getByText('A delightful test cocktail')).toBeInTheDocument()
  })

  it('should display cocktail ingredients', async () => {
    render(<Results />)
    
    await waitFor(() => {
      expect(screen.getByText('Vodka')).toBeInTheDocument()
      expect(screen.getByText('Lemon Juice')).toBeInTheDocument()
      expect(screen.getByText('Simple Syrup')).toBeInTheDocument()
    })
  })

  it('should show garnish and glassware information', async () => {
    render(<Results />)
    
    await waitFor(() => {
      expect(screen.getByText(/Lemon Twist/)).toBeInTheDocument()
      expect(screen.getByText(/Coupe/)).toBeInTheDocument()
    })
  })

  it('should display adjacent recommendations', async () => {
    render(<Results />)
    
    await waitFor(() => {
      expect(screen.getByText('Adjacent Cocktail 1')).toBeInTheDocument()
      expect(screen.getByText('You might also enjoy...')).toBeInTheDocument()
    })
  })

  it('should allow switching to adjacent cocktails', async () => {
    render(<Results />)
    
    await waitFor(() => {
      expect(screen.getByText('Adjacent Cocktail 1')).toBeInTheDocument()
    })
    
    // Click on adjacent cocktail
    fireEvent.click(screen.getByText('Adjacent Cocktail 1'))
    
    // Should track the new recommendation
    const { trackRecommendationViewed } = require('../../../services/analytics')
    expect(trackRecommendationViewed).toHaveBeenCalled()
  })

  it('should handle try another button click', async () => {
    render(<Results />)
    
    await waitFor(() => {
      expect(screen.getByText('Discover Another Masterpiece')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Discover Another Masterpiece'))
    
    expect(mockQuizContext.resetQuiz).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should track recommendation viewed on mount', async () => {
    const { trackRecommendationViewed } = require('../../../services/analytics')
    
    render(<Results />)
    
    await waitFor(() => {
      expect(trackRecommendationViewed).toHaveBeenCalledWith('Test Cocktail', 95)
    })
  })

  it('should play cocktail reveal sound', async () => {
    const { playCocktailReveal } = require('../../../services/soundEffects')
    
    render(<Results />)
    
    // Sound should be played after a delay
    await waitFor(() => {
      expect(playCocktailReveal).toHaveBeenCalledTimes(1)
    }, { timeout: 2000 })
  })

  it('should redirect to home if no answers provided', () => {
    // Mock empty answers
    const emptyQuizContext = {
      ...mockQuizContext,
      answers: {}
    }
    
    vi.mocked(require('../../../hooks/useQuiz').useQuiz).mockReturnValue(emptyQuizContext)
    
    render(<Results />)
    
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should show loading state initially', () => {
    render(<Results />)
    
    // Should show loading message
    expect(screen.getByText(/Consulting the spirits/)).toBeInTheDocument()
  })

  it('should display magical reveal text', async () => {
    render(<Results />)
    
    await waitFor(() => {
      expect(screen.getByText(/Your impeccable taste has led us to/)).toBeInTheDocument()
    })
  })

  it('should show match score with proper styling', async () => {
    render(<Results />)
    
    await waitFor(() => {
      const matchScore = screen.getByText('95% Perfect Match')
      expect(matchScore).toBeInTheDocument()
      expect(matchScore.closest('.bg-premium-charcoal\\/30')).toBeInTheDocument()
    })
  })
})