import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('PWA Functionality', () => {
  let mockServiceWorker: any
  
  beforeEach(() => {
    // Mock service worker
    mockServiceWorker = {
      register: vi.fn().mockResolvedValue({
        installing: null,
        waiting: null,
        active: null,
        addEventListener: vi.fn(),
        update: vi.fn()
      }),
      getRegistration: vi.fn().mockResolvedValue(null)
    }
    
    Object.defineProperty(navigator, 'serviceWorker', {
      value: mockServiceWorker,
      writable: true
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should register service worker when available', async () => {
    const { registerServiceWorker } = await import('../../services/performance')
    
    const registration = await registerServiceWorker()
    
    expect(mockServiceWorker.register).toHaveBeenCalledWith('/sw.js')
    expect(registration).toBeDefined()
  })

  it('should handle service worker registration failure gracefully', async () => {
    mockServiceWorker.register.mockRejectedValue(new Error('Registration failed'))
    
    const { registerServiceWorker } = await import('../../services/performance')
    
    const registration = await registerServiceWorker()
    
    expect(registration).toBeNull()
  })

  it('should return null when service worker is not supported', async () => {
    // Remove service worker support
    Object.defineProperty(navigator, 'serviceWorker', {
      value: undefined,
      writable: true
    })
    
    const { registerServiceWorker } = await import('../../services/performance')
    
    const registration = await registerServiceWorker()
    
    expect(registration).toBeNull()
  })

  it('should detect slow network connections', () => {
    // Mock navigator.connection
    Object.defineProperty(navigator, 'connection', {
      value: {
        effectiveType: 'slow-2g',
        downlink: 0.5,
        rtt: 400,
        saveData: false
      },
      writable: true
    })
    
    const { PerformanceMonitor } = require('../../services/performance')
    const monitor = PerformanceMonitor.getInstance()
    
    expect(monitor.isSlowConnection()).toBe(true)
  })

  it('should detect fast network connections', () => {
    // Mock navigator.connection
    Object.defineProperty(navigator, 'connection', {
      value: {
        effectiveType: '4g',
        downlink: 10,
        rtt: 50,
        saveData: false
      },
      writable: true
    })
    
    const { PerformanceMonitor } = require('../../services/performance')
    const monitor = PerformanceMonitor.getInstance()
    
    expect(monitor.isSlowConnection()).toBe(false)
  })

  it('should handle missing connection API gracefully', () => {
    // Remove connection API
    Object.defineProperty(navigator, 'connection', {
      value: undefined,
      writable: true
    })
    
    const { PerformanceMonitor } = require('../../services/performance')
    const monitor = PerformanceMonitor.getInstance()
    
    expect(monitor.isSlowConnection()).toBe(false)
    expect(monitor.getNetworkInfo()).toBeNull()
  })

  it('should create intersection observer when supported', () => {
    const mockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }
    
    global.IntersectionObserver = vi.fn().mockImplementation(() => mockObserver)
    
    const { createIntersectionObserver } = require('../../services/performance')
    const callback = vi.fn()
    
    const observer = createIntersectionObserver(callback)
    
    expect(observer).toBeDefined()
    expect(global.IntersectionObserver).toHaveBeenCalledWith(callback, {
      rootMargin: '50px',
      threshold: 0.1
    })
  })

  it('should return null when intersection observer is not supported', () => {
    // Remove IntersectionObserver support
    global.IntersectionObserver = undefined as any
    
    const { createIntersectionObserver } = require('../../services/performance')
    const callback = vi.fn()
    
    const observer = createIntersectionObserver(callback)
    
    expect(observer).toBeNull()
  })

  it('should preload resources correctly', () => {
    // Mock document.createElement and document.head.appendChild
    const mockLink = {
      rel: '',
      href: '',
      as: '',
      type: ''
    }
    
    const mockHead = {
      appendChild: vi.fn()
    }
    
    document.createElement = vi.fn().mockReturnValue(mockLink)
    Object.defineProperty(document, 'head', {
      value: mockHead,
      writable: true
    })
    
    const { preloadResource } = require('../../services/performance')
    
    preloadResource('/test.css', 'style', 'text/css')
    
    expect(document.createElement).toHaveBeenCalledWith('link')
    expect(mockLink.rel).toBe('preload')
    expect(mockLink.href).toBe('/test.css')
    expect(mockLink.as).toBe('style')
    expect(mockLink.type).toBe('text/css')
    expect(mockHead.appendChild).toHaveBeenCalledWith(mockLink)
  })
})