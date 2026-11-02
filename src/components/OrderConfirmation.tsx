import { useEffect, useState } from 'react';
import { CheckCircle2, Package, Truck, Home as HomeIcon, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice, formatDate, formatTime } from '@/lib/format';
import type { Order, OrderItem } from '@/types';

type OrderConfirmationProps = {
  orderId: string;
  email: string;
  onContinueShopping: () => void;
  onTrackOrder: () => void;
};

export function OrderConfirmation({ orderId, email, onContinueShopping, onTrackOrder }: OrderConfirmationProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();

      if (!cancelled && orderData) {
        setOrder(orderData);
        const { data: itemData } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderId);
        if (!cancelled) setItems(itemData ?? []);
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-16">
        <div className="skeleton h-8 w-48 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pt-24 pb-20 sm:px-6 lg:px-8 animate-fade-in">
      {/* Success header */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success-100 animate-scale-in">
          <CheckCircle2 className="h-10 w-10 text-success-600" />
        </div>
        <h1 className="mt-6 font-serif text-4xl tracking-tight text-ink-900">Order confirmed!</h1>
        <p className="mt-2 text-sm text-ink-500">
          Thank you for your purchase. A confirmation email has been sent to{' '}
          <span className="font-medium text-ink-700">{order?.email ?? email}</span>.
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-full bg-ink-100 px-4 py-2">
          <span className="text-xs font-medium text-ink-600">Order #</span>
          <span className="font-mono text-sm font-semibold text-ink-900">
            {(orderId || '').slice(0, 8).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-10 rounded-2xl border border-ink-200/60 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-ink-900">Order status</h2>
        <div className="flex items-center justify-between">
          <Step icon={<CheckCircle2 className="h-5 w-5" />} label="Confirmed" active date={order?.created_at} />
          <Connector />
          <Step icon={<Package className="h-5 w-5" />} label="Processing" />
          <Connector />
          <Step icon={<Truck className="h-5 w-5" />} label="Shipped" />
          <Connector />
          <Step icon={<HomeIcon className="h-5 w-5" />} label="Delivered" />
        </div>
        {order && (
          <p className="mt-4 text-xs text-ink-400">
            Placed on {formatDate(order.created_at)} at {formatTime(order.created_at)}
          </p>
        )}
      </div>

      {/* Order details */}
      {order && (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Shipping address */}
          <div className="rounded-2xl border border-ink-200/60 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-ink-900">Shipping to</h3>
            <p className="mt-2 text-sm text-ink-600">{order.full_name}</p>
            <p className="text-sm text-ink-600">{order.shipping_address}</p>
            <p className="text-sm text-ink-600">
              {order.city}, {order.zip_code}
            </p>
            <p className="text-sm text-ink-600">{order.country}</p>
          </div>

          {/* Payment summary */}
          <div className="rounded-2xl border border-ink-200/60 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-ink-900">Payment summary</h3>
            <div className="mt-2 flex flex-col gap-1.5">
              <Row label="Subtotal" value={formatPrice(Number(order.subtotal))} />
              <Row label="Shipping" value={Number(order.shipping_cost) === 0 ? 'Free' : formatPrice(Number(order.shipping_cost))} />
              <div className="mt-1 flex items-center justify-between border-t border-ink-100 pt-2">
                <span className="font-semibold text-ink-900">Total</span>
                <span className="text-lg font-bold text-ink-900">{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Items */}
      {items.length > 0 && (
        <div className="mt-6 rounded-2xl border border-ink-200/60 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-ink-900">Items in this order</h3>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-100">
                  {item.product_image && (
                    <img src={item.product_image} alt={item.product_name} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink-800">{item.product_name}</p>
                  <p className="text-xs text-ink-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-ink-900">
                  {formatPrice(Number(item.unit_price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={onTrackOrder}
          className="flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
        >
          <Clock className="h-4 w-4" />
          Track this order
        </button>
        <button
          onClick={onContinueShopping}
          className="flex items-center gap-2 rounded-full border border-ink-300 bg-white px-6 py-3 text-sm font-semibold text-ink-700 transition-colors hover:border-ink-900 hover:text-ink-900"
        >
          Continue shopping
        </button>
      </div>
    </div>
  );
}

function Step({ icon, label, active, date }: { icon: React.ReactNode; label: string; active?: boolean; date?: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
          active ? 'bg-success-500 text-white shadow-md shadow-success-500/30' : 'bg-ink-100 text-ink-400'
        }`}
      >
        {icon}
      </div>
      <span className={`text-xs font-medium ${active ? 'text-ink-900' : 'text-ink-400'}`}>{label}</span>
      {date && <span className="text-[10px] text-ink-400">{formatTime(date)}</span>}
    </div>
  );
}

function Connector() {
  return <div className="h-0.5 flex-1 bg-ink-200" />;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-500">{label}</span>
      <span className="font-medium text-ink-900">{value}</span>
    </div>
  );
}
