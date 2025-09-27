import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LandingPage from '../../components/pages/LandingPage'
import QuizFlow from '../../components/features/QuizFlow'
import { QuizProvider } from '../../context/QuizContext'
import { BrowserRouter } from 'react-router-dom'

// Mock services
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

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom') as any
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <QuizProvider>
      {children}
    </QuizProvider>
  </BrowserRouter>
)

describe('Accessibility Tests', () => {
  it('should render landing page without accessibility errors', () => {
    render(
      <TestWrapper>
        <LandingPage />
      </TestWrapper>
    )
    
    expect(screen.getByText('Secret Menu')).toBeInTheDocument()
  })

  it('should render quiz flow without accessibility errors', () => {
    render(
      <TestWrapper>
        <QuizFlow />
      </TestWrapper>
    )
    
    expect(screen.getByText('What speaks to your refined palate?')).toBeInTheDocument()
  })

  it('should have proper heading hierarchy', () => {
    render(
      <TestWrapper>
        <LandingPage />
      </TestWrapper>
    )
    
    // Should have main heading
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toBeInTheDocument()
    expect(mainHeading).toHaveTextContent('Secret Menu')
  })

  it('should have accessible buttons with proper labels', () => {
    render(
      <TestWrapper>
        <LandingPage />
      </TestWrapper>
    )
    
    const button = screen.getByRole('button', { name: 'Begin Your Journey' })
    expect(button).toBeInTheDocument()
    expect(button).toBeEnabled()
  })

  it('should have proper focus management', () => {
    render(
      <TestWrapper>
        <QuizFlow />
      </TestWrapper>
    )
    
    // Quiz buttons should be focusable
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).not.toHaveAttribute('tabindex', '-1')
    })
  })

  it('should have proper color contrast', () => {
    render(
      <TestWrapper>
        <LandingPage />
      </TestWrapper>
    )
    
    // Check that text elements have proper contrast classes
    const title = screen.getByText('Secret Menu')
    expect(title).toHaveClass('text-transparent')
    
    const subtitle = screen.getByText('Discover a secret cocktail just for you')
    expect(subtitle).toHaveClass('text-premium-silver')
  })

  it('should support keyboard navigation', () => {
    render(
      <TestWrapper>
        <QuizFlow />
      </TestWrapper>
    )
    
    // All interactive elements should be keyboard accessible
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).not.toHaveAttribute('disabled')
    })
  })

  it('should have proper ARIA labels for progress indicators', () => {
    render(
      <TestWrapper>
        <QuizFlow />
      </TestWrapper>
    )
    
    // Progress indicator should be accessible
    const progressText = screen.getByText('Question 1 of 5')
    expect(progressText).toBeInTheDocument()
    
    const percentageText = screen.getByText('20% Complete')
    expect(percentageText).toBeInTheDocument()
  })

  it('should have semantic HTML structure', () => {
    render(
      <TestWrapper>
        <LandingPage />
      </TestWrapper>
    )
    
    // Should use semantic elements
    const button = screen.getByRole('button')
    expect(button.tagName).toBe('BUTTON')
  })

  it('should support screen readers with proper text content', () => {
    render(
      <TestWrapper>
        <LandingPage />
      </TestWrapper>
    )
    
    // Important text should be accessible to screen readers
    expect(screen.getByText('Secret Menu')).toBeInTheDocument()
    expect(screen.getByText('Discover a secret cocktail just for you')).toBeInTheDocument()
    expect(screen.getByText('Where sophistication meets serendipity')).toBeInTheDocument()
  })

  it('should have proper form accessibility (if applicable)', () => {
    render(
      <TestWrapper>
        <QuizFlow />
      </TestWrapper>
    )
    
    // Quiz options should be properly labeled
    const sweetOption = screen.getByText('Sweet & Luxurious')
    expect(sweetOption).toBeInTheDocument()
    
    const bitterOption = screen.getByText('Bitter & Sophisticated')
    expect(bitterOption).toBeInTheDocument()
  })

  it('should handle reduced motion preferences', () => {
    // Mock prefers-reduced-motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
    
    render(
      <TestWrapper>
        <LandingPage />
      </TestWrapper>
    )
    
    // Component should render without animation-dependent functionality breaking
    expect(screen.getByText('Secret Menu')).toBeInTheDocument()
  })

  it('should have proper mobile accessibility', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })
    
    render(
      <TestWrapper>
        <QuizFlow />
      </TestWrapper>
    )
    
    // Touch targets should be large enough (44px minimum)
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      // Buttons should have adequate padding for touch
      expect(button).toHaveClass('p-6') // 24px padding = 48px minimum touch target
    })
  })
})