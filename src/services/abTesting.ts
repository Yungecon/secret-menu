import { trackEvent } from './analytics'

type VariantWeights = number[] | undefined

class ABTestingService {
  private storagePrefix = 'ab:'
  private visitorKey = 'ab:visitor_id'

  getVariant(experimentName: string, variants: string[], weights?: VariantWeights): string {
    const key = this.buildStorageKey(experimentName)
    const existing = localStorage.getItem(key)
    if (existing) return existing

    const variant = this.assignVariant(experimentName, variants, weights)
    localStorage.setItem(key, variant)
    this.trackExposure(experimentName, variant)
    return variant
  }

  assignVariant(experimentName: string, variants: string[], weights?: VariantWeights): string {
    if (!variants || variants.length === 0) {
      throw new Error('ABTesting: variants array must not be empty')
    }

    const r = this.getDeterministicRandom(this.getVisitorId(), experimentName)

    if (!weights || weights.length !== variants.length) {
      const idx = Math.floor(r * variants.length)
      return variants[Math.min(idx, variants.length - 1)]
    }

    const total = weights.reduce((sum, w) => sum + (w < 0 ? 0 : w), 0)
    if (total <= 0) {
      const idx = Math.floor(r * variants.length)
      return variants[Math.min(idx, variants.length - 1)]
    }

    let cumulative = 0
    const target = r * total
    for (let i = 0; i < variants.length; i++) {
      cumulative += Math.max(0, weights[i])
      if (target <= cumulative) return variants[i]
    }
    return variants[variants.length - 1]
  }

  trackExposure(experimentName: string, variant: string) {
    try {
      trackEvent('ab', 'exposure', experimentName, undefined, { variant })
    } catch {
      // no-op
    }
  }

  private buildStorageKey(experimentName: string): string {
    return `${this.storagePrefix}${experimentName}`
  }

  private getVisitorId(): string {
    const existing = localStorage.getItem(this.visitorKey)
    if (existing) return existing
    const id = this.generateRandomId()
    localStorage.setItem(this.visitorKey, id)
    return id
  }

  private generateRandomId(): string {
    return `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  }

  private getDeterministicRandom(visitorId: string, experimentName: string): number {
    const seedStr = `${visitorId}::${experimentName}`
    let hash = 2166136261
    for (let i = 0; i < seedStr.length; i++) {
      hash ^= seedStr.charCodeAt(i)
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)
    }
    // Normalize to [0,1)
    const normalized = (hash >>> 0) / 4294967296
    return normalized
  }
}

export const abTesting = new ABTestingService()

export const getABVariant = (
  experimentName: string,
  variants: string[],
  weights?: number[]
) => abTesting.getVariant(experimentName, variants, weights)

