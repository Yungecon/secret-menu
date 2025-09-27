import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SlotMachine from '../SlotMachine';

// Mock the SlotReel component to simplify testing
vi.mock('../SlotReel', () => ({
  default: ({ attributes, isSpinning, onStop, reelIndex, disabled }: any) => (
    <div data-testid={`slot-reel-${reelIndex}`}>
      <div>Reel {reelIndex + 1}</div>
      <div>Spinning: {isSpinning.toString()}</div>
      <div>Disabled: {disabled.toString()}</div>
      <div>Attributes: {attributes.join(', ')}</div>
      {!disabled && !isSpinning && (
        <button 
          onClick={() => onStop(attributes[0])}
          data-testid={`stop-reel-${reelIndex}`}
        >
          Stop Reel {reelIndex + 1}
        </button>
      )}
    </div>
  )
}));

const renderSlotMachine = () => {
  return render(
    <BrowserRouter>
      <SlotMachine />
    </BrowserRouter>
  );
};

describe('SlotMachine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render initial spinning state', () => {
    renderSlotMachine();
    
    expect(screen.getByText('Secret Shuffle')).toBeInTheDocument();
    expect(screen.getByText('Let the reels decide your cocktail destiny')).toBeInTheDocument();
    expect(screen.getByText('Tap the glowing reel to stop it (1 of 3)')).toBeInTheDocument();
  });

  it('should render three reels with correct attributes', () => {
    renderSlotMachine();
    
    expect(screen.getByTestId('slot-reel-0')).toBeInTheDocument();
    expect(screen.getByTestId('slot-reel-1')).toBeInTheDocument();
    expect(screen.getByTestId('slot-reel-2')).toBeInTheDocument();
    
    // Check reel labels
    expect(screen.getByText('FLAVORS')).toBeInTheDocument();
    expect(screen.getByText('MOODS')).toBeInTheDocument();
    expect(screen.getByText('STYLES')).toBeInTheDocument();
  });

  it('should start with all reels spinning automatically', () => {
    renderSlotMachine();
    
    // All reels should be spinning immediately
    expect(screen.getByTestId('slot-reel-0')).toHaveTextContent('Spinning: true');
    expect(screen.getByTestId('slot-reel-1')).toHaveTextContent('Spinning: true');
    expect(screen.getByTestId('slot-reel-2')).toHaveTextContent('Spinning: true');
    
    // Instructions should show
    expect(screen.getByText('Tap the glowing reel to stop it (1 of 3)')).toBeInTheDocument();
  });

  it('should show instructions when spinning', () => {
    renderSlotMachine();
    
    expect(screen.getByText('Tap the glowing reel to stop it (1 of 3)')).toBeInTheDocument();
  });

  it('should handle reel interactions', async () => {
    renderSlotMachine();
    
    // Reels should already be spinning
    expect(screen.getByTestId('slot-reel-0')).toHaveTextContent('Spinning: true');
    expect(screen.getByTestId('slot-reel-1')).toHaveTextContent('Spinning: true');
    expect(screen.getByTestId('slot-reel-2')).toHaveTextContent('Spinning: true');
    
    // Only first reel should be enabled
    expect(screen.getByTestId('slot-reel-0')).toHaveTextContent('Disabled: false');
    expect(screen.getByTestId('slot-reel-1')).toHaveTextContent('Disabled: true');
    expect(screen.getByTestId('slot-reel-2')).toHaveTextContent('Disabled: true');
  });

  it('should display correct attributes for each reel', async () => {
    renderSlotMachine();
    
    // Check that each reel has the correct attributes
    expect(screen.getByTestId('slot-reel-0')).toHaveTextContent('sweet, bitter, citrus, herbal, spicy, fruity, floral, smoky, creamy, tart');
    expect(screen.getByTestId('slot-reel-1')).toHaveTextContent('adventurous, elegant, playful, cozy, celebratory, sophisticated, bold, refreshing, mysterious, classic');
    expect(screen.getByTestId('slot-reel-2')).toHaveTextContent('classic, experimental, light, boozy, shaken, stirred, built, tropical, seasonal, premium');
  });

  it('should have proper reel labels', async () => {
    renderSlotMachine();
    
    // Check reel labels are displayed
    expect(screen.getByText('FLAVORS')).toBeInTheDocument();
    expect(screen.getByText('MOODS')).toBeInTheDocument();
    expect(screen.getByText('STYLES')).toBeInTheDocument();
  });

  it('should show correct initial instructions', async () => {
    renderSlotMachine();
    
    // Should show initial spinning instructions
    expect(screen.getByText('Tap the glowing reel to stop it (1 of 3)')).toBeInTheDocument();
  });

  it('should have navigation buttons', () => {
    renderSlotMachine();
    
    expect(screen.getByText('Back to Menu')).toBeInTheDocument();
    expect(screen.getByText('Take Quiz Instead')).toBeInTheDocument();
  });

  it('should disable appropriate reels during gameplay', () => {
    renderSlotMachine();
    
    // Initially only first reel should be enabled (spinning state)
    expect(screen.getByTestId('slot-reel-0')).toHaveTextContent('Disabled: false');
    expect(screen.getByTestId('slot-reel-1')).toHaveTextContent('Disabled: true');
    expect(screen.getByTestId('slot-reel-2')).toHaveTextContent('Disabled: true');
  });
});