import React,{useEffect} from 'react'
import NavBar from './NavBar'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for pending payment when home page loads
    const pendingPayment = JSON.parse(localStorage.getItem('pendingPayment'));
    if (pendingPayment) {
      navigate('/payment', { state: { txnid: pendingPayment.txnid } });
    }
  }, [navigate]);
  
  return (
    <div className='h-screen'>
     <NavBar/>
    </div>
  )
}

export default Home