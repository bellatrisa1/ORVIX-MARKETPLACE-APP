export const CURRENCY = 'USD' as const;
export function toCents(value: number) {
  return Math.round(value * 100);
}
export function formatMoney(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 2,
  }).format(value);
}
