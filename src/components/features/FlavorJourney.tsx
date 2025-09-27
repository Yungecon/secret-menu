import React, { useState, useEffect } from 'react';
import { cocktailBuildEngine } from '../../services/cocktailBuildEngine';

interface FlavorJourneyProps {
  onCocktailGenerate?: (cocktails: any[]) => void;
}

interface SelectedIngredients {
  baseSpirit?: string;
  flavorFamily?: string;
  specificFlavor?: string;
}

interface FlavorJourneyData {
  base_spirits: {
    traditional: Record<string, any>;
    non_traditional: Record<string, any>;
  };
  flavor_families: Record<string, any>;
  cocktail_dna_profiles: Record<string, any>;
  ingredient_relationships: {
    high_compatibility: Array<{spirit: string, flavor: string, reason: string}>;
    medium_compatibility: Array<{spirit: string, flavor: string, reason: string}>;
    creative_pairings: Array<{spirit: string, flavor: string, reason: string}>;
  };
}

export const FlavorJourney: React.FC<FlavorJourneyProps> = ({
  onCocktailGenerate
}) => {
  const [journeyData, setJourneyData] = useState<FlavorJourneyData | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredients>({});
  const [currentStep, setCurrentStep] = useState<'spirit' | 'flavor-family' | 'specific-flavor' | 'relationships' | 'dna'>('spirit');
  const [availableFlavors, setAvailableFlavors] = useState<string[]>([]);
  const [relationshipInfo, setRelationshipInfo] = useState<any>(null);
  const [dnaProfile, setDnaProfile] = useState<any>(null);

  // Load flavor journey data
  useEffect(() => {
    const loadJourneyData = async () => {
      try {
        const response = await fetch('/flavor_journey_data.json');
        const data = await response.json();
        setJourneyData(data);
      } catch (error) {
        console.error('Error loading flavor journey data:', error);
      }
    };

    loadJourneyData();
  }, []);

  const handleSpiritSelect = (_spiritCategory: string, spiritKey: string) => {
    const newSelection = { baseSpirit: spiritKey };
    setSelectedIngredients(newSelection);
    setCurrentStep('flavor-family');
  };

  const handleFlavorFamilySelect = (flavorFamily: string) => {
    setSelectedIngredients(prev => ({ ...prev, flavorFamily }));
    
    // Filter available flavors based on spirit compatibility
    if (journeyData && selectedIngredients.baseSpirit) {
      const family = journeyData.flavor_families[flavorFamily];
      if (family && family.flavors) {
        const compatibleFlavors = Object.keys(family.flavors).filter(flavorKey => {
          const flavor = family.flavors[flavorKey];
          return flavor.compatible_spirits && flavor.compatible_spirits.includes(selectedIngredients.baseSpirit);
        });
        
        // If no compatible flavors found, show all flavors (fallback)
        if (compatibleFlavors.length === 0) {
          console.log(`No compatible flavors found for ${selectedIngredients.baseSpirit} in ${flavorFamily}, showing all flavors`);
          setAvailableFlavors(Object.keys(family.flavors));
        } else {
          console.log(`Found ${compatibleFlavors.length} compatible flavors for ${selectedIngredients.baseSpirit} in ${flavorFamily}`);
          setAvailableFlavors(compatibleFlavors);
        }
      }
    }
    
    setCurrentStep('specific-flavor');
  };

  const handleSpecificFlavorSelect = (specificFlavor: string) => {
    setSelectedIngredients(prev => ({ ...prev, specificFlavor }));
    setCurrentStep('relationships');
    
    // Show relationship information
    if (journeyData && selectedIngredients.baseSpirit && selectedIngredients.flavorFamily) {
      const relationships = journeyData.ingredient_relationships;
      const compatibility = [
        ...relationships.high_compatibility,
        ...relationships.medium_compatibility,
        ...relationships.creative_pairings
      ].find(rel => 
        rel.spirit === selectedIngredients.baseSpirit && 
        rel.flavor === selectedIngredients.flavorFamily
      );
      
      setRelationshipInfo(compatibility);
    }
  };

  const generateCocktailDNA = () => {
    if (journeyData && selectedIngredients.flavorFamily && selectedIngredients.specificFlavor) {
      const family = journeyData.flavor_families[selectedIngredients.flavorFamily];
      const flavor = family.flavors[selectedIngredients.specificFlavor];
      
      if (flavor.dna_profile) {
        setDnaProfile(flavor.dna_profile);
        setCurrentStep('dna');
      }
    }
  };

  const generateCocktails = async () => {
    if (selectedIngredients.baseSpirit && selectedIngredients.flavorFamily) {
      try {
        console.log('Generating cocktails for:', selectedIngredients);
        
        // Use the new Flavor Journey generation method
        const generatedCocktails = await cocktailBuildEngine.generateFromFlavorJourney(selectedIngredients);
        
        console.log('Generated cocktails:', generatedCocktails);
        
        if (generatedCocktails && generatedCocktails.length > 0) {
          onCocktailGenerate?.(generatedCocktails);
        } else {
          console.log('No cocktails generated');
        }
      } catch (error) {
        console.error('Error generating cocktails:', error);
      }
    } else {
      console.log('Missing required ingredients:', selectedIngredients);
    }
  };

  const resetJourney = () => {
    setSelectedIngredients({});
    setCurrentStep('spirit');
    setAvailableFlavors([]);
    setRelationshipInfo(null);
    setDnaProfile(null);
  };

  if (!journeyData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        <span className="ml-3 text-gray-300">Loading flavor journey...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {['spirit', 'flavor-family', 'specific-flavor', 'relationships', 'dna'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === step ? 'bg-purple-600 text-white' :
                ['spirit', 'flavor-family', 'specific-flavor'].includes(step) && 
                Object.keys(selectedIngredients).length > (index === 0 ? 0 : index === 1 ? 1 : 2) ? 'bg-green-600 text-white' :
                'bg-slate-700 text-gray-400'
              }`}>
                {index + 1}
              </div>
              {index < 4 && (
                <div className={`w-12 h-0.5 ${
                  ['spirit', 'flavor-family', 'specific-flavor'].includes(step) && 
                  Object.keys(selectedIngredients).length > index + 1 ? 'bg-green-600' : 'bg-slate-700'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 'spirit' && (
        <SpiritSelector
          journeyData={journeyData}
          onSpiritSelect={handleSpiritSelect}
        />
      )}

      {currentStep === 'flavor-family' && (
        <FlavorFamilySelector
          journeyData={journeyData}
          selectedSpirit={selectedIngredients.baseSpirit}
          onFlavorFamilySelect={handleFlavorFamilySelect}
          onBack={() => setCurrentStep('spirit')}
        />
      )}

      {currentStep === 'specific-flavor' && (
        <SpecificFlavorSelector
          journeyData={journeyData}
          selectedFlavorFamily={selectedIngredients.flavorFamily}
          availableFlavors={availableFlavors}
          onSpecificFlavorSelect={handleSpecificFlavorSelect}
          onBack={() => setCurrentStep('flavor-family')}
        />
      )}

      {currentStep === 'relationships' && (
        <RelationshipViewer
          relationshipInfo={relationshipInfo}
          onContinue={generateCocktailDNA}
          onBack={() => setCurrentStep('specific-flavor')}
        />
      )}

      {currentStep === 'dna' && (
        <DNAProfileViewer
          dnaProfile={dnaProfile}
          onGenerateCocktails={generateCocktails}
          onBack={() => setCurrentStep('relationships')}
          onReset={resetJourney}
        />
      )}
    </div>
  );
};

// Spirit Selector Component
interface SpiritSelectorProps {
  journeyData: FlavorJourneyData;
  onSpiritSelect: (category: string, spirit: string) => void;
}

const SpiritSelector: React.FC<SpiritSelectorProps> = ({ journeyData, onSpiritSelect }) => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Choose Your Base Spirit
      </h2>
      <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
        Start your flavor journey by selecting a base spirit. We'll guide you through 
        compatible flavors that create magical combinations.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Traditional Spirits */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            Traditional Classics
          </h3>
          <div className="space-y-3">
            {Object.entries(journeyData.base_spirits.traditional).map(([key, spirit]) => (
              <button
                key={key}
                onClick={() => onSpiritSelect('traditional', key)}
                className="w-full text-left p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all duration-200 group"
              >
                <h4 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                  {spirit.name}
                </h4>
                <p className="text-sm text-gray-400 mt-1">{spirit.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {spirit.popular_brands.slice(0, 3).map((brand: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 bg-slate-600 rounded text-xs text-gray-300">
                      {brand}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Non-Traditional Spirits */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            Adventure Spirits
          </h3>
          <div className="space-y-3">
            {Object.entries(journeyData.base_spirits.non_traditional).map(([key, spirit]) => (
              <button
                key={key}
                onClick={() => onSpiritSelect('non_traditional', key)}
                className="w-full text-left p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all duration-200 group"
              >
                <h4 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                  {spirit.name}
                </h4>
                <p className="text-sm text-gray-400 mt-1">{spirit.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {spirit.popular_brands.slice(0, 3).map((brand: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 bg-slate-600 rounded text-xs text-gray-300">
                      {brand}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Flavor Family Selector Component
interface FlavorFamilySelectorProps {
  journeyData: FlavorJourneyData;
  selectedSpirit?: string;
  onFlavorFamilySelect: (flavorFamily: string) => void;
  onBack: () => void;
}

const FlavorFamilySelector: React.FC<FlavorFamilySelectorProps> = ({
  journeyData,
  selectedSpirit,
  onFlavorFamilySelect,
  onBack
}) => {
  const selectedSpiritData = selectedSpirit ? 
    journeyData.base_spirits.traditional[selectedSpirit] || 
    journeyData.base_spirits.non_traditional[selectedSpirit] : null;

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Choose Your Flavor Family
        </h2>
      </div>

      {selectedSpiritData && (
        <div className="mb-6 p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg">
          <p className="text-purple-300">
            Selected: <span className="font-semibold text-white">{selectedSpiritData.name}</span>
          </p>
          <p className="text-sm text-purple-200 mt-1">{selectedSpiritData.description}</p>
        </div>
      )}

      <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
        What flavor profile calls to you? Each family offers unique characteristics 
        that will shape your cocktail's personality.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(journeyData.flavor_families).map(([key, family]) => (
          <button
            key={key}
            onClick={() => onFlavorFamilySelect(key)}
            className="p-6 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-all duration-200 group text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{family.icon}</span>
              <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                {family.name}
              </h3>
            </div>
            <p className="text-gray-400 mb-3">{family.description}</p>
            <div className="flex flex-wrap gap-1">
              {Object.keys(family.flavors).slice(0, 3).map((flavorKey, idx) => (
                <span key={idx} className="px-2 py-1 bg-slate-600 rounded text-xs text-gray-300">
                  {(family.flavors[flavorKey] as any).name}
                </span>
              ))}
              {Object.keys(family.flavors).length > 3 && (
                <span className="px-2 py-1 bg-slate-600 rounded text-xs text-gray-300">
                  +{Object.keys(family.flavors).length - 3} more
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Specific Flavor Selector Component
interface SpecificFlavorSelectorProps {
  journeyData: FlavorJourneyData;
  selectedFlavorFamily?: string;
  availableFlavors: string[];
  onSpecificFlavorSelect: (specificFlavor: string) => void;
  onBack: () => void;
}

const SpecificFlavorSelector: React.FC<SpecificFlavorSelectorProps> = ({
  journeyData,
  selectedFlavorFamily,
  availableFlavors,
  onSpecificFlavorSelect,
  onBack
}) => {
  const family = selectedFlavorFamily ? journeyData.flavor_families[selectedFlavorFamily] : null;

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Choose Your Specific Flavor
        </h2>
      </div>

      {family && (
        <div className="mb-6 p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{family.icon}</span>
            <div>
              <p className="text-purple-300">
                Flavor Family: <span className="font-semibold text-white">{family.name}</span>
              </p>
              <p className="text-sm text-purple-200">{family.description}</p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
        Perfect! Now choose the specific flavor that speaks to you. 
        These are the flavors that work best with your selected spirit.
      </p>


      {availableFlavors.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading flavors...</h3>
          <p className="text-gray-400 mb-4">
            Finding the perfect flavors for your selection
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {availableFlavors.map((flavorKey) => {
          const flavor = family?.flavors[flavorKey];
          if (!flavor) return null;

          return (
            <button
              key={flavorKey}
              onClick={() => onSpecificFlavorSelect(flavorKey)}
              className="p-6 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-all duration-200 group text-left"
            >
              <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors mb-3">
                {flavor.name}
              </h3>
              <p className="text-gray-400 mb-4">{flavor.description}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">DNA Profile:</h4>
                <div className="space-y-1">
                  {Object.entries(flavor.dna_profile).map(([trait, value]) => (
                    <div key={trait} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-16 capitalize">{trait}:</span>
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(value as number) * 10}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-300 w-8">{(value as number)}/10</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Perfect for:</h4>
                <div className="flex flex-wrap gap-1">
                  {flavor.ingredients.slice(0, 3).map((ingredient: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 bg-slate-600 rounded text-xs text-gray-300">
                      {ingredient.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
        </div>
      )}
    </div>
  );
};

// Relationship Viewer Component
interface RelationshipViewerProps {
  relationshipInfo: any;
  onContinue: () => void;
  onBack: () => void;
}

const RelationshipViewer: React.FC<RelationshipViewerProps> = ({
  relationshipInfo,
  onContinue,
  onBack
}) => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Ingredient Relationship
        </h2>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="p-6 bg-slate-800 border border-slate-700 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">Your Selection</h3>
          <div className="space-y-2 text-gray-300">
            <p><span className="font-medium">Base Spirit:</span> Selected</p>
            <p><span className="font-medium">Flavor Family:</span> Selected</p>
            <p><span className="font-medium">Specific Flavor:</span> Selected</p>
          </div>
        </div>

        {relationshipInfo && (
          <div className="p-6 bg-green-900/30 border border-green-500/30 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-green-300 mb-2">Perfect Match!</h3>
            <p className="text-green-200">{relationshipInfo.reason}</p>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors font-medium"
          >
            Generate Cocktail DNA →
          </button>
        </div>
      </div>
    </div>
  );
};

// DNA Profile Viewer Component
interface DNAProfileViewerProps {
  dnaProfile: any;
  onGenerateCocktails: () => void;
  onBack: () => void;
  onReset: () => void;
}

const DNAProfileViewer: React.FC<DNAProfileViewerProps> = ({
  dnaProfile,
  onGenerateCocktails,
  onBack,
  onReset
}) => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Your Cocktail DNA
        </h2>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="p-6 bg-slate-800 border border-slate-700 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">Flavor DNA Profile</h3>
          <div className="space-y-4">
            {Object.entries(dnaProfile).map(([trait, value]) => (
              <div key={trait} className="flex items-center gap-4">
                <span className="text-gray-300 w-24 capitalize text-right">{trait}:</span>
                <div className="flex-1 bg-slate-700 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(value as number) * 10}%` }}
                  ></div>
                </div>
                <span className="text-white font-medium w-8">{(value as number)}/10</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-purple-900/30 border border-purple-500/30 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-purple-300 mb-2">Ready to Create Magic?</h3>
          <p className="text-purple-200">
            Based on your selections, we'll generate personalized cocktail recipes 
            that perfectly match your flavor DNA profile.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onReset}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Start Over
          </button>
          <button
            onClick={onGenerateCocktails}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors font-medium"
          >
            Generate My Cocktails 🍸
          </button>
        </div>
      </div>
    </div>
  );
};
