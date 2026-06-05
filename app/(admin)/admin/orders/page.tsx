'use client';

import { useState, useEffect } from 'react';
import { getOrders } from '@/actions/orders/getOrders';
import { updateOrderStatus as updateOrderStatusAction } from '@/actions/orders/updateOrder';

function formatPrice(cents: number) {
  return '$' + (cents / 100).toFixed(2);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const statusStyles: Record<string, string> = {
  paid: 'bg-green-100 text-green-800',
  shipped: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  pending: 'bg-neutral-100 text-neutral-600',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [updatingOrder, setUpdatingOrder] = useState<number | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: number, newStatus: string) {
    setUpdatingOrder(orderId);
    try {
      const updatedOrder = await updateOrderStatusAction(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating status');
    } finally {
      setUpdatingOrder(null);
    }
  }

  function toggleExpand(id: number) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (loading) return <div className="container py-12 text-center text-neutral-500">Loading orders...</div>;

  return (
    <div className="container py-12">
      <h1 className="font-serif text-[32px] tracking-[-0.01em] mb-6">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-neutral-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-black/10">
              <button
                onClick={() => toggleExpand(order.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="font-medium">Order #{String(order.id).slice(-8)}</span>
                  <span className="text-sm text-neutral-500">{formatDate(order.createdAt)}</span>
                  <span className={`text-xs px-2 py-0.5 ${statusStyles[order.status] || statusStyles.pending}`}>
                    {order.status}
                  </span>
                </div>
                <span className="text-neutral-400 text-sm">{expanded.has(order.id) ? '▲' : '▼'}</span>
              </button>

              {expanded.has(order.id) && (
                <div className="px-5 pb-5 border-t border-black/5 pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-500">Customer</span>
                      <p className="font-medium">{order.email || '—'}</p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Total</span>
                      <p className="font-medium">{formatPrice(order.total)} {order.currency}</p>
                    </div>
                  </div>

                  {order.items?.length > 0 && (
                    <div>
                      <span className="text-xs text-neutral-500 uppercase tracking-wider">Items</span>
                      <div className="mt-1 divide-y divide-black/5">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between py-1.5 text-sm">
                            <span>{item.name}</span>
                            <span className="text-neutral-600">
                              x{item.quantity} — {formatPrice(item.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {order.shippingAddress && (
                    <div className="text-sm">
                      <span className="text-neutral-500">Shipping Address</span>
                      <p className="font-medium whitespace-pre-wrap mt-0.5">{order.shippingAddress}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t border-black/5">
                    <span className="text-xs text-neutral-500 uppercase tracking-wider">Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      disabled={updatingOrder === order.id}
                      className="border border-black/10 px-3 py-1.5 text-sm bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="shipped">Shipped</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
