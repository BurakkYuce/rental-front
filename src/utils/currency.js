// src/utils/currency.js - Currency conversion and formatting utilities

/**
 * Currency configuration and utilities
 */
export const CURRENCIES = {
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    decimals: 2,
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    decimals: 2,
  },
  TRY: {
    code: 'TRY',
    name: 'Turkish Lira', 
    symbol: '₺',
    decimals: 0,
  },
};

/**
 * Get currency symbol by currency code
 * @param {string} currencyCode - Currency code (EUR, USD, TRY)
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currencyCode) => {
  return CURRENCIES[currencyCode]?.symbol || currencyCode;
};

/**
 * Get currency configuration by code
 * @param {string} currencyCode - Currency code
 * @returns {object} Currency configuration
 */
export const getCurrencyConfig = (currencyCode) => {
  return CURRENCIES[currencyCode] || CURRENCIES.EUR;
};

/**
 * Get all available currencies as array
 * @returns {array} Array of currency objects
 */
export const getAllCurrencies = () => {
  return Object.values(CURRENCIES);
};

/**
 * Convert currency amount using exchange rates
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @param {object} exchangeRates - Exchange rates object
 * @returns {number} Converted amount
 */
export const convertCurrency = (amount, fromCurrency, toCurrency, exchangeRates) => {
  if (!amount || amount <= 0) {
    return 0;
  }
  
  if (!exchangeRates || !exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
    console.warn('Exchange rates not available, returning original amount');
    return amount;
  }
  
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  // Convert to EUR first (base currency), then to target currency
  let amountInEUR;
  if (fromCurrency === 'EUR') {
    amountInEUR = amount;
  } else {
    amountInEUR = amount / exchangeRates[fromCurrency];
  }
  
  // Convert from EUR to target currency
  const convertedAmount = amountInEUR * exchangeRates[toCurrency];
  
  // Round to appropriate decimal places
  const decimals = getCurrencyConfig(toCurrency).decimals;
  return Math.round(convertedAmount * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Format price with currency symbol and proper formatting
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Currency code
 * @param {object} options - Formatting options
 * @returns {string} Formatted price string
 */
export const formatPrice = (amount, currencyCode = 'EUR', options = {}) => {
  const {
    showSymbol = true,
    showCode = false,
    locale = 'en-US',
  } = options;
  
  const currencyConfig = getCurrencyConfig(currencyCode);
  const symbol = currencyConfig.symbol;
  
  // Format number with appropriate decimals
  const formattedAmount = new Intl.NumberFormat(locale, {
    minimumFractionDigits: currencyConfig.decimals,
    maximumFractionDigits: currencyConfig.decimals,
  }).format(amount);
  
  let result = formattedAmount;
  
  if (showSymbol) {
    result = `${symbol}${formattedAmount}`;
  }
  
  if (showCode) {
    result = showSymbol ? `${result} ${currencyCode}` : `${formattedAmount} ${currencyCode}`;
  }
  
  return result;
};

/**
 * Convert and format pricing object (daily, weekly, monthly)
 * @param {object} pricing - Pricing object with daily, weekly, monthly properties
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @param {object} exchangeRates - Exchange rates
 * @returns {object} Converted pricing object with formatted strings
 */
export const convertAndFormatPricing = (pricing, fromCurrency, toCurrency, exchangeRates) => {
  if (!pricing) {
    return {
      daily: 0,
      weekly: 0,
      monthly: 0,
      formatted: {
        daily: formatPrice(0, toCurrency),
        weekly: formatPrice(0, toCurrency),
        monthly: formatPrice(0, toCurrency),
      },
    };
  }
  
  const convertedPricing = {
    daily: convertCurrency(pricing.daily || 0, fromCurrency, toCurrency, exchangeRates),
    weekly: convertCurrency(pricing.weekly || 0, fromCurrency, toCurrency, exchangeRates),
    monthly: convertCurrency(pricing.monthly || 0, fromCurrency, toCurrency, exchangeRates),
  };
  
  return {
    ...convertedPricing,
    formatted: {
      daily: formatPrice(convertedPricing.daily, toCurrency),
      weekly: formatPrice(convertedPricing.weekly, toCurrency),
      monthly: formatPrice(convertedPricing.monthly, toCurrency),
    },
  };
};

/**
 * Get exchange rate between two currencies
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @param {object} exchangeRates - Exchange rates object
 * @returns {number} Exchange rate
 */
export const getExchangeRate = (fromCurrency, toCurrency, exchangeRates) => {
  if (fromCurrency === toCurrency) {
    return 1;
  }
  
  if (!exchangeRates || !exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
    return 1;
  }
  
  return exchangeRates[toCurrency] / exchangeRates[fromCurrency];
};

/**
 * Validate currency code
 * @param {string} currencyCode - Currency code to validate
 * @returns {boolean} True if valid currency code
 */
export const isValidCurrency = (currencyCode) => {
  return Object.keys(CURRENCIES).includes(currencyCode);
};

/**
 * Get user's preferred currency from localStorage or default
 * @returns {string} Currency code
 */
export const getUserPreferredCurrency = () => {
  try {
    const stored = localStorage.getItem('preferredCurrency');
    if (stored && isValidCurrency(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn('Error reading preferred currency from localStorage:', error);
  }
  return 'EUR'; // Default to EUR
};

/**
 * Save user's preferred currency to localStorage
 * @param {string} currencyCode - Currency code to save
 */
export const setUserPreferredCurrency = (currencyCode) => {
  if (!isValidCurrency(currencyCode)) {
    console.warn('Invalid currency code:', currencyCode);
    return;
  }
  
  try {
    localStorage.setItem('preferredCurrency', currencyCode);
  } catch (error) {
    console.warn('Error saving preferred currency to localStorage:', error);
  }
};

/**
 * Format exchange rate for display
 * @param {string} baseCurrency - Base currency code
 * @param {string} targetCurrency - Target currency code
 * @param {number} rate - Exchange rate
 * @returns {string} Formatted exchange rate string
 */
export const formatExchangeRate = (baseCurrency, targetCurrency, rate) => {
  const baseSymbol = getCurrencySymbol(baseCurrency);
  const targetSymbol = getCurrencySymbol(targetCurrency);
  const formattedRate = formatPrice(rate, targetCurrency, { showSymbol: false });
  
  return `1 ${baseSymbol} = ${targetSymbol}${formattedRate}`;
};