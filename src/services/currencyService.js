// Currency conversion service using exchangerate-api.com (free tier)
// Base currency is EUR (EURO)

const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/EUR'

// Cache for exchange rates (valid for 1 hour)
let exchangeRatesCache = null
let cacheTimestamp = null
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

// Get exchange rates from API or cache
export const getExchangeRates = async () => {
  const now = Date.now()
  
  // Return cached rates if still valid
  if (exchangeRatesCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return exchangeRatesCache
  }

  try {
    const response = await fetch(EXCHANGE_RATE_API)
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates')
    }
    const data = await response.json()
    
    // Cache the rates
    exchangeRatesCache = data.rates
    cacheTimestamp = now
    
    return data.rates
  } catch (error) {
    console.error('Error fetching exchange rates:', error)
    
    // Return fallback rates if API fails
    return {
      EUR: 1,
      USD: 1.08, // Approximate fallback
      GBP: 0.85, // Approximate fallback
    }
  }
}

// Convert amount from EUR to target currency
export const convertCurrency = async (amount, targetCurrency) => {
  if (!amount || amount === 0) return 0
  
  // If target is EUR, no conversion needed
  if (targetCurrency === 'EURO' || targetCurrency === 'EUR') {
    return amount
  }

  try {
    const rates = await getExchangeRates()
    
    // Map currency codes
    const currencyMap = {
      'USD': 'USD',
      'GBP': 'GBP',
      'EURO': 'EUR',
      'EUR': 'EUR'
    }
    
    const targetCode = currencyMap[targetCurrency] || 'EUR'
    const rate = rates[targetCode] || 1
    
    return amount * rate
  } catch (error) {
    console.error('Error converting currency:', error)
    return amount // Return original amount if conversion fails
  }
}

// Get exchange rate for a specific currency
export const getExchangeRate = async (targetCurrency) => {
  if (targetCurrency === 'EURO' || targetCurrency === 'EUR') {
    return 1
  }

  try {
    const rates = await getExchangeRates()
    
    const currencyMap = {
      'USD': 'USD',
      'GBP': 'GBP',
      'EURO': 'EUR',
      'EUR': 'EUR'
    }
    
    const targetCode = currencyMap[targetCurrency] || 'EUR'
    return rates[targetCode] || 1
  } catch (error) {
    console.error('Error getting exchange rate:', error)
    return 1
  }
}
