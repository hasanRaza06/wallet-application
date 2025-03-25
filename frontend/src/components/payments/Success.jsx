// SuccessPage.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state?.txnid) {
      navigate('/');
      return;
    }

    const timer = setTimeout(() => {
      navigate('/');
    }, 5000); // Redirect to home after 5 seconds

    return () => clearTimeout(timer);
  }, [navigate, location.state]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p className="text-lg mb-2">Transaction ID: {location.state?.txnid}</p>
      <p className="text-lg mb-6">Amount: ₹{location.state?.amount}</p>
      <p className="text-gray-600">You will be redirected to home page shortly...</p>
    </div>
  );
};

export default Success;