'use client';

import { useState, useEffect } from 'react';
import { getOrders } from '@/actions/orders/getOrders';
import { updateOrderStatus as updateOrderStatusAction } from '@/actions/orders/updateOrder';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <div className="container py-12 text-center text-neutral-500">Loading orders...</div>;

  return (
    <div className="container py-12">
      <h1 className="font-serif text-[32px] tracking-[-0.01em] mb-6">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-neutral-500">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-black/10 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm">Order #{String(order.id).slice(-8)}</span>
                  <span className={`text-xs px-2 py-0.5 ${
                    order.status === 'paid' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-neutral-100 text-neutral-600'
                  }`}>{order.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
          ))}
        </div>
      )}
    </div>
  );
}
