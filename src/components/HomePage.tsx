import { useEffect, useState } from 'react';
import type { Category, Product } from '@/types';
import { supabase } from '@/lib/supabase';
import { Hero } from '@/components/Hero';
import { CategoryStrip } from '@/components/CategoryStrip';
import { FeaturedSection } from '@/components/FeaturedSection';
import { PromoBanner } from '@/components/PromoBanner';

type HomePageProps = {
  categories: Category[];
  onShopNow: () => void;
  onExplore: (category: string) => void;
  onQuickAdd: (product: Product) => void;
  onView: (slug: string) => void;
  onSeeAll: () => void;
};

export function HomePage({ categories, onShopNow, onExplore, onQuickAdd, onView, onSeeAll }: HomePageProps) {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('is_featured', true)
        .order('rating', { ascending: false })
        .limit(8);
      if (!cancelled) {
        setFeatured(data ?? []);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <Hero onShopNow={onShopNow} onExplore={() => onExplore(categories[0]?.slug ?? '')} />
      <CategoryStrip categories={categories} onSelect={onExplore} />
      {loading ? null : (
        <FeaturedSection
          products={featured}
          onQuickAdd={onQuickAdd}
          onView={onView}
          onSeeAll={onSeeAll}
        />
      )}
      <PromoBanner onShop={onShopNow} />
    </div>
  );
}
