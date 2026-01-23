import React, { useEffect, useState } from 'react';

const PayTRPayment = ({ user, amount, currency, reservationReference, onSuccess, onFail }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const apiUrl = import.meta.env.PROD
                    ? 'https://xdrive-be.vercel.app/api'
                    : '/api';

                const response = await fetch(`${apiUrl}/payments/paytr-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user,
                        amount,
                        currency,
                        reservationReference: reservationReference || `RES-${Date.now()}`
                    })
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || 'Failed to get PayTR token');
                }

                const data = await response.json();

                if (data.token) {
                    setToken(data.token);
                } else {
                    throw new Error('No token received from backend');
                }
            } catch (err) {
                console.error('PayTR Token Error:', err);
                setError(err.message);
                if (onFail) onFail(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user && amount) {
            fetchToken();
        }
    }, [user, amount, currency, reservationReference]);

    useEffect(() => {
        // PayTR iframe resizing script
        if (token) {
            const script = document.createElement("script");
            script.src = "https://www.paytr.com/js/iframeResizer.min.js";
            script.onload = () => {
                // Usually iFrameResizer is available globally or we just use the native one provided
                // PayTR example usually looks like:
                // iFrameResize({}, '#paytriframe');
                if (window.iFrameResize) {
                    window.iFrameResize({}, '#paytriframe');
                }
            };
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, [token]);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data === 'PAYTR_SUCCESS') {
                if (onSuccess) onSuccess();
            } else if (event.data === 'PAYTR_FAIL') {
                if (onFail) onFail('Payment failed');
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onSuccess, onFail]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <div className="text-gray-600">Loading secure payment...</div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <svg className="w-12 h-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-bold text-red-600 mb-2">Payment Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            {error.includes('credentials') && (
                <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800 border border-yellow-200">
                    <p><strong>Configuration Missing:</strong> Please add your PayTR Merchant credentials to the <code>backend/.env</code> file.</p>
                </div>
            )}
            <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 transition-colors"
                style={{ cursor: 'pointer' }}
            >
                Retry
            </button>
        </div>
    );

    return (
        <div className="paytr-container" style={{ width: '100%', minHeight: '600px' }}>
            {token && (
                <iframe
                    src={`https://www.paytr.com/odeme/guvenli/${token}`}
                    id="paytriframe"
                    style={{ width: '100%', border: 'none', minHeight: '600px' }}
                    scrolling="no"
                ></iframe>
            )}
        </div>
    );
};

export default PayTRPayment;
