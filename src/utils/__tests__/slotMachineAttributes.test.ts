import { describe, it, expect } from 'vitest';
import {
  FLAVOR_ATTRIBUTES,
  MOOD_ATTRIBUTES,
  STYLE_ATTRIBUTES,
  convertSlotToQuizAnswers,
  mapAttributesToTags,
  getRandomAttribute,
  validateSlotResult,
  SlotMachineResult
} from '../slotMachineAttributes';

describe('Slot Machine Attributes', () => {
  describe('Attribute Arrays', () => {
    it('should have correct flavor attributes', () => {
      expect(FLAVOR_ATTRIBUTES).toContain('sweet');
      expect(FLAVOR_ATTRIBUTES).toContain('bitter');
      expect(FLAVOR_ATTRIBUTES).toContain('citrus');
      expect(FLAVOR_ATTRIBUTES.length).toBe(10);
    });

    it('should have correct mood attributes', () => {
      expect(MOOD_ATTRIBUTES).toContain('adventurous');
      expect(MOOD_ATTRIBUTES).toContain('elegant');
      expect(MOOD_ATTRIBUTES).toContain('playful');
      expect(MOOD_ATTRIBUTES.length).toBe(10);
    });

    it('should have correct style attributes', () => {
      expect(STYLE_ATTRIBUTES).toContain('classic');
      expect(STYLE_ATTRIBUTES).toContain('experimental');
      expect(STYLE_ATTRIBUTES).toContain('light');
      expect(STYLE_ATTRIBUTES.length).toBe(10);
    });
  });

  describe('convertSlotToQuizAnswers', () => {
    it('should convert sweet flavor to sweet preference', () => {
      const slotResult: SlotMachineResult = {
        flavor: 'sweet',
        mood: 'elegant',
        style: 'classic',
        timestamp: Date.now()
      };

      const quizAnswers = convertSlotToQuizAnswers(slotResult);
      expect(quizAnswers.sweetVsBitter).toBe('sweet');
      expect(quizAnswers.moodPreference).toBe('elegant');
    });

    it('should convert bitter flavor to bitter preference', () => {
      const slotResult: SlotMachineResult = {
        flavor: 'bitter',
        mood: 'bold',
        style: 'boozy',
        timestamp: Date.now()
      };

      const quizAnswers = convertSlotToQuizAnswers(slotResult);
      expect(quizAnswers.sweetVsBitter).toBe('bitter');
      expect(quizAnswers.lightVsBoozy).toBe('boozy');
    });

    it('should convert citrus flavor to citrus preference', () => {
      const slotResult: SlotMachineResult = {
        flavor: 'citrus',
        mood: 'refreshing',
        style: 'light',
        timestamp: Date.now()
      };

      const quizAnswers = convertSlotToQuizAnswers(slotResult);
      expect(quizAnswers.citrusVsStone).toBe('citrus');
      expect(quizAnswers.lightVsBoozy).toBe('light');
    });

    it('should handle style to classic/experimental mapping', () => {
      const classicResult: SlotMachineResult = {
        flavor: 'herbal',
        mood: 'sophisticated',
        style: 'classic',
        timestamp: Date.now()
      };

      const experimentalResult: SlotMachineResult = {
        flavor: 'spicy',
        mood: 'adventurous',
        style: 'experimental',
        timestamp: Date.now()
      };

      expect(convertSlotToQuizAnswers(classicResult).classicVsExperimental).toBe('classic');
      expect(convertSlotToQuizAnswers(experimentalResult).classicVsExperimental).toBe('experimental');
    });
  });

  describe('mapAttributesToTags', () => {
    it('should map attributes to enhanced tag arrays', () => {
      const slotResult: SlotMachineResult = {
        flavor: 'sweet',
        mood: 'elegant',
        style: 'premium',
        timestamp: Date.now()
      };

      const tags = mapAttributesToTags(slotResult);
      
      expect(tags.flavorTags).toContain('sweet');
      expect(tags.flavorTags).toContain('fruity');
      expect(tags.moodTags).toContain('elegant');
      expect(tags.moodTags).toContain('sophisticated');
      expect(tags.styleTags).toContain('premium');
    });

    it('should handle citrus flavor mapping', () => {
      const slotResult: SlotMachineResult = {
        flavor: 'citrus',
        mood: 'refreshing',
        style: 'light',
        timestamp: Date.now()
      };

      const tags = mapAttributesToTags(slotResult);
      
      expect(tags.flavorTags).toContain('citrus');
      expect(tags.flavorTags).toContain('bright');
      expect(tags.flavorTags).toContain('refreshing');
    });
  });

  describe('getRandomAttribute', () => {
    it('should return valid flavor attribute', () => {
      const flavor = getRandomAttribute('flavor');
      expect(FLAVOR_ATTRIBUTES).toContain(flavor as any);
    });

    it('should return valid mood attribute', () => {
      const mood = getRandomAttribute('mood');
      expect(MOOD_ATTRIBUTES).toContain(mood as any);
    });

    it('should return valid style attribute', () => {
      const style = getRandomAttribute('style');
      expect(STYLE_ATTRIBUTES).toContain(style as any);
    });

    it('should return different values on multiple calls', () => {
      const results = new Set();
      for (let i = 0; i < 20; i++) {
        results.add(getRandomAttribute('flavor'));
      }
      // Should get at least 2 different values in 20 tries
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe('validateSlotResult', () => {
    it('should validate correct slot result', () => {
      const validResult: SlotMachineResult = {
        flavor: 'sweet',
        mood: 'elegant',
        style: 'classic',
        timestamp: Date.now()
      };

      expect(validateSlotResult(validResult)).toBe(true);
    });

    it('should reject invalid flavor', () => {
      const invalidResult: SlotMachineResult = {
        flavor: 'invalid-flavor',
        mood: 'elegant',
        style: 'classic',
        timestamp: Date.now()
      };

      expect(validateSlotResult(invalidResult)).toBe(false);
    });

    it('should reject invalid mood', () => {
      const invalidResult: SlotMachineResult = {
        flavor: 'sweet',
        mood: 'invalid-mood',
        style: 'classic',
        timestamp: Date.now()
      };

      expect(validateSlotResult(invalidResult)).toBe(false);
    });

    it('should reject invalid style', () => {
      const invalidResult: SlotMachineResult = {
        flavor: 'sweet',
        mood: 'elegant',
        style: 'invalid-style',
        timestamp: Date.now()
      };

      expect(validateSlotResult(invalidResult)).toBe(false);
    });

    it('should reject missing timestamp', () => {
      const invalidResult = {
        flavor: 'sweet',
        mood: 'elegant',
        style: 'classic'
      } as SlotMachineResult;

      expect(validateSlotResult(invalidResult)).toBe(false);
    });
  });
});