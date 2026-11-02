import { useEffect, useState } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingBag, Truck, RefreshCcw, ShieldCheck, ChevronRight } from 'lucide-react';
import type { Product } from '@/types';
import { supabase } from '@/lib/supabase';
import { formatPrice, getStockStatus, getDiscountPercent } from '@/lib/format';
import { Rating } from '@/components/Rating';

type ProductDetailProps = {
  slug: string;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onView: (slug: string) => void;
};

export function ProductDetail({ slug, onBack, onAddToCart, onView }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setQuantity(1);
    setLoading(true);

    async function load() {
      const { data } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('slug', slug)
        .maybeSingle();
      if (!cancelled) {
        setProduct(data);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [slug]);

  // Real-time stock updates
  useEffect(() => {
    if (!product) return;
    const channel = supabase
      .channel(`product-${product.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
          filter: `id=eq.${product.id}`,
        },
        (payload) => {
          setProduct((prev) => (prev ? { ...prev, ...payload.new } : prev));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [product?.id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="skeleton aspect-square rounded-3xl" />
          <div className="flex flex-col gap-4 pt-8">
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-10 w-3/4 rounded" />
            <div className="skeleton h-6 w-32 rounded" />
            <div className="skeleton h-24 w-full rounded" />
            <div className="skeleton h-12 w-full rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-20 text-center">
        <p className="text-lg font-medium text-ink-700">Product not found</p>
        <button onClick={onBack} className="mt-4 text-sm font-semibold text-accent-600 hover:text-accent-700">
          Back to shop
        </button>
      </div>
    );
  }

  const discount = getDiscountPercent(product.price, product.compare_at_price);
  const stock = getStockStatus(product.stock);
  const outOfStock = product.stock === 0;
  const maxQty = Math.min(product.stock, 99);

  const handleAdd = () => {
    setAdding(true);
    onAddToCart(product, quantity);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-ink-500">
        <button onClick={onBack} className="flex items-center gap-1 hover:text-ink-900 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Shop
        </button>
        {product.categories && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-ink-700">{product.categories.name}</span>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-ink-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl bg-ink-100 aspect-square shadow-lg shadow-ink-900/5">
            <img
              src={product.image_url}
              alt={product.name}
              className={`h-full w-full object-cover ${outOfStock ? 'opacity-70 grayscale' : ''}`}
            />
            {discount > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-accent-500 px-3 py-1.5 text-sm font-semibold text-white shadow-md shadow-accent-500/30">
                -{discount}% off
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5 lg:pt-4">
          <div className="flex flex-col gap-2">
            {product.categories && (
              <span className="text-xs font-semibold uppercase tracking-widest text-accent-600">
                {product.categories.name}
              </span>
            )}
            <h1 className="font-serif text-4xl tracking-tight text-ink-900 text-balance">
              {product.name}
            </h1>
            <div className="flex items-center gap-3">
              <Rating rating={product.rating} count={product.review_count} size="md" />
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-semibold text-ink-900">{formatPrice(product.price)}</span>
            {product.compare_at_price && (
              <>
                <span className="text-lg text-ink-400 line-through">{formatPrice(product.compare_at_price)}</span>
                <span className="rounded-md bg-accent-100 px-2 py-0.5 text-xs font-semibold text-accent-700">
                  Save {formatPrice(product.compare_at_price - product.price)}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-base leading-relaxed text-ink-600">{product.description}</p>

          {/* Stock indicator */}
          <div className="flex items-center gap-2.5">
            <span className={`flex h-2 w-2 rounded-full ${outOfStock ? 'bg-error-500' : 'bg-success-500'} ${!outOfStock ? 'animate-pulse-soft' : ''}`} />
            <span className={`text-sm font-medium ${stock.color}`}>{stock.label}</span>
            {product.sku && <span className="text-xs text-ink-400">SKU: {product.sku}</span>}
          </div>

          {/* Quantity + Add to cart */}
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center justify-between rounded-xl border border-ink-200 bg-white px-2 sm:justify-start">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={outOfStock}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-ink-100 disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-base font-semibold text-ink-900">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                disabled={outOfStock || quantity >= maxQty}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-ink-100 disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={outOfStock || adding}
              className="group flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-ink-900 px-8 text-sm font-semibold text-white transition-all hover:bg-ink-800 hover:shadow-xl hover:shadow-ink-900/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-ink-300 disabled:shadow-none"
            >
              {adding ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Added!
                </span>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  {outOfStock ? 'Out of stock' : `Add to cart — ${formatPrice(product.price * quantity)}`}
                </>
              )}
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-ink-100 pt-6">
            <TrustItem icon={<Truck className="h-5 w-5" />} label="Free shipping over $75" />
            <TrustItem icon={<RefreshCcw className="h-5 w-5" />} label="30-day returns" />
            <TrustItem icon={<ShieldCheck className="h-5 w-5" />} label="Secure checkout" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="text-ink-500">{icon}</span>
      <span className="text-xs font-medium text-ink-500">{label}</span>
    </div>
  );
}
