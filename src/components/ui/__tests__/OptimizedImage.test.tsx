import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import OptimizedImage from '../OptimizedImage'

// Mock the performance service
vi.mock('../../../services/performance', () => ({
  createIntersectionObserver: vi.fn((_callback: any) => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  }))
}))

describe('OptimizedImage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with basic props', () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image" 
        lazy={false}
      />
    )
    
    const img = screen.getByAltText('Test image')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/test-image.jpg')
  })

  it('should show placeholder while loading', () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image"
        placeholder="/placeholder.jpg"
        lazy={false}
      />
    )
    
    // Should show placeholder initially
    const container = screen.getByAltText('Test image').parentElement
    expect(container?.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('should handle image load event', async () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image"
        lazy={false}
      />
    )
    
    const img = screen.getByAltText('Test image')
    
    // Simulate image load
    fireEvent.load(img)
    
    await waitFor(() => {
      expect(img).toHaveClass('opacity-100')
    })
  })

  it('should handle image error', async () => {
    render(
      <OptimizedImage 
        src="/broken-image.jpg" 
        alt="Test image"
        lazy={false}
      />
    )
    
    const img = screen.getByAltText('Test image')
    
    // Simulate image error
    fireEvent.error(img)
    
    await waitFor(() => {
      // Should show error state
      expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument()
    })
  })

  it('should set up intersection observer for lazy loading', () => {
    const { createIntersectionObserver } = require('../../../services/performance')
    
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image"
        lazy={true}
      />
    )
    
    expect(createIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { rootMargin: '50px' }
    )
  })

  it('should not set up intersection observer when lazy is false', () => {
    const { createIntersectionObserver } = require('../../../services/performance')
    
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image"
        lazy={false}
      />
    )
    
    expect(createIntersectionObserver).not.toHaveBeenCalled()
  })

  it('should apply custom dimensions', () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image"
        width={800}
        height={600}
        lazy={false}
      />
    )
    
    const img = screen.getByAltText('Test image')
    expect(img).toHaveAttribute('width', '800')
    expect(img).toHaveAttribute('height', '600')
  })

  it('should apply custom className', () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image"
        className="custom-class"
        lazy={false}
      />
    )
    
    const container = screen.getByAltText('Test image').parentElement
    expect(container).toHaveClass('custom-class')
  })

  it('should use eager loading when lazy is false', () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image"
        lazy={false}
      />
    )
    
    const img = screen.getByAltText('Test image')
    expect(img).toHaveAttribute('loading', 'eager')
  })

  it('should use lazy loading when lazy is true', () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image"
        lazy={true}
      />
    )
    
    const img = screen.getByAltText('Test image')
    expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('should have proper decoding attribute', () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image"
        lazy={false}
      />
    )
    
    const img = screen.getByAltText('Test image')
    expect(img).toHaveAttribute('decoding', 'async')
  })

  it('should show error icon when image fails to load', async () => {
    render(
      <OptimizedImage 
        src="/broken-image.jpg" 
        alt="Test image"
        lazy={false}
      />
    )
    
    const img = screen.getByAltText('Test image')
    fireEvent.error(img)
    
    await waitFor(() => {
      const errorIcon = screen.getByRole('img', { hidden: true })
      expect(errorIcon).toBeInTheDocument()
    })
  })
})