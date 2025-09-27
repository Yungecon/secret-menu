import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';

const Results = () => {
  const navigate = useNavigate();
  const { resetQuiz } = useQuiz();

  // Placeholder cocktail - will be replaced with actual recommendation engine
  const mockCocktail = {
    name: "Velvet Whisper",
    ingredients: ["Premium Vodka", "Elderflower Liqueur", "Fresh Lime", "Champagne"],
    description: "A sophisticated blend that speaks to your refined palate",
    garnish: "Edible gold flake"
  };

  const handleTryAnother = () => {
    resetQuiz();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center animate-fade-in">
        {/* Magical reveal message */}
        <div className="mb-8">
          <p className="text-magical-glow text-lg mb-2">Your impeccable taste has led us to...</p>
          <h1 className="font-elegant text-5xl md:text-6xl font-bold text-premium-gold mb-4">
            {mockCocktail.name}
          </h1>
          <div className="w-32 h-0.5 bg-gradient-to-r from-magical-shimmer to-magical-glow mx-auto"></div>
        </div>

        {/* Cocktail details */}
        <div className="magical-card p-8 mb-8">
          <p className="text-premium-silver text-lg mb-6 leading-relaxed">
            {mockCocktail.description}
          </p>
          
          <div className="mb-6">
            <h3 className="text-premium-platinum font-semibold text-xl mb-4">Ingredients</h3>
            <ul className="space-y-2">
              {mockCocktail.ingredients.map((ingredient, index) => (
                <li key={index} className="text-premium-silver">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-sm text-premium-silver/70">
            Garnished with {mockCocktail.garnish}
          </div>
        </div>

        {/* Try another button */}
        <button
          onClick={handleTryAnother}
          className="premium-button text-lg px-10 py-4"
        >
          Discover Another Masterpiece
        </button>

        <p className="text-premium-silver/60 mt-6 text-sm">
          How wonderfully sophisticated of you to explore further...
        </p>
      </div>
    </div>
  );
};

export default Results;