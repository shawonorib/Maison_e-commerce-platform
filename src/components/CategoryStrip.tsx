import { Headphones, Watch, Glasses, Lamp, Backpack, Footprints, Coffee, Keyboard } from 'lucide-react';
import type { Category } from '@/types';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Headphones,
  Watch,
  Glasses,
  Lamp,
  Backpack,
  Footprints,
  Coffee,
  Keyboard,
};

type CategoryStripProps = {
  categories: Category[];
  onSelect: (slug: string) => void;
};

export function CategoryStrip({ categories, onSelect }: CategoryStripProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-serif text-3xl tracking-tight text-ink-900">Shop by category</h2>
          <p className="mt-1 text-sm text-ink-500">Find exactly what you're looking for</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map((cat, i) => {
          const Icon = ICONS[cat.icon ?? ''] ?? Headphones;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.slug)}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-ink-200/60 bg-white/50 p-5 transition-all hover:border-ink-900 hover:bg-white hover:shadow-lg hover:shadow-ink-900/5 animate-fade-in-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-600 transition-all group-hover:bg-ink-900 group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-ink-700">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
