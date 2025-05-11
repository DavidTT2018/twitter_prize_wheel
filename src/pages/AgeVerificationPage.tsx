import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { AlertTriangle } from 'lucide-react';
import PageContainer from '../components/PageContainer';

const AgeVerificationPage: React.FC = () => {
  const { dispatch } = useUser();
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);

  const handleYesClick = () => {
    dispatch({ type: 'VERIFY_AGE' });
    // dispatch({ type: 'SET_TWITTER_USERNAME', payload: cleanUsername });
    navigate('/twitter-follow');
  };

  const handleNoClick = () => {
    setShowError(true);
    // Redirect to landing page after a short delay
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <PageContainer>
      <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl text-center">
        <h1 className="text-4xl font-bold mb-8 text-white">
          Before You Continue
        </h1>
        
        <div className="mb-8">
          <p className="text-xl mb-4">Are you 21 years or older?</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={handleYesClick}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Yes, I am
            </button>
            
            <button
              onClick={handleNoClick}
              className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              No, I'm not
            </button>
          </div>
        </div>
        
        {showError && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-3 animate-fade-in">
            <AlertTriangle size={24} className="text-red-400" />
            <p>Sorry, you must be 21 or older to continue. Redirecting...</p>
          </div>
        )}
        
        <p className="text-sm mt-8 text-gray-300">
          By continuing, you confirm that you meet the age requirements to access this content.
        </p>
      </div>
    </PageContainer>
  );
};

export default AgeVerificationPage;