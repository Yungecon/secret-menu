import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '../utils'
import LandingPage from '../../components/pages/LandingPage'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom') as any
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Basic Component Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render landing page correctly', () => {
    render(<LandingPage />)

    expect(screen.getByText('Secret Menu')).toBeInTheDocument()
    expect(screen.getByText('Discover a secret cocktail just for you')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Begin Your Journey' })).toBeInTheDocument()
  })

  it('should have proper page structure', () => {
    render(<LandingPage />)

    // Check for main elements
    expect(screen.getByText('Secret Menu')).toBeInTheDocument()
    expect(screen.getByText('Where sophistication meets serendipity')).toBeInTheDocument()
    expect(screen.getByText(/Through a series of refined questions/)).toBeInTheDocument()
    expect(screen.getByText('Your perfect cocktail awaits...')).toBeInTheDocument()
  })
})