type PromoBannerProps = {
  onShop: () => void;
};

export function PromoBanner({ onShop }: PromoBannerProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-6 py-12 sm:px-12 sm:py-16">
        {/* Decorative gradient */}
        <div className="absolute inset-0 -z-0 opacity-60">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent-400/10 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-400">Limited time</span>
            <h2 className="mt-2 font-serif text-3xl leading-tight tracking-tight text-white sm:text-4xl">
              Mid-season sale —<br />up to 40% off select items
            </h2>
            <p className="mt-3 max-w-md text-sm text-ink-300">
              Refresh your everyday carry, upgrade your workspace, or find the perfect gift.
              Free shipping included on all sale orders.
            </p>
          </div>
          <button
            onClick={onShop}
            className="flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink-900 transition-all hover:bg-accent-400 hover:text-white active:scale-[0.98]"
          >
            Shop the sale
          </button>
        </div>
      </div>
    </section>
  );
}
