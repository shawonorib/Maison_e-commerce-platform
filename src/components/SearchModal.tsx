import { useEffect, useRef, useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice, getDiscountPercent } from '@/lib/format';
import type { Product } from '@/types';

type SearchModalProps = {
  open: boolean;
  onClose: () => void;
  onNavigate: (slug: string) => void;
};

export function SearchModal({ open, onClose, onNavigate }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('products')
        .select('*, categories(*)')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(8);
      if (!cancelled) {
        setResults(data ?? []);
        setLoading(false);
      }
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query]);

  if (!open) return null;

  const select = (slug: string) => {
    onNavigate(slug);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[180] flex items-start justify-center pt-20 px-4 animate-fade-in">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl animate-scale-in">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-ink-900/20">
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-ink-100 px-4">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-ink-400" />
            ) : (
              <Search className="h-5 w-5 text-ink-400" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent py-4 text-base text-ink-900 placeholder:text-ink-400 focus:outline-none"
            />
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {!query.trim() ? (
              <div className="px-4 py-12 text-center">
                <Search className="mx-auto h-8 w-8 text-ink-200" />
                <p className="mt-3 text-sm text-ink-400">Search for products by name or description</p>
              </div>
            ) : loading ? (
              <div className="px-4 py-12 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-ink-300" />
              </div>
            ) : results.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="text-sm font-medium text-ink-600">No products found</p>
                <p className="mt-1 text-xs text-ink-400">Try a different search term</p>
              </div>
            ) : (
              <div className="flex flex-col py-2">
                {results.map((product) => {
                  const discount = getDiscountPercent(product.price, product.compare_at_price);
                  return (
                    <button
                      key={product.id}
                      onClick={() => select(product.slug)}
                      className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-ink-50"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-ink-100">
                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-ink-800">{product.name}</p>
                        {product.categories && (
                          <p className="text-xs text-ink-400">{product.categories.name}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {discount > 0 && (
                          <span className="rounded-md bg-accent-100 px-1.5 py-0.5 text-xs font-semibold text-accent-700">
                            -{discount}%
                          </span>
                        )}
                        <span className="text-sm font-semibold text-ink-900">{formatPrice(product.price)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
