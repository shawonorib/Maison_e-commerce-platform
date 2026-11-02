import { useEffect, useState } from 'react';
import { Search, ShoppingBag, Menu, X, Package, Home as HomeIcon } from 'lucide-react';
import { useCart } from '@/context/CartContext';

type HeaderProps = {
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onNavigate: (view: { page: 'home' } | { page: 'shop'; category?: string } | { page: 'orders' }) => void;
  currentView: string;
};

export function Header({ onOpenCart, onOpenSearch, onNavigate, currentView }: HeaderProps) {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (target: Parameters<typeof onNavigate>[0]) => {
    onNavigate(target);
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${
          scrolled ? 'glass border-b border-ink-200/50 shadow-sm shadow-ink-900/5' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            onClick={() => go({ page: 'home' })}
            className="flex items-center gap-2 transition-transform hover:scale-[1.02]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-white">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <span className="font-serif text-2xl font-normal tracking-tight text-ink-900">
              Maison
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink active={currentView === 'home'} onClick={() => go({ page: 'home' })} icon={<HomeIcon className="h-4 w-4" />}>
              Home
            </NavLink>
            <NavLink active={currentView === 'shop'} onClick={() => go({ page: 'shop' })}>
              All Products
            </NavLink>
            <NavLink active={false} onClick={() => go({ page: 'shop', category: 'audio' })}>
              Audio
            </NavLink>
            <NavLink active={false} onClick={() => go({ page: 'shop', category: 'wearables' })}>
              Wearables
            </NavLink>
            <NavLink active={false} onClick={() => go({ page: 'shop', category: 'accessories' })}>
              Accessories
            </NavLink>
            <NavLink active={currentView === 'orders'} onClick={() => go({ page: 'orders' })} icon={<Package className="h-4 w-4" />}>
              Track Order
            </NavLink>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenSearch}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={onOpenCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-xs font-bold text-white ring-2 ring-white animate-scale-in">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="glass border-t border-ink-200/50 px-4 py-4 md:hidden animate-fade-in">
            <div className="flex flex-col gap-1">
              <MobileLink onClick={() => go({ page: 'home' })}>Home</MobileLink>
              <MobileLink onClick={() => go({ page: 'shop' })}>All Products</MobileLink>
              <MobileLink onClick={() => go({ page: 'shop', category: 'audio' })}>Audio</MobileLink>
              <MobileLink onClick={() => go({ page: 'shop', category: 'wearables' })}>Wearables</MobileLink>
              <MobileLink onClick={() => go({ page: 'shop', category: 'eyewear' })}>Eyewear</MobileLink>
              <MobileLink onClick={() => go({ page: 'shop', category: 'home' })}>Home</MobileLink>
              <MobileLink onClick={() => go({ page: 'shop', category: 'accessories' })}>Accessories</MobileLink>
              <MobileLink onClick={() => go({ page: 'shop', category: 'footwear' })}>Footwear</MobileLink>
              <MobileLink onClick={() => go({ page: 'shop', category: 'drinkware' })}>Drinkware</MobileLink>
              <MobileLink onClick={() => go({ page: 'shop', category: 'computing' })}>Computing</MobileLink>
              <MobileLink onClick={() => go({ page: 'orders' })}>Track Order</MobileLink>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

function NavLink({
  children,
  onClick,
  active,
  icon,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-ink-900 text-white'
          : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function MobileLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100"
    >
      {children}
    </button>
  );
}
