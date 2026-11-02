import { useEffect, useState } from 'react';
import { CartProvider, useCart } from '@/context/CartContext';
import { ToastProvider, useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import type { Category, Product } from '@/types';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/components/HomePage';
import { ShopView } from '@/components/ShopView';
import { ProductDetail } from '@/components/ProductDetail';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutView } from '@/components/CheckoutView';
import { OrderConfirmation } from '@/components/OrderConfirmation';
import { OrderTrackingView } from '@/components/OrderTrackingView';
import { SearchModal } from '@/components/SearchModal';

type View =
  | { page: 'home' }
  | { page: 'shop'; category?: string }
  | { page: 'product'; slug: string }
  | { page: 'checkout' }
  | { page: 'confirmation'; orderId: string; email: string }
  | { page: 'orders'; email?: string };

function AppContent() {
  const { add } = useCart();
  const { toast } = useToast();
  const [view, setView] = useState<View>({ page: 'home' });
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data } = await supabase.from('categories').select('*').order('name');
      if (!cancelled) setCategories(data ?? []);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [view]);

  const handleNav = (target: { page: 'home' } | { page: 'shop'; category?: string } | { page: 'orders' }) => {
    if (target.page === 'shop') setView({ page: 'shop', category: target.category });
    else if (target.page === 'orders') setView({ page: 'orders' });
    else setView({ page: 'home' });
  };

  const handleViewProduct = (slug: string) => {
    setView({ page: 'product', slug });
  };

  const handleQuickAdd = (product: Product) => {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url,
      stock: product.stock,
    });
    toast(`${product.name} added to cart`, 'success');
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: Number(product.price),
        image_url: product.image_url,
        stock: product.stock,
      },
      quantity
    );
    toast(`${product.name} added to cart`, 'success');
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onNavigate={handleNav}
        currentView={view.page}
      />

      <main>
        {view.page === 'home' && (
          <HomePage
            categories={categories}
            onShopNow={() => setView({ page: 'shop' })}
            onExplore={(category) => setView({ page: 'shop', category })}
            onQuickAdd={handleQuickAdd}
            onView={handleViewProduct}
            onSeeAll={() => setView({ page: 'shop' })}
          />
        )}

        {view.page === 'shop' && (
          <ShopView
            categories={categories}
            initialCategory={view.category ?? null}
            onQuickAdd={handleQuickAdd}
            onView={handleViewProduct}
          />
        )}

        {view.page === 'product' && (
          <ProductDetail
            slug={view.slug}
            onBack={() => setView({ page: 'shop' })}
            onAddToCart={handleAddToCart}
            onView={handleViewProduct}
          />
        )}

        {view.page === 'checkout' && (
          <CheckoutView
            onBack={() => setView({ page: 'shop' })}
            onOrderPlaced={(orderId, email) => setView({ page: 'confirmation', orderId, email })}
          />
        )}

        {view.page === 'confirmation' && (
          <OrderConfirmation
            orderId={view.orderId}
            email={view.email}
            onContinueShopping={() => setView({ page: 'shop' })}
            onTrackOrder={() => setView({ page: 'orders', email: view.email })}
          />
        )}

        {view.page === 'orders' && (
          <OrderTrackingView
            prefillEmail={view.email}
            onViewProduct={handleViewProduct}
            onContinueShopping={() => setView({ page: 'shop' })}
          />
        )}
      </main>

      <Footer onNavigate={handleNav} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setView({ page: 'checkout' });
        }}
      />

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleViewProduct}
      />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
