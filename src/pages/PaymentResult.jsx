import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PaymentResult = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const isSuccess = location.pathname === '/payment-success';

    useEffect(() => {
        if (isSuccess) {
            // Signal parent window that payment was successful
            window.parent.postMessage('PAYTR_SUCCESS', '*');
        } else {
            // Signal parent window that payment failed
            window.parent.postMessage('PAYTR_FAIL', '*');
        }
    }, [isSuccess]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontFamily: 'Inter, sans-serif',
            textAlign: 'center',
            padding: '20px'
        }}>
            {isSuccess ? (
                <>
                    <h2 style={{ color: '#ff6b35', fontSize: '24px', marginBottom: '10px' }}>{t('paymentResult.successTitle')}</h2>
                    <p style={{ color: '#666' }}>{t('paymentResult.successMessage')}</p>
                </>
            ) : (
                <>
                    <h2 style={{ color: '#EF4444', fontSize: '24px', marginBottom: '10px' }}>{t('paymentResult.failedTitle')}</h2>
                    <p style={{ color: '#666' }}>{t('paymentResult.failedMessage')}</p>
                </>
            )}
        </div>
    );
};

export default PaymentResult;
