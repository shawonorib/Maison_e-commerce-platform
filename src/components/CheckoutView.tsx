import { useState } from 'react';
import { ArrowLeft, Lock, CreditCard, CheckCircle2, Loader2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/format';
import type { Order } from '@/types';

type CheckoutViewProps = {
  onBack: () => void;
  onOrderPlaced: (orderId: string, email: string) => void;
};

const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_COST = 7.99;

export function CheckoutView({ onBack, onOrderPlaced }: CheckoutViewProps) {
  const { items, subtotal, clear } = useCart();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    full_name: '',
    shipping_address: '',
    city: '',
    zip_code: '',
    country: 'United States',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.full_name.trim()) e.full_name = 'Name is required';
    if (!form.shipping_address.trim()) e.shipping_address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.zip_code.trim()) e.zip_code = 'ZIP code is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast('Your cart is empty', 'error');
      onBack();
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    const orderItems = items.map((i) => ({
      product_id: i.productId,
      quantity: i.quantity,
    }));

    const { data, error } = await supabase.rpc('place_order', {
      p_email: form.email,
      p_full_name: form.full_name,
      p_shipping_address: form.shipping_address,
      p_city: form.city,
      p_zip_code: form.zip_code,
      p_items: orderItems,
      p_country: form.country,
    });

    if (error) {
      toast(error.message || 'Failed to place order', 'error');
      setSubmitting(false);
      return;
    }

    const orderId = data?.order_id as string;
    if (!orderId) {
      toast('Failed to place order', 'error');
      setSubmitting(false);
      return;
    }

    clear();
    toast('Order placed successfully!', 'success');
    onOrderPlaced(orderId, form.email);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-24 pb-20 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink-100">
            <ShoppingBag className="h-8 w-8 text-ink-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-ink-900">Your cart is empty</h1>
            <p className="mt-1 text-sm text-ink-500">Add some products before checking out</p>
          </div>
          <button
            onClick={onBack}
            className="mt-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
          >
            Browse products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-24 pb-20 sm:px-6 lg:px-8 animate-fade-in">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to cart
      </button>

      <h1 className="font-serif text-3xl tracking-tight text-ink-900">Checkout</h1>
      <p className="mt-1 text-sm text-ink-500">Complete your order securely</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-ink-200/60 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white">1</span>
              <h2 className="text-lg font-semibold text-ink-900">Contact information</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Email address" error={errors.email} className="sm:col-span-2">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className={inputCls(errors.email)}
                />
              </Field>
              <Field label="Full name" error={errors.full_name}>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Jane Doe"
                  className={inputCls(errors.full_name)}
                />
              </Field>
              <Field label="Country">
                <select
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className={inputCls()}
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>Germany</option>
                  <option>France</option>
                  <option>Japan</option>
                </select>
              </Field>
            </div>

            <div className="mt-6 mb-5 flex items-center gap-2 border-t border-ink-100 pt-6">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white">2</span>
              <h2 className="text-lg font-semibold text-ink-900">Shipping address</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Street address" error={errors.shipping_address} className="sm:col-span-2">
                <input
                  type="text"
                  value={form.shipping_address}
                  onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
                  placeholder="123 Main Street"
                  className={inputCls(errors.shipping_address)}
                />
              </Field>
              <Field label="City" error={errors.city}>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="San Francisco"
                  className={inputCls(errors.city)}
                />
              </Field>
              <Field label="ZIP / Postal code" error={errors.zip_code}>
                <input
                  type="text"
                  value={form.zip_code}
                  onChange={(e) => setForm({ ...form, zip_code: e.target.value })}
                  placeholder="94103"
                  className={inputCls(errors.zip_code)}
                />
              </Field>
            </div>

            {/* Payment section */}
            <div className="mt-6 mb-4 flex items-center gap-2 border-t border-ink-100 pt-6">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white">3</span>
              <h2 className="text-lg font-semibold text-ink-900">Payment</h2>
            </div>
            <div className="rounded-xl border border-ink-200 bg-ink-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <CreditCard className="h-5 w-5 text-ink-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink-800">Pay on delivery confirmation</p>
                  <p className="text-xs text-ink-500">Your order will be confirmed and payment collected at delivery. No card required.</p>
                </div>
                <Lock className="h-4 w-4 text-ink-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-ink-200/60 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-ink-900">Order summary</h2>
            <div className="mt-4 flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-100">
                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink-900 px-1 text-xs font-bold text-white ring-2 ring-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-sm font-medium leading-snug text-ink-800 line-clamp-2">{item.name}</p>
                    <p className="text-xs text-ink-500">{formatPrice(item.price)} each</p>
                  </div>
                  <span className="self-center text-sm font-semibold text-ink-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-2 border-t border-ink-100 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Subtotal</span>
                <span className="font-medium text-ink-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Shipping</span>
                <span className="font-medium text-ink-900">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between border-t border-ink-100 pt-3">
                <span className="font-semibold text-ink-900">Total</span>
                <span className="text-2xl font-bold text-ink-900">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 py-3.5 text-sm font-semibold text-white transition-all hover:bg-ink-800 hover:shadow-xl hover:shadow-ink-900/20 active:scale-[0.98] disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Placing order...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Place order — {formatPrice(total)}
                </>
              )}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-400">
              <Lock className="h-3 w-3" />
              Secure checkout. Your data is protected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-ink-600">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-error-500">{error}</p>}
    </div>
  );
}

function inputCls(error?: string) {
  return `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:outline-none focus:ring-2 focus:ring-ink-900/10 ${
    error ? 'border-error-400' : 'border-ink-200 hover:border-ink-400 focus:border-ink-900'
  }`;
}
