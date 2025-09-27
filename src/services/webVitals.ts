import { onCLS, onFID, onLCP, onINP, onTTFB, Metric } from 'web-vitals'
import { trackEvent } from './analytics'

const report = (metric: Metric) => {
  const numericValue = Math.round(metric.value)
  trackEvent(
    'web_vitals',
    metric.name.toLowerCase(),
    metric.id,
    numericValue,
    {
      id: metric.id,
      rating: (metric as any).rating,
      delta: metric.delta,
    }
  )
}

export const reportWebVitals = () => {
  onCLS(report)
  onFID(report)
  onLCP(report)
  onINP(report)
  onTTFB(report)
}

