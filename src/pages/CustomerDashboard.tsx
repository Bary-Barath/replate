import { ArrowRight, Leaf, Package, PiggyBank, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';

const CustomerDashboard = () => {
  const { orders } = useAppContext();
  const saved = orders.reduce(
    (total, order) =>
      total +
      order.items.reduce(
        (sum, item) => sum + (item.product.originalPrice - item.product.rescuePrice) * item.quantity,
        0
      ),
    0
  );
  const quantity = orders.reduce(
    (total, order) => total + order.items.reduce((sum, item) => sum + item.quantity, 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Light Emerald Welcome Banner */}
      <div className="glass-panel-solid rounded-3xl p-7 md:p-9 border border-glass-border flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-br from-brand-mint/60 via-surface-white/90 to-brand-mint/30 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-surface-white/80 border border-brand-forest/20 text-brand-forest text-xs font-bold mb-3">
            <Sparkles size={12} />
            <span>Your Rescue Journey</span>
          </div>
          <h2 className="text-3xl font-display font-extrabold text-text-primary mb-2">
            Small choices, meaningful impact.
          </h2>
          <p className="text-text-secondary text-sm max-w-xl">
            Every rescue order diverts quality food from landfills and returns value directly to local neighborhood bakeries and markets.
          </p>
        </div>
        <Link to="/explore" className="btn-primary text-xs py-3 px-6 shrink-0 shadow-sm">
          Explore Deals <ArrowRight size={15} className="ml-1.5" />
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Orders Rescued', value: orders.length, icon: Package },
          { label: 'Money Saved', value: `₹${saved.toFixed(0)}`, icon: PiggyBank },
          { label: 'Items Kept in Circulation', value: quantity, icon: Leaf },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass-panel-solid rounded-2xl p-5 border border-glass-border shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-brand-mint/70 flex items-center justify-center text-brand-forest mb-3">
              <Icon size={20} strokeWidth={2} />
            </div>
            <p className="text-xs uppercase tracking-wider text-text-secondary font-bold mb-1">{label}</p>
            <p className="text-3xl font-display font-extrabold text-text-primary">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders Overview */}
      <div className="glass-panel-solid rounded-2xl p-6 border border-glass-border shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold font-display text-text-primary">Recent Orders</h3>
            <p className="text-xs text-text-secondary">Your latest rescued meals</p>
          </div>
          <Link to="/customer/orders" className="text-xs font-bold text-brand-forest hover:underline">
            View All
          </Link>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-secondary/40 border border-border-emeraldSubtle"
              >
                <div>
                  <p className="font-bold text-xs text-text-primary">{order.id}</p>
                  <p className="text-[11px] text-text-secondary">
                    {order.items.length} item(s) • {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-extrabold text-sm text-brand-forest">₹{order.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-surface-secondary/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-border-emeraldSubtle">
            <div>
              <p className="font-bold text-sm text-text-primary">Your first rescue is waiting</p>
              <p className="text-xs text-text-secondary">Browse nearby deals and start saving food today.</p>
            </div>
            <Link to="/explore" className="btn-primary text-xs py-2 px-5 shrink-0">
              Browse Deals
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
