import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SlotMachine = () => {
  const navigate = useNavigate();

  // Simplified state for debugging
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple loading test
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-2xl">Loading Slot Machine...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Secret Shuffle</h1>
        <p className="text-xl mb-8">Slot Machine Coming Soon!</p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
          >
            Back to Menu
          </button>
          <button
            onClick={() => navigate('/quiz')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
          >
            Take Quiz Instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;