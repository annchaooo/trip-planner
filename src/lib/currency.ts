// Exchange rates relative to USD (approximate rates - can be updated)
// In production, you'd fetch these from an API like exchangerate-api.com
const EXCHANGE_RATES_TO_USD: Record<string, number> = {
  USD: 1,
  TWD: 0.031,    // 1 TWD = 0.031 USD (roughly 32 TWD = 1 USD)
  EUR: 1.08,     // 1 EUR = 1.08 USD
  GBP: 1.27,     // 1 GBP = 1.27 USD
  JPY: 0.0067,   // 1 JPY = 0.0067 USD (roughly 150 JPY = 1 USD)
  CNY: 0.14,     // 1 CNY = 0.14 USD
  KRW: 0.00075,  // 1 KRW = 0.00075 USD (roughly 1300 KRW = 1 USD)
  THB: 0.028,    // 1 THB = 0.028 USD
  AUD: 0.65,     // 1 AUD = 0.65 USD
  CAD: 0.74,     // 1 CAD = 0.74 USD
}

export const CURRENCY_INFO: Record<string, { symbol: string; name: string }> = {
  USD: { symbol: '$', name: 'US Dollar' },
  TWD: { symbol: 'NT$', name: 'New Taiwan Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  CNY: { symbol: '¥', name: 'Chinese Yuan' },
  KRW: { symbol: '₩', name: 'Korean Won' },
  THB: { symbol: '฿', name: 'Thai Baht' },
  AUD: { symbol: 'A$', name: 'Australian Dollar' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar' },
}

/**
 * Convert an amount from one currency to another
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) return amount

  const fromRate = EXCHANGE_RATES_TO_USD[fromCurrency] || 1
  const toRate = EXCHANGE_RATES_TO_USD[toCurrency] || 1

  // Convert to USD first, then to target currency
  const amountInUSD = amount * fromRate
  const convertedAmount = amountInUSD / toRate

  return convertedAmount
}

/**
 * Format currency with symbol
 */
export function formatCurrency(
  amount: number,
  currency: string,
  options?: { showCode?: boolean; decimals?: number }
): string {
  const info = CURRENCY_INFO[currency] || { symbol: currency, name: currency }
  const decimals = options?.decimals ?? (currency === 'JPY' || currency === 'KRW' ? 0 : 2)

  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  if (options?.showCode) {
    return `${info.symbol}${formatted} ${currency}`
  }

  return `${info.symbol}${formatted}`
}

/**
 * Get exchange rate between two currencies
 */
export function getExchangeRate(fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return 1

  const fromRate = EXCHANGE_RATES_TO_USD[fromCurrency] || 1
  const toRate = EXCHANGE_RATES_TO_USD[toCurrency] || 1

  return fromRate / toRate
}

/**
 * Get all supported currencies
 */
export function getSupportedCurrencies(): string[] {
  return Object.keys(CURRENCY_INFO)
}
