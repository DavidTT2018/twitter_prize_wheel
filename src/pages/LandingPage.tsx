import { useNavigate } from 'react-router-dom';
import { Gift } from 'lucide-react';
import PageContainer from '../components/PageContainer';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Welcome to Our Promotion!
        </h1>
        
        <div className="my-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-xl p-4">
            <Gift className="w-full h-full text-white" />
          </div>
          
          <h2 className="text-2xl font-bold mb-4 text-white">
            Win Amazing Prizes!
          </h2>
          
          <p className="text-lg mb-8 text-gray-200">
            Follow us on Twitter and spin the wheel for a chance to win exciting prizes!
          </p>
        </div>
        
        <button
          onClick={() => navigate('/verify-age')}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 w-full sm:w-auto"
        >
          Get Started
        </button>
        
        <p className="mt-6 text-sm text-gray-400">
          Limited time offer
        </p>
      </div>
    </PageContainer>
  );
};

export default LandingPage;