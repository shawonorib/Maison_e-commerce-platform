import { useEffect, useState } from 'react';
import { SlidersHorizontal, Loader2 } from 'lucide-react';
import type { Category, Product } from '@/types';
import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

type ShopViewProps = {
  categories: Category[];
  initialCategory?: string | null;
  onQuickAdd: (product: Product) => void;
  onView: (slug: string) => void;
};

export function ShopView({ categories, initialCategory, onQuickAdd, onView }: ShopViewProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory ?? null);
  const [sort, setSort] = useState<SortOption>('featured');

  useEffect(() => {
    setActiveCategory(initialCategory ?? null);
  }, [initialCategory]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('*, categories(*)');

      if (activeCategory) {
        const cat = categories.find((c) => c.slug === activeCategory);
        if (cat) query = query.eq('category_id', cat.id);
      }

      switch (sort) {
        case 'price-asc': query = query.order('price', { ascending: true }); break;
        case 'price-desc': query = query.order('price', { ascending: false }); break;
        case 'rating': query = query.order('rating', { ascending: false }); break;
        case 'newest': query = query.order('created_at', { ascending: false }); break;
        case 'featured':
        default:
          query = query.order('is_featured', { ascending: false }).order('rating', { ascending: false });
          break;
      }

      const { data, error } = await query;
      if (!cancelled) {
        if (error) {
          setProducts([]);
        } else {
          setProducts(data ?? []);
        }
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [activeCategory, sort, categories]);

  const activeCat = categories.find((c) => c.slug === activeCategory);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl tracking-tight text-ink-900">
          {activeCat ? activeCat.name : 'All Products'}
        </h1>
        <p className="mt-1.5 text-sm text-ink-500">
          {activeCat?.description ?? 'Browse our full collection of curated products'}
        </p>
      </div>

      {/* Filters bar */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Category pills */}
        <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          <CategoryPill
            active={!activeCategory}
            onClick={() => setActiveCategory(null)}
            label="All"
          />
          {categories.map((cat) => (
            <CategoryPill
              key={cat.id}
              active={activeCategory === cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              label={cat.name}
            />
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-ink-400" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="cursor-pointer rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-ink-400 focus:outline-none focus:ring-2 focus:ring-ink-900/10"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="skeleton aspect-square rounded-2xl" />
              <div className="skeleton h-3 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
              <div className="skeleton h-4 w-1/3 rounded" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 py-20 text-center">
          <p className="text-lg font-medium text-ink-700">No products found</p>
          <p className="mt-1 text-sm text-ink-500">Try a different category or check back soon.</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-xs font-medium text-ink-400">{products.length} products</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickAdd={onQuickAdd}
                onView={onView}
                index={i}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function CategoryPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
        active
          ? 'bg-ink-900 text-white shadow-md shadow-ink-900/20'
          : 'bg-white text-ink-600 border border-ink-200 hover:border-ink-400 hover:text-ink-900'
      }`}
    >
      {label}
    </button>
  );
}
