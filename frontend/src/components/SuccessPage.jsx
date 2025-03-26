// SuccessPage.js
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(location.hash.split('?')[1]);
        const txnid = query.get('txnid');

        if (!txnid) {
            navigate('/payment/failure');
        }

        // Verify payment with backend
        const verifyPayment = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/payments/verify/${txnid}`);
                if (!response.data.verified) {
                    navigate('/payment/failure');
                }
            } catch (error) {
                navigate('/payment/failure');
            }
        };

        verifyPayment();
    }, [location, navigate]);

    return (
        <div>
            <h2>Payment Successful!</h2>
            <p>Transaction ID: {new URLSearchParams(location.hash.split('?')[1]).get('txnid')}</p>
        </div>
    );
};

export default SuccessPage;