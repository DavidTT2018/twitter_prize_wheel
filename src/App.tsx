import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import LandingPage from './pages/LandingPage';
import AgeVerificationPage from './pages/AgeVerificationPage';
import TwitterFollowPage from './pages/TwitterFollowPage';
import WheelSpinPage from './pages/WheelSpinPage';
import PrizeAwardedPage from './pages/PrizeAwardedPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { state } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white font-sans">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/verify-age" element={<AgeVerificationPage />} />
        <Route 
          path="/twitter-follow" 
          element={
            <ProtectedRoute condition={state.isAgeVerified}>
              <TwitterFollowPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/wheel-spin" 
          element={
            <ProtectedRoute condition={state.isTwitterFollowed}>
              <WheelSpinPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/prize" 
          element={
            <ProtectedRoute condition={state.isPrizeAwarded}>
              <PrizeAwardedPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  );
}

export default App;