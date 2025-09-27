import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
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
  const actual = await vi.importActual('react-router-dom') as any
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

  it('should render results page with cocktail data', async () => {
    render(<Results />)
    
    // Should show some cocktail recommendation
    await waitFor(() => {
      expect(screen.getByText(/% Perfect Match/)).toBeInTheDocument()
    })
  })

  it('should display try another button', async () => {
    render(<Results />)
    
    await waitFor(() => {
      expect(screen.getByText('Discover Another Masterpiece')).toBeInTheDocument()
    })
  })

  it('should show magical reveal text', async () => {
    render(<Results />)
    
    await waitFor(() => {
      expect(screen.getByText(/Your impeccable taste has led us to/)).toBeInTheDocument()
    })
  })
})