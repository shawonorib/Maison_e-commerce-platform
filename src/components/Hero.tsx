import { ArrowRight, Truck, ShieldCheck, RefreshCcw } from 'lucide-react';

type HeroProps = {
  onShopNow: () => void;
  onExplore: () => void;
};

export function Hero({ onShopNow, onExplore }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-16">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-ink-50 to-white" />
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent-200/30 blur-3xl" />
        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-ink-200/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:gap-8 lg:py-24">
          {/* Left — copy */}
          <div className="flex flex-col items-start animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white/60 px-3 py-1 text-xs font-medium text-ink-600">
              <span className="flex h-1.5 w-1.5 rounded-full bg-success-500 animate-pulse-soft" />
              Free shipping on orders over $75
            </span>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight text-ink-900 sm:text-6xl lg:text-7xl text-balance">
              Curated objects for considered living
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-500">
              A marketplace of thoughtfully designed products — from audio to home goods,
              crafted by makers we trust and delivered with care.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={onShopNow}
                className="group flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-ink-800 hover:shadow-xl hover:shadow-ink-900/20 active:scale-[0.98]"
              >
                Shop all products
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={onExplore}
                className="flex items-center gap-2 rounded-full border border-ink-300 bg-white/60 px-6 py-3.5 text-sm font-semibold text-ink-700 transition-all hover:border-ink-900 hover:bg-white active:scale-[0.98]"
              >
                Explore categories
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <TrustBadge icon={<Truck className="h-4 w-4" />} label="Fast delivery" />
              <TrustBadge icon={<ShieldCheck className="h-4 w-4" />} label="Secure payments" />
              <TrustBadge icon={<RefreshCcw className="h-4 w-4" />} label="30-day returns" />
            </div>
          </div>

          {/* Right — visual collage */}
          <div className="relative hidden lg:block animate-fade-in-up animate-delay-200">
            <div className="relative grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <div className="overflow-hidden rounded-3xl bg-ink-100 aspect-[3/4] shadow-lg shadow-ink-900/5">
                  <img
                    src="https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                    alt="Wireless headphones"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-3xl bg-ink-100 aspect-square shadow-lg shadow-ink-900/5">
                  <img
                    src="https://images.pexels.com/photos/15246346/pexels-photo-15246346.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                    alt="Leather backpack"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 pt-8">
                <div className="overflow-hidden rounded-3xl bg-ink-100 aspect-square shadow-lg shadow-ink-900/5">
                  <img
                    src="https://images.pexels.com/photos/13007642/pexels-photo-13007642.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                    alt="Smartwatch"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-3xl bg-ink-100 aspect-[3/4] shadow-lg shadow-ink-900/5">
                  <img
                    src="https://images.pexels.com/photos/7439756/pexels-photo-7439756.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                    alt="Desk lamp"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
            {/* Floating accent card */}
            <div className="absolute -bottom-4 -left-4 flex items-center gap-3 rounded-2xl glass border border-ink-200/60 px-4 py-3 shadow-xl shadow-ink-900/10 animate-fade-in-up animate-delay-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100">
                <span className="text-lg">✦</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-900">2,400+ happy customers</p>
                <p className="text-xs text-ink-500">Rated 4.8 / 5 average</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-ink-500">
      <span className="text-ink-400">{icon}</span>
      {label}
    </div>
  );
}
