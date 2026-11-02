import { ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';

type FeaturedSectionProps = {
  products: Product[];
  onQuickAdd: (product: Product) => void;
  onView: (slug: string) => void;
  onSeeAll: () => void;
};

export function FeaturedSection({ products, onQuickAdd, onView, onSeeAll }: FeaturedSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-600">Featured</span>
          <h2 className="mt-1 font-serif text-3xl tracking-tight text-ink-900">Editor's picks</h2>
          <p className="mt-1.5 text-sm text-ink-500">Hand-selected products we think you'll love</p>
        </div>
        <button
          onClick={onSeeAll}
          className="group hidden items-center gap-1.5 text-sm font-semibold text-ink-700 transition-colors hover:text-ink-950 sm:flex"
        >
          View all
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.slice(0, 5).map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickAdd={onQuickAdd}
            onView={onView}
            index={i}
          />
        ))}
      </div>
      <button
        onClick={onSeeAll}
        className="group mt-8 flex items-center gap-1.5 text-sm font-semibold text-ink-700 transition-colors hover:text-ink-950 sm:hidden"
      >
        View all products
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </section>
  );
}
