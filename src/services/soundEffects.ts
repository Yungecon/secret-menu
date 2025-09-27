// Premium sound effects for magical interactions
// Uses Web Audio API for subtle, luxury-brand audio feedback

class SoundEffects {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Initialize audio context on first user interaction
    this.initializeAudio();
  }

  private async initializeAudio() {
    try {
      // Create audio context on first user interaction to comply with browser policies
      if (!this.audioContext && typeof window !== 'undefined') {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    } catch (error) {
      console.log('Audio not supported, continuing without sound effects');
      this.enabled = false;
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext && this.enabled) {
      await this.initializeAudio();
    }
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // Create a subtle, premium tone
  private createTone(frequency: number, duration: number, volume: number = 0.1) {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = 'sine';

    // Smooth fade in/out for premium feel
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Magical button press sound
  async playButtonPress() {
    await this.ensureAudioContext();
    this.createTone(800, 0.1, 0.05); // Subtle high tone
  }

  // Compliment reveal sound
  async playComplimentReveal() {
    await this.ensureAudioContext();
    // Gentle ascending chord
    setTimeout(() => this.createTone(523, 0.3, 0.03), 0);   // C5
    setTimeout(() => this.createTone(659, 0.4, 0.03), 100); // E5
    setTimeout(() => this.createTone(784, 0.5, 0.03), 200); // G5
  }

  // Quiz completion sound
  async playQuizComplete() {
    await this.ensureAudioContext();
    // Triumphant chord progression
    setTimeout(() => this.createTone(523, 0.2, 0.04), 0);   // C5
    setTimeout(() => this.createTone(659, 0.2, 0.04), 150); // E5
    setTimeout(() => this.createTone(784, 0.2, 0.04), 300); // G5
    setTimeout(() => this.createTone(1047, 0.4, 0.04), 450); // C6
  }

  // Cocktail reveal sound
  async playCocktailReveal() {
    await this.ensureAudioContext();
    // Magical shimmer sound
    setTimeout(() => this.createTone(1047, 0.3, 0.03), 0);   // C6
    setTimeout(() => this.createTone(1319, 0.3, 0.03), 100); // E6
    setTimeout(() => this.createTone(1568, 0.4, 0.03), 200); // G6
  }

  // Enable/disable sound effects
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

// Create singleton instance
export const soundEffects = new SoundEffects();

// Convenience functions
export const playButtonPress = () => soundEffects.playButtonPress();
export const playComplimentReveal = () => soundEffects.playComplimentReveal();
export const playQuizComplete = () => soundEffects.playQuizComplete();
export const playCocktailReveal = () => soundEffects.playCocktailReveal();