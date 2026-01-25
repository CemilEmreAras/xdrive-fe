import { createContext, useState, useContext, useEffect } from 'react'
import { convertCurrency, getExchangeRate } from '../services/currencyService'

const CurrencyContext = createContext()

export function CurrencyProvider({ children }) {
    // Varsayılan para birimi EURO, açılışta localStorage'dan okunur
    const [currency, setCurrency] = useState(() => {
        const savedCurrency = localStorage.getItem('xdrive_currency')
        return savedCurrency || 'EURO'
    })
    
    const [exchangeRate, setExchangeRate] = useState(1)
    const [isLoadingRate, setIsLoadingRate] = useState(false)

    // Exchange rate'i yükle
    useEffect(() => {
        const loadExchangeRate = async () => {
            if (currency === 'EURO' || currency === 'EUR') {
                setExchangeRate(1)
                return
            }
            
            setIsLoadingRate(true)
            try {
                const rate = await getExchangeRate(currency)
                setExchangeRate(rate)
            } catch (error) {
                console.error('Error loading exchange rate:', error)
                setExchangeRate(1)
            } finally {
                setIsLoadingRate(false)
            }
        }
        
        loadExchangeRate()
    }, [currency])

    // Para birimi değiştiğinde localStorage'a kaydet
    const changeCurrency = (newCurrency) => {
        setCurrency(newCurrency)
        localStorage.setItem('xdrive_currency', newCurrency)
    }

    // Para birimi sembolünü al
    const getCurrencySymbol = () => {
        switch (currency) {
            case 'USD':
                return '$'
            case 'GBP':
                return '£'
            case 'EURO':
            default:
                return '€'
        }
    }

    // Fiyatı dönüştür (EUR'dan seçilen para birimine)
    const convertPrice = async (amountInEUR) => {
        if (!amountInEUR || amountInEUR === 0) return 0
        if (currency === 'EURO' || currency === 'EUR') return amountInEUR
        
        try {
            return await convertCurrency(amountInEUR, currency)
        } catch (error) {
            console.error('Error converting price:', error)
            return amountInEUR
        }
    }

    // Fiyatı dönüştür (synchronous, exchange rate kullanarak)
    const convertPriceSync = (amountInEUR) => {
        if (!amountInEUR || amountInEUR === 0) return 0
        if (currency === 'EURO' || currency === 'EUR') return amountInEUR
        return amountInEUR * exchangeRate
    }

    const value = {
        currency,
        changeCurrency,
        getCurrencySymbol,
        convertPrice,
        convertPriceSync,
        exchangeRate,
        isLoadingRate
    }

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    )
}

export function useCurrency() {
    const context = useContext(CurrencyContext)
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider')
    }
    return context
}
