import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../styles/PaymentForm.css'; // We will create this css file as well

const PaymentForm = ({ amount, currency, reservationDetails, onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            // 1. Create PaymentIntent on the backend
            const response = await fetch('http://localhost:5001/api/payments/create-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount, // Amount in main currency (e.g., 100 for 100 EUR)
                    currency: currency,
                    reservationReference: reservationDetails?.tempId || 'unknown'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to initialize payment');
            }

            const { clientSecret } = await response.json();

            let paymentResult;

            // Check for mock secret
            if (clientSecret && clientSecret.includes('mock_secret')) {
                console.log('⚠️ using Mock Payment (Frontend)');
                // Simulate delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                paymentResult = {
                    paymentIntent: {
                        status: 'succeeded',
                        id: clientSecret.replace('_secret', '')
                    }
                };
            } else {
                // 2. Confirm Card Payment
                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardElement),
                        billing_details: {
                            name: reservationDetails?.firstName + ' ' + reservationDetails?.lastName,
                            email: reservationDetails?.email,
                        },
                    },
                });
                paymentResult = result;
            }

            if (paymentResult.error) {
                setError(paymentResult.error.message);
                onError && onError(paymentResult.error);
            } else {
                if (paymentResult.paymentIntent.status === 'succeeded') {
                    onSuccess && onSuccess(paymentResult.paymentIntent);
                }
            }
        } catch (err) {
            setError(err.message || 'An error occurred during payment');
            onError && onError(err);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <h3>Payment Details</h3>
            <div className="payment-info">
                <p>Commission to pay now: <strong>{currency?.toUpperCase()} {amount?.toFixed(2)}</strong></p>
            </div>

            <div className="card-element-container">
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }} />
            </div>

            {error && <div className="payment-error">{error}</div>}

            <button type="submit" disabled={!stripe || processing} className="pay-button">
                {processing ? 'Processing...' : `Pay ${currency?.toUpperCase()} ${amount?.toFixed(2)}`}
            </button>
        </form>
    );
};

export default PaymentForm;
