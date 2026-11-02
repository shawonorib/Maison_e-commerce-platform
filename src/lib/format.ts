export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getStockStatus(stock: number): {
  label: string;
  color: string;
  badge: string;
} {
  if (stock === 0) return { label: 'Out of stock', color: 'text-error-600', badge: 'bg-error-100 text-error-600' };
  if (stock <= 10) return { label: `Only ${stock} left`, color: 'text-warning-600', badge: 'bg-warning-100 text-warning-600' };
  return { label: 'In stock', color: 'text-success-600', badge: 'bg-success-100 text-success-600' };
}

export function getDiscountPercent(price: number, compareAt: number | null): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
