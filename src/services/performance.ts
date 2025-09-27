// Performance optimization utilities for bar environments

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Record<string, number> = {};

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track page load performance
  trackPageLoad(pageName: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      let loadTime = 0;
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries && navEntries.length > 0) {
        const navigation = navEntries[0] as PerformanceNavigationTiming;
        loadTime = (navigation.loadEventEnd || 0) - (navigation.loadEventStart || 0);
      } else if ((performance as any).timing) {
        const t = (performance as any).timing;
        // Fallback for older browsers
        loadTime = Math.max(0, (t.loadEventEnd || 0) - (t.navigationStart || 0));
      }
      
      this.metrics[`${pageName}_load_time`] = loadTime;
      
      // Log slow loads (>3 seconds)
      if (loadTime > 3000) {
        console.warn(`Slow page load detected: ${pageName} took ${loadTime}ms`);
      }
    }
  }

  // Track component render performance
  trackRender(componentName: string, startTime: number) {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    this.metrics[`${componentName}_render_time`] = renderTime;
    
    // Log slow renders (>100ms)
    if (renderTime > 100) {
      console.warn(`Slow render detected: ${componentName} took ${renderTime}ms`);
    }
  }

  // Get performance metrics
  getMetrics() {
    return { ...this.metrics };
  }

  // Check network conditions
  getNetworkInfo() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  }

  // Optimize for slow connections
  isSlowConnection(): boolean {
    const networkInfo = this.getNetworkInfo();
    if (!networkInfo) return false;
    
    return (
      networkInfo.effectiveType === 'slow-2g' ||
      networkInfo.effectiveType === '2g' ||
      networkInfo.downlink < 1.5 ||
      networkInfo.rtt > 300 ||
      networkInfo.saveData
    );
  }
}

// Image optimization utilities
export const optimizeImage = (src: string, width?: number, quality?: number): string => {
  // For future implementation with image CDN
  // This would integrate with services like Cloudinary or ImageKit
  
  // Suppress unused parameter warnings for future implementation
  void width;
  void quality;
  
  return src;
};

// Lazy loading utility
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    });
  }
  return null;
};

// Preload critical resources
export const preloadResource = (href: string, as: string, type?: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  document.head.appendChild(link);
};

// Critical CSS inlining (for future optimization)
export const inlineCriticalCSS = (css: string) => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// Service worker utilities
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

// Memory management
export const cleanupMemory = () => {
  // Force garbage collection if available (Chrome DevTools)
  if ('gc' in window) {
    (window as any).gc();
  }
  
  // Clear any large objects from memory
  // This would be implemented based on specific app needs
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance();
  
  return {
    trackPageLoad: monitor.trackPageLoad.bind(monitor),
    trackRender: monitor.trackRender.bind(monitor),
    getMetrics: monitor.getMetrics.bind(monitor),
    isSlowConnection: monitor.isSlowConnection.bind(monitor),
    getNetworkInfo: monitor.getNetworkInfo.bind(monitor)
  };
};