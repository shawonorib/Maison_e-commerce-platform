import { ShoppingBag, Instagram, Twitter, Facebook } from 'lucide-react';

type FooterProps = {
  onNavigate: (view: { page: 'home' } | { page: 'shop'; category?: string } | { page: 'orders' }) => void;
};

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-ink-200/60 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-white">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span className="font-serif text-2xl tracking-tight text-ink-900">Maison</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              Curated objects for considered living. Thoughtfully designed products, delivered with care.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <SocialIcon icon={<Instagram className="h-4 w-4" />} />
              <SocialIcon icon={<Twitter className="h-4 w-4" />} />
              <SocialIcon icon={<Facebook className="h-4 w-4" />} />
            </div>
          </div>

          {/* Shop links */}
          <FooterColumn title="Shop">
            <FooterLink onClick={() => onNavigate({ page: 'shop' })}>All Products</FooterLink>
            <FooterLink onClick={() => onNavigate({ page: 'shop', category: 'audio' })}>Audio</FooterLink>
            <FooterLink onClick={() => onNavigate({ page: 'shop', category: 'wearables' })}>Wearables</FooterLink>
            <FooterLink onClick={() => onNavigate({ page: 'shop', category: 'accessories' })}>Accessories</FooterLink>
            <FooterLink onClick={() => onNavigate({ page: 'shop', category: 'home' })}>Home</FooterLink>
          </FooterColumn>

          {/* Company links */}
          <FooterColumn title="Company">
            <FooterLink onClick={() => {}}>About us</FooterLink>
            <FooterLink onClick={() => {}}>Sustainability</FooterLink>
            <FooterLink onClick={() => {}}>Careers</FooterLink>
            <FooterLink onClick={() => {}}>Press</FooterLink>
            <FooterLink onClick={() => {}}>Contact</FooterLink>
          </FooterColumn>

          {/* Support links */}
          <FooterColumn title="Support">
            <FooterLink onClick={() => onNavigate({ page: 'orders' })}>Track your order</FooterLink>
            <FooterLink onClick={() => {}}>Shipping & returns</FooterLink>
            <FooterLink onClick={() => {}}>FAQ</FooterLink>
            <FooterLink onClick={() => {}}>Help center</FooterLink>
            <FooterLink onClick={() => {}}>Privacy policy</FooterLink>
          </FooterColumn>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ink-100 pt-6 sm:flex-row">
          <p className="text-xs text-ink-400">
            &copy; {new Date().getFullYear()} Maison. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-ink-400">
            <span>Secure checkout</span>
            <span className="h-3 w-px bg-ink-200" />
            <span>Free shipping over $75</span>
            <span className="h-3 w-px bg-ink-200" />
            <span>30-day returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
      <div className="mt-3 flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FooterLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left text-sm text-ink-500 transition-colors hover:text-ink-900"
    >
      {children}
    </button>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 text-ink-500 transition-colors hover:border-ink-900 hover:text-ink-900">
      {icon}
    </button>
  );
}
