import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import PageContainer from '../components/PageContainer';

const NotFoundPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl text-center">
        <h1 className="text-6xl font-bold mb-6 text-white">404</h1>
        <p className="text-xl mb-8">Oops! The page you're looking for doesn't exist.</p>
        
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-all transform hover:scale-105">
          <Home size={20} />
          <span>Back to Home</span>
        </Link>
      </div>
    </PageContainer>
  );
};

export default NotFoundPage;