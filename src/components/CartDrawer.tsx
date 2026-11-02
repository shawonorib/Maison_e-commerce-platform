import { useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
};

const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_COST = 7.99;

export function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const { items, remove, updateQty, subtotal, count } = useCart();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[150] bg-ink-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 z-[160] flex h-full w-full max-w-md flex-col bg-ink-50 shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-200/60 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-ink-700" />
            <h2 className="text-lg font-semibold text-ink-900">
              Your cart {count > 0 && `(${count})`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink-100">
              <ShoppingBag className="h-8 w-8 text-ink-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-ink-700">Your cart is empty</p>
              <p className="mt-1 text-sm text-ink-500">Add some products to get started</p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="border-b border-ink-200/60 px-5 py-3">
              {remaining > 0 ? (
                <p className="text-xs text-ink-500">
                  You're <span className="font-semibold text-ink-800">{formatPrice(remaining)}</span> away from free shipping
                </p>
              ) : (
                <p className="text-xs font-medium text-success-600">
                  You've unlocked free shipping!
                </p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-200">
                <div
                  className="h-full rounded-full bg-success-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm shadow-ink-900/5">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ink-100">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-medium leading-snug text-ink-800">{item.name}</h3>
                        <button
                          onClick={() => remove(item.productId)}
                          className="shrink-0 text-ink-400 transition-colors hover:text-error-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-ink-900">{formatPrice(item.price)}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-lg border border-ink-200 px-1">
                          <button
                            onClick={() => updateQty(item.productId, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded text-ink-600 hover:bg-ink-100"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="flex h-7 w-7 items-center justify-center rounded text-ink-600 hover:bg-ink-100 disabled:opacity-40"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-ink-700">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-ink-200/60 px-5 py-4">
              <div className="mb-4 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-500">Subtotal</span>
                  <span className="font-medium text-ink-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-500">Shipping</span>
                  <span className="font-medium text-ink-900">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between border-t border-ink-100 pt-2">
                  <span className="font-semibold text-ink-900">Total</span>
                  <span className="text-xl font-bold text-ink-900">{formatPrice(total)}</span>
                </div>
              </div>
              <button
                onClick={onCheckout}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 py-3.5 text-sm font-semibold text-white transition-all hover:bg-ink-800 hover:shadow-xl hover:shadow-ink-900/20 active:scale-[0.98]"
              >
                Checkout
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
