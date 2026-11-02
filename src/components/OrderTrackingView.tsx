import { useEffect, useState } from 'react';
import { Search, Package, Truck, Home as HomeIcon, CheckCircle2, Mail, Loader2, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice, formatDate, formatTime } from '@/lib/format';
import type { Order, OrderItem } from '@/types';

type OrderTrackingViewProps = {
  prefillEmail?: string;
  onViewProduct: (slug: string) => void;
  onContinueShopping: () => void;
};

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'] as const;
const STATUS_LABELS: Record<string, string> = {
  pending: 'Order placed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

export function OrderTrackingView({ prefillEmail, onContinueShopping }: OrderTrackingViewProps) {
  const [email, setEmail] = useState(prefillEmail ?? '');
  const [searchedEmail, setSearchedEmail] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [itemsByOrder, setItemsByOrder] = useState<Record<string, OrderItem[]>>({});

  const search = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setSearched(true);
    setSearchedEmail(email.trim());
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .order('created_at', { ascending: false });
    setOrders(data ?? []);
    setLoading(false);
  };

  // Load order items for found orders
  useEffect(() => {
    if (orders.length === 0) return;
    let cancelled = false;
    async function loadItems() {
      const orderIds = orders.map((o) => o.id);
      const { data } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);
      if (cancelled || !data) return;
      const map: Record<string, OrderItem[]> = {};
      for (const item of data) {
        if (!map[item.order_id]) map[item.order_id] = [];
        map[item.order_id].push(item);
      }
      setItemsByOrder(map);
    }
    loadItems();
    return () => { cancelled = true; };
  }, [orders]);

  // Real-time subscription for order status updates
  useEffect(() => {
    if (!searchedEmail || orders.length === 0) return;
    const channel = supabase
      .channel('order-tracking')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `email=eq.${searchedEmail.toLowerCase()}`,
        },
        (payload) => {
          setOrders((prev) =>
            prev.map((o) => (o.id === payload.new.id ? { ...o, ...payload.new as Order } : o))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [searchedEmail, orders.length]);

  return (
    <div className="mx-auto max-w-3xl px-4 pt-24 pb-20 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="font-serif text-4xl tracking-tight text-ink-900">Track your order</h1>
      <p className="mt-1.5 text-sm text-ink-500">
        Enter the email you used at checkout to see your order status in real time.
      </p>

      {/* Search bar */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-ink-200 bg-white py-3 pl-11 pr-4 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-ink-900 focus:outline-none focus:ring-2 focus:ring-ink-900/10"
          />
        </div>
        <button
          onClick={search}
          disabled={loading || !email.trim()}
          className="flex items-center justify-center gap-2 rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-ink-800 hover:shadow-xl hover:shadow-ink-900/20 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Find orders
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {searched && !loading && orders.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-ink-200 py-16 text-center">
          <Package className="mx-auto h-10 w-10 text-ink-300" />
          <p className="mt-3 text-base font-medium text-ink-700">No orders found</p>
          <p className="mt-1 text-sm text-ink-500">
            We couldn't find any orders for that email. Double-check the address or{' '}
            <button onClick={onContinueShopping} className="font-semibold text-accent-600 hover:text-accent-700">
              start shopping
            </button>
            .
          </p>
        </div>
      )}

      {/* Order list */}
      {orders.length > 0 && (
        <div className="mt-8 flex flex-col gap-4">
          <p className="text-sm font-medium text-ink-500">
            {orders.length} order{orders.length > 1 ? 's' : ''} found
          </p>
          {orders.map((order, idx) => (
            <OrderCard
              key={order.id}
              order={order}
              items={itemsByOrder[order.id] ?? []}
              index={idx}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, items, index }: { order: Order; items: OrderItem[]; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const currentStep = STATUS_STEPS.indexOf(order.status as typeof STATUS_STEPS[number]);

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-200/60 bg-white shadow-sm animate-fade-in-up" style={{ animationDelay: `${index * 60}ms` }}>
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-ink-50"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-100 text-ink-600">
            <Package className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-ink-900">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-xs text-ink-500">
              {formatDate(order.created_at)} at {formatTime(order.created_at)} · {formatPrice(Number(order.total))}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <ChevronRight className={`h-4 w-4 text-ink-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-ink-100 px-5 py-5 animate-fade-in">
          {/* Status timeline */}
          <div className="flex items-center justify-between">
            {STATUS_STEPS.map((step, i) => {
              const isComplete = i <= currentStep;
              const isCurrent = i === currentStep;
              const icon =
                step === 'pending' ? <CheckCircle2 className="h-4 w-4" /> :
                step === 'processing' ? <Package className="h-4 w-4" /> :
                step === 'shipped' ? <Truck className="h-4 w-4" /> :
                <HomeIcon className="h-4 w-4" />;

              return (
                <div key={step} className="flex flex-1 flex-col items-center">
                  <div className="flex w-full items-center">
                    {i > 0 && (
                      <div className={`h-0.5 flex-1 ${i <= currentStep ? 'bg-success-500' : 'bg-ink-200'}`} />
                    )}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all ${
                        isComplete
                          ? 'bg-success-500 text-white shadow-md shadow-success-500/30'
                          : 'bg-ink-100 text-ink-400'
                      } ${isCurrent ? 'ring-4 ring-success-500/20' : ''}`}
                    >
                      {icon}
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`h-0.5 flex-1 ${i < currentStep ? 'bg-success-500' : 'bg-ink-200'}`} />
                    )}
                  </div>
                  <span className={`mt-1.5 text-xs font-medium ${isComplete ? 'text-ink-900' : 'text-ink-400'}`}>
                    {STATUS_LABELS[step]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Items */}
          {items.length > 0 && (
            <div className="mt-6 border-t border-ink-100 pt-4">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">Items</h4>
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-ink-100">
                      {item.product_image && (
                        <img src={item.product_image} alt={item.product_name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink-800">{item.product_name}</p>
                      <p className="text-xs text-ink-500">Qty: {item.quantity} · {formatPrice(Number(item.unit_price))}</p>
                    </div>
                    <span className="text-sm font-semibold text-ink-900">
                      {formatPrice(Number(item.unit_price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping address */}
          <div className="mt-4 border-t border-ink-100 pt-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">Shipping to</h4>
            <p className="text-sm text-ink-600">{order.full_name}</p>
            <p className="text-sm text-ink-600">
              {order.shipping_address}, {order.city} {order.zip_code}
            </p>
            <p className="text-sm text-ink-600">{order.country}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-ink-100 text-ink-700',
    processing: 'bg-accent-100 text-accent-700',
    shipped: 'bg-blue-100 text-blue-700',
    delivered: 'bg-success-100 text-success-700',
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${colors[status] ?? colors.pending}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
