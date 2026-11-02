import { Heart, Star } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice, getStockStatus, getDiscountPercent } from '@/lib/format';
import { Rating } from '@/components/Rating';

type ProductCardProps = {
  product: Product;
  onQuickAdd: (product: Product) => void;
  onView: (slug: string) => void;
  index?: number;
};

export function ProductCard({ product, onQuickAdd, onView, index = 0 }: ProductCardProps) {
  const discount = getDiscountPercent(product.price, product.compare_at_price);
  const stock = getStockStatus(product.stock);
  const outOfStock = product.stock === 0;

  return (
    <div
      className="group relative flex cursor-pointer flex-col animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
      onClick={() => onView(product.slug)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-ink-100 aspect-square">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${
            outOfStock ? 'opacity-60 grayscale' : ''
          }`}
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-accent-500 px-2.5 py-1 text-xs font-semibold text-white shadow-md shadow-accent-500/30">
              -{discount}%
            </span>
          )}
          {product.is_featured && !outOfStock && (
            <span className="rounded-full bg-ink-900/85 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Featured
            </span>
          )}
          {outOfStock && (
            <span className="rounded-full bg-ink-800 px-2.5 py-1 text-xs font-medium text-white">
              Sold out
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full glass border border-ink-200/50 text-ink-600 transition-all hover:scale-110 hover:text-error-500 opacity-0 group-hover:opacity-100"
        >
          <Heart className="h-4 w-4" />
        </button>

        {/* Quick add button — slides up on hover */}
        {!outOfStock && (
          <div className="absolute inset-x-3 bottom-3 translate-y-12 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd(product);
              }}
              className="w-full rounded-xl bg-ink-900 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ink-900/30 transition-all hover:bg-ink-800 active:scale-[0.98]"
            >
              Add to cart
            </button>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium leading-snug text-ink-800 transition-colors group-hover:text-ink-950">
            {product.name}
          </h3>
        </div>
        <Rating rating={product.rating} count={product.review_count} size="sm" />
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-base font-semibold text-ink-900">{formatPrice(product.price)}</span>
          {product.compare_at_price && (
            <span className="text-sm text-ink-400 line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>
        <span className={`text-xs font-medium ${stock.color}`}>
          {stock.label}
        </span>
      </div>
    </div>
  );
}
