import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import PageContainer from '../components/PageContainer';
import SpinningWheel from '../components/SpinningWheel';
import { supabase } from '../services/supabase';

const PRIZES = [
  '10% OFF', 
  '25% OFF', 
  '50% OFF', 
  'FREE TRIAL', 
  'MERCH', 
  '$10 GIFT CARD', 
  '$25 GIFT CARD', 
  'GRAND PRIZE'
];

const WheelSpinPage: React.FC = () => {
  const { state, dispatch } = useUser();
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<string | null>(null);

  const handleSpin = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    try {
      // Mark session as used
      if (state.sessionId) {
        const { error } = await supabase
          .from('wheel_sessions')
          .update({ 
            is_used: true,
            accessed_at: new Date().toISOString()
          })
          .eq('session_id', state.sessionId);

        if (error) throw error;
      }
      
      // Pick a random prize
      const randomIndex = Math.floor(Math.random() * PRIZES.length);
      const prize = PRIZES[randomIndex];
      
      // After spinning animation completes (5 seconds)
      setTimeout(() => {
        setSelectedPrize(prize);
        setIsSpinning(false);
        
        // Update context and navigate after showing the prize for a moment
        setTimeout(() => {
          dispatch({ type: 'SPIN_WHEEL' });
          dispatch({ type: 'AWARD_PRIZE', payload: prize });
          navigate('/prize');
        }, 2000);
      }, 5000);
    } catch (err) {
      console.error('Error updating session:', err);
      setIsSpinning(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 text-white">
          Spin to Win!
        </h1>
        
        <p className="text-xl mb-8">
          Thanks for following us! Now spin the wheel for your chance to win.
        </p>
        
        <div className="mt-4 mb-8">
          <SpinningWheel 
            prizes={PRIZES} 
            isSpinning={isSpinning} 
            selectedPrize={selectedPrize} 
          />
        </div>
        
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className={`px-12 py-4 rounded-full font-bold text-xl transition-all transform hover:scale-105
            ${isSpinning 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg'}`}
        >
          {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL'}
        </button>
        
        {selectedPrize && (
          <div className="mt-8 animate-bounce">
            <p className="text-2xl font-bold">
              Congratulations! You won: <span className="text-yellow-300">{selectedPrize}</span>!
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default WheelSpinPage;