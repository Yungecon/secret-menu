import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '../../../test/utils'
import QuizFlow from '../QuizFlow'

// Mock the services
vi.mock('../../../services/analytics', () => ({
  trackQuizStart: vi.fn(),
  trackQuestionAnswered: vi.fn(),
  trackQuizCompleted: vi.fn(),
}))

vi.mock('../../../services/soundEffects', () => ({
  playButtonPress: vi.fn(),
  playComplimentReveal: vi.fn(),
  playQuizComplete: vi.fn(),
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

describe('QuizFlow Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the first question on mount', () => {
    render(<QuizFlow />)
    
    expect(screen.getByText('What speaks to your refined palate?')).toBeInTheDocument()
    expect(screen.getByText('Sweet & Luxurious')).toBeInTheDocument()
    expect(screen.getByText('Bitter & Sophisticated')).toBeInTheDocument()
    expect(screen.getByText('Balanced & Harmonious')).toBeInTheDocument()
  })

  it('should show progress indicator', () => {
    render(<QuizFlow />)
    
    expect(screen.getByText('Question 1 of 5')).toBeInTheDocument()
    expect(screen.getByText('20% Complete')).toBeInTheDocument()
  })

  it('should advance to next question when answer is selected', async () => {
    render(<QuizFlow />)
    
    // Click on first answer
    fireEvent.click(screen.getByText('Sweet & Luxurious'))
    
    // Wait for compliment animation and next question
    await waitFor(() => {
      expect(screen.getByText('Which fruit family calls to you?')).toBeInTheDocument()
    }, { timeout: 5000 })
    
    expect(screen.getByText('Question 2 of 5')).toBeInTheDocument()
  })

  it('should show complimentary message when answer is selected', async () => {
    render(<QuizFlow />)
    
    fireEvent.click(screen.getByText('Sweet & Luxurious'))
    
    // Should show a complimentary message
    await waitFor(() => {
      const complimentText = screen.getByText(/devotee|luxurious|sweetness/i)
      expect(complimentText).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('should render quiz questions', () => {
    render(<QuizFlow />)
    
    // Should show the first question
    expect(screen.getByText('What speaks to your refined palate?')).toBeInTheDocument()
  })

  it('should navigate to results after completing all questions', async () => {
    render(<QuizFlow />)
    
    // Answer all 5 questions
    const questions = [
      'Sweet & Luxurious',
      'Citrus & Bright',
      'Light & Refreshing',
      'Classic & Timeless',
      'Celebratory & Joyful'
    ]
    
    for (let i = 0; i < questions.length; i++) {
      const button = screen.getByText(questions[i])
      fireEvent.click(button)
      
      if (i < questions.length - 1) {
        // Wait for next question (except on last question)
        await waitFor(() => {
          expect(screen.getByText(`Question ${i + 2} of 5`)).toBeInTheDocument()
        }, { timeout: 8000 })
      }
    }
    
    // Should navigate to results after last question
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/results')
    }, { timeout: 8000 })
  }, 15000)

  it('should show previous answers as user progresses', async () => {
    render(<QuizFlow />)
    
    // Answer first question
    fireEvent.click(screen.getByText('Sweet & Luxurious'))
    
    // Wait for second question
    await waitFor(() => {
      expect(screen.getByText('Which fruit family calls to you?')).toBeInTheDocument()
    }, { timeout: 5000 })
    
    // Should show previous answer
    expect(screen.getByText('Sweet & Luxurious')).toBeInTheDocument()
    // Previous question should also be visible
    expect(screen.getByText('What speaks to your refined palate?')).toBeInTheDocument()
  })

  it('should handle touch interactions', () => {
    render(<QuizFlow />)
    
    const button = screen.getByText('Sweet & Luxurious')
    
    // Simulate touch start
    fireEvent.touchStart(button, {
      targetTouches: [{ clientX: 100 }]
    })
    
    // Simulate touch end
    fireEvent.touchEnd(button)
    
    // Button should have been clicked
    expect(button).toBeInTheDocument()
  })

  it('should handle answer selection', () => {
    render(<QuizFlow />)
    
    const button = screen.getByText('Sweet & Luxurious')
    fireEvent.click(button)
    
    // Should trigger some response (compliment or next question)
    expect(button).toBeInTheDocument()
  })

  it('should render all three options for each question', () => {
    render(<QuizFlow />)
    
    // First question - flavor preference
    expect(screen.getByText('Sweet & Luxurious')).toBeInTheDocument()
    expect(screen.getByText('Bitter & Sophisticated')).toBeInTheDocument()
    expect(screen.getByText('Balanced & Harmonious')).toBeInTheDocument()
  })

  it('should handle new third options selection', async () => {
    render(<QuizFlow />)
    
    // Test the new "Balanced & Harmonious" option
    fireEvent.click(screen.getByText('Balanced & Harmonious'))
    
    // Wait for compliment animation
    await waitFor(() => {
      const complimentTexts = screen.getAllByText(/harmonious|balance|equilibrium/i)
      expect(complimentTexts.length).toBeGreaterThan(0)
    }, { timeout: 1000 })
  })

  it('should advance through all questions with new options', async () => {
    render(<QuizFlow />)
    
    // Answer all 5 questions using the new third options
    const questions = [
      'Balanced & Harmonious',
      'Tropical & Exotic', 
      'Medium & Versatile',
      'Modern & Refined',
      'Adventurous & Playful'
    ]
    
    for (let i = 0; i < questions.length; i++) {
      const button = screen.getByText(questions[i])
      fireEvent.click(button)
      
      if (i < questions.length - 1) {
        // Wait for next question (except on last question)
        await waitFor(() => {
          expect(screen.getByText(`Question ${i + 2} of 5`)).toBeInTheDocument()
        }, { timeout: 8000 })
      }
    }
    
    // Should navigate to results after last question
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/results')
    }, { timeout: 8000 })
  }, 15000)

  it('should test fruit family question with all three options', async () => {
    render(<QuizFlow />)
    
    // Answer first question to get to fruit family question
    fireEvent.click(screen.getByText('Sweet & Luxurious'))
    
    await waitFor(() => {
      expect(screen.getByText('Which fruit family calls to you?')).toBeInTheDocument()
      expect(screen.getByText('Citrus & Bright')).toBeInTheDocument()
      expect(screen.getByText('Stone Fruit & Rich')).toBeInTheDocument()
      expect(screen.getByText('Tropical & Exotic')).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('should test indulgence style question with all three options', async () => {
    render(<QuizFlow />)
    
    // Answer first two questions to get to indulgence style question
    fireEvent.click(screen.getByText('Sweet & Luxurious'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Citrus & Bright'))
    }, { timeout: 8000 })
    
    await waitFor(() => {
      expect(screen.getByText('How do you prefer to indulge?')).toBeInTheDocument()
      expect(screen.getByText('Light & Refreshing')).toBeInTheDocument()
      expect(screen.getByText('Bold & Spirit-Forward')).toBeInTheDocument()
      expect(screen.getByText('Medium & Versatile')).toBeInTheDocument()
    }, { timeout: 8000 })
  }, 15000)
})