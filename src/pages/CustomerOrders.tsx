import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useAppContext } from '../context/useAppContext';
import ProductImage from '../components/ProductImage';

const CustomerOrders = () => {
  const { orders } = useAppContext();

  return (
    <div className="glass-panel-solid rounded-3xl border border-glass-border p-6 md:p-8 shadow-sm">
      <div className="mb-6">
        <span className="eyebrow">Order History</span>
        <h2 className="text-2xl font-display font-extrabold text-text-primary">My Rescues</h2>
        <p className="text-sm text-text-secondary mt-1">Track every meal you have saved from going to waste.</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="card p-5 bg-surface-white/80 border border-glass-border flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-text-primary text-base">{order.id}</span>
                  <span className="badge badge-mint font-extrabold">{order.status}</span>
                  <span className="text-xs text-text-secondary">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Items with canonical ProductImage */}
                <div className="flex flex-wrap gap-3 mt-3">
                  {order.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-2.5 bg-surface-secondary/60 rounded-xl px-3 py-1.5 border border-border-emeraldSubtle"
                    >
                      <ProductImage
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        productName={item.product.name}
                        className="w-7 h-7 rounded-lg shrink-0"
                      />
                      <span className="text-xs font-semibold text-text-primary">
                        {item.quantity}× {item.product.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 pt-3 md:pt-0 border-t md:border-0 border-border/40">
                <span className="text-xs text-text-secondary">Total Paid</span>
                <span className="font-extrabold text-xl text-brand-forest">
                  ₹{order.total.toFixed(2)}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center rounded-2xl bg-surface-secondary/50 p-12 border border-border-emeraldSubtle">
          <Package size={40} className="mx-auto text-brand-forest/60 mb-3" />
          <h3 className="font-bold text-base text-text-primary mb-1">No orders yet</h3>
          <p className="text-xs text-text-secondary mb-5">Start by exploring today's fresh rescue deals.</p>
          <Link to="/explore" className="btn-primary text-xs">
            Explore Deals
          </Link>
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
