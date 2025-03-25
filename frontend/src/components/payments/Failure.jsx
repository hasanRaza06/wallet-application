// FailurePage.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Failure = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000); // Redirect to home after 5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed!</h1>
      <p className="text-lg mb-6">{location.state?.error || 'Unknown error occurred'}</p>
      <p className="text-gray-600">You will be redirected to home page shortly...</p>
    </div>
  );
};

export default Failure;