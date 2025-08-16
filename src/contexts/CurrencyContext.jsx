// src/contexts/CurrencyContext.jsx - Currency Context for global state management
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { publicAPI } from "../services/api";

// Create Currency Context
const CurrencyContext = createContext();

// Currency configuration
const CURRENCY_CONFIG = {
  EUR: { code: "EUR", name: "Euro", symbol: "€", decimals: 2 },
  USD: { code: "USD", name: "US Dollar", symbol: "$", decimals: 2 },
  TRY: { code: "TRY", name: "Turkish Lira", symbol: "₺", decimals: 0 },
};

// Emergency fallback rates - only used if backend is completely offline
const DEFAULT_RATES = {
  EUR: 1,        // Base currency
  USD: 1.14,     // 1 EUR = 1.14 USD (current rate July 2025)
  TRY: 37.5,     // 1 EUR = 37.5 TRY (approximate current rate)
};

/**
 * Currency Provider Component
 */
export const CurrencyProvider = ({ children }) => {
  // State
  const [currentCurrency, setCurrentCurrency] = useState(() => {
    // Get from localStorage or default to EUR
    try {
      return localStorage.getItem("preferredCurrency") || "EUR";
    } catch {
      return "EUR";
    }
  });

  const [exchangeRates, setExchangeRates] = useState(DEFAULT_RATES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  /**
   * Fetch exchange rates from API
   */
  const fetchExchangeRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from backend API
      const response = await publicAPI.getCurrentExchangeRates();

      if (response?.data?.success && response.data.data) {
        const backendData = response.data.data;
        // Extract rates from the response
        const rates = backendData.rates || backendData;
        console.log("📊 Backend rates:", rates);

        // Backend sends EUR-based rates (EUR: 1, TRY: X, USD: Y)
        if (rates && rates.EUR === 1) {
          console.log("✅ Using EUR-based rates from backend");
          setExchangeRates(rates);
        } else {
          console.warn("Invalid rate format, using default rates");
          setExchangeRates(DEFAULT_RATES);
        }
        
        setLastUpdated(lastUpdated || new Date().toISOString());
      } else {
        // Use default rates if API response is invalid
        console.warn("Invalid API response, using default rates");
        setExchangeRates(DEFAULT_RATES);
      }
    } catch (err) {
      console.warn(
        "Failed to fetch exchange rates, using defaults:",
        err.message
      );
      setError(err.message);
      // Keep using default rates - don't fail
      setExchangeRates(DEFAULT_RATES);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Change current currency
   */
  const changeCurrency = useCallback((newCurrency) => {
    if (!CURRENCY_CONFIG[newCurrency]) {
      console.warn("Invalid currency:", newCurrency);
      return;
    }

    setCurrentCurrency(newCurrency);

    // Save to localStorage
    try {
      localStorage.setItem("preferredCurrency", newCurrency);
    } catch (err) {
      console.warn("Failed to save currency preference:", err);
    }
  }, []);

  /**
   * Convert amount between currencies
   */
  const convertAmount = useCallback(
    (amount, fromCurrency = "EUR", toCurrency = null) => {
      const targetCurrency = toCurrency || currentCurrency;

      if (!amount || amount <= 0) return 0;
      if (fromCurrency === targetCurrency) return amount;

      const fromRate = exchangeRates[fromCurrency] || 1;
      const toRate = exchangeRates[targetCurrency] || 1;

      // Convert through EUR base (EUR = 1)
      const eurAmount = fromCurrency === "EUR" ? amount : amount / fromRate;
      const convertedAmount =
        targetCurrency === "EUR" ? eurAmount : eurAmount * toRate;

      // Round based on currency decimals
      const decimals = CURRENCY_CONFIG[targetCurrency]?.decimals || 2;
      return (
        Math.round(convertedAmount * Math.pow(10, decimals)) /
        Math.pow(10, decimals)
      );
    },
    [currentCurrency, exchangeRates]
  );

  /**
   * Format amount with currency symbol
   */
  const formatPrice = useCallback(
    (amount, currency = null) => {
      const useCurrency = currency || currentCurrency;
      const config = CURRENCY_CONFIG[useCurrency] || CURRENCY_CONFIG.EUR;

      const formattedAmount = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: config.decimals,
        maximumFractionDigits: config.decimals,
      }).format(amount);

      return `${config.symbol}${formattedAmount}`;
    },
    [currentCurrency]
  );

  /**
   * Convert and format a price (common use case)
   */
  const convertAndFormatPrice = useCallback(
    (amount, fromCurrency = "EUR", toCurrency = null) => {
      const converted = convertAmount(amount, fromCurrency, toCurrency);
      return formatPrice(converted, toCurrency);
    },
    [convertAmount, formatPrice]
  );

  /**
   * Get all available currencies
   */
  const getSupportedCurrencies = useCallback(() => {
    return Object.values(CURRENCY_CONFIG);
  }, []);

  /**
   * Get current currency info
   */
  const getCurrentCurrencyInfo = useCallback(() => {
    return CURRENCY_CONFIG[currentCurrency] || CURRENCY_CONFIG.EUR;
  }, [currentCurrency]);

  // Load exchange rates on mount and refresh every 30 seconds to pick up backend changes
  useEffect(() => {
    fetchExchangeRates();

    // Refresh rates every 30 seconds to pick up any backend changes
    const interval = setInterval(() => {
      console.log("🔄 Refreshing exchange rates...");
      fetchExchangeRates();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchExchangeRates]);

  // Validate current currency
  useEffect(() => {
    if (!CURRENCY_CONFIG[currentCurrency]) {
      console.warn("Invalid current currency, resetting to EUR");
      changeCurrency("EUR");
    }
  }, [currentCurrency, changeCurrency]);

  // Context value
  const value = {
    // State
    currentCurrency,
    exchangeRates,
    loading,
    error,
    lastUpdated,

    // Actions
    changeCurrency,
    fetchExchangeRates, // Now public so you can call it from browser console

    // Utilities
    convertAmount,
    formatPrice,
    convertAndFormatPrice,
    getSupportedCurrencies,
    getCurrentCurrencyInfo,

    // Helper properties
    isLoaded: !loading,
    hasError: !!error,
  };

  // Expose refresh function globally for debugging
  React.useEffect(() => {
    window.refreshExchangeRates = fetchExchangeRates;
    return () => {
      delete window.refreshExchangeRates;
    };
  }, [fetchExchangeRates]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

/**
 * Hook to use currency context
 */
export const useCurrency = () => {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }

  return context;
};

export default CurrencyContext;
