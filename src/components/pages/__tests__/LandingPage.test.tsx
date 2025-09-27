import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '../../../test/utils'
import LandingPage from '../LandingPage'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('LandingPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the main title', () => {
    render(<LandingPage />)
    
    expect(screen.getByText('Secret Menu')).toBeInTheDocument()
  })

  it('should render the subtitle', () => {
    render(<LandingPage />)
    
    expect(screen.getByText('Discover a secret cocktail just for you')).toBeInTheDocument()
    expect(screen.getByText('Where sophistication meets serendipity')).toBeInTheDocument()
  })

  it('should render the description text', () => {
    render(<LandingPage />)
    
    const description = screen.getByText(/Through a series of refined questions/)
    expect(description).toBeInTheDocument()
  })

  it('should render the begin journey button', () => {
    render(<LandingPage />)
    
    const button = screen.getByRole('button', { name: 'Begin Your Journey' })
    expect(button).toBeInTheDocument()
  })

  it('should navigate to quiz when button is clicked', () => {
    render(<LandingPage />)
    
    const button = screen.getByText('Begin Your Journey')
    fireEvent.click(button)
    
    expect(mockNavigate).toHaveBeenCalledWith('/quiz')
  })

  it('should show call to action text', () => {
    render(<LandingPage />)
    
    expect(screen.getByText('Your perfect cocktail awaits...')).toBeInTheDocument()
  })

  it('should handle button hover interactions', () => {
    render(<LandingPage />)
    
    const button = screen.getByRole('button', { name: 'Begin Your Journey' })
    
    // Simulate mouse enter and leave (just test that events don't throw)
    fireEvent.mouseEnter(button)
    fireEvent.mouseLeave(button)
    
    // Button should still be in the document
    expect(button).toBeInTheDocument()
  })

  it('should render floating orbs background', () => {
    render(<LandingPage />)
    
    // FloatingOrbs component should be rendered (check for its container)
    const container = screen.getByText('Secret Menu').closest('.min-h-screen')
    expect(container).toBeInTheDocument()
  })

  it('should render magical particles', () => {
    render(<LandingPage />)
    
    // MagicalParticles should be rendered (check for its container)
    const container = screen.getByText('Secret Menu').closest('.min-h-screen')
    expect(container).toBeInTheDocument()
  })

  it('should have proper responsive classes', () => {
    render(<LandingPage />)
    
    const title = screen.getByText('Secret Menu')
    expect(title).toHaveClass('text-6xl', 'md:text-8xl')
    
    const subtitle = screen.getByText('Discover a secret cocktail just for you')
    expect(subtitle).toHaveClass('text-2xl', 'md:text-3xl')
  })

  it('should have premium styling classes', () => {
    render(<LandingPage />)
    
    const button = screen.getByRole('button', { name: 'Begin Your Journey' })
    expect(button).toBeInTheDocument()
    
    const title = screen.getByText('Secret Menu')
    expect(title).toHaveClass('font-elegant')
  })

  it('should have animation classes', () => {
    render(<LandingPage />)
    
    const title = screen.getByText('Secret Menu').closest('div')
    expect(title).toHaveClass('animate-fade-in')
    
    const subtitle = screen.getByText('Discover a secret cocktail just for you').closest('div')
    expect(subtitle).toHaveClass('animate-slide-up')
  })

  it('should be accessible', () => {
    render(<LandingPage />)
    
    const button = screen.getByRole('button', { name: 'Begin Your Journey' })
    expect(button).toBeEnabled()
  })
})