export function formatPercent(
  value: number,
  digits = 2,
): string {
  return `${(value * 100).toFixed(digits)}%`
}

export function formatMoney(
  value: number,
): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  })
}

export function formatNumber(
  value: number,
  digits = 2,
): string {
  return value.toFixed(digits)
}
