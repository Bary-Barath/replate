import { useState } from 'react';
import { Activity, CheckCircle2, Package, ShieldCheck, Users, Sliders } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import { ProductManagement } from '../components/ProductManagement';

const AdminDashboard = () => {
  const { products, orders } = useAppContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'moderation'>('overview');

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalUnits = orders.reduce((sum, o) => sum + o.items.reduce((s, it) => s + it.quantity, 0), 0);
  const liveListings = products.filter((p) => !p.isPaused && p.availableQuantity > 0).length;

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-mint font-extrabold">Administrator Console</span>
              <span className="text-xs text-text-secondary">• Live Platform Moderation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-text-primary tracking-tight">
              Keep the marketplace healthy.
            </h1>
            <p className="text-text-secondary mt-2">
              Oversee inventory, moderate rescue deals, and protect food-safety standards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/explore" className="btn-secondary text-sm">
              View Public Marketplace
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="glass-panel rounded-2xl p-1.5 flex gap-2 mb-8 max-w-xl">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'products', label: 'Manage All Products', icon: Package },
            { id: 'orders', label: 'Platform Orders', icon: Sliders },
            { id: 'moderation', label: 'Safety & Moderation', icon: ShieldCheck },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === id
                  ? 'bg-brand-forest text-surface-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-white/60'
              }`}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: 'Active Rescue Listings', value: liveListings, icon: Package, color: 'text-brand-forest' },
                { label: 'Total Orders Completed', value: orders.length, icon: Activity, color: 'text-brand-forest' },
                { label: 'Total Units Rescued', value: totalUnits, icon: ShieldCheck, color: 'text-accent-warning' },
                { label: 'Gross Rescued Value', value: `₹${totalRevenue.toFixed(0)}`, icon: Users, color: 'text-brand-forest' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="glass-panel-solid rounded-3xl p-6 border border-glass-border">
                  <div className={`w-10 h-10 rounded-2xl bg-brand-mint/60 flex items-center justify-center mb-4 ${color}`}>
                    <Icon size={20} />
                  </div>
                  <p className="text-text-secondary text-xs uppercase tracking-wider font-semibold mb-1">{label}</p>
                  <p className="text-3xl font-display font-extrabold text-text-primary">{value}</p>
                </div>
              ))}
            </div>

            {/* Platform Health and Policy Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-panel-solid rounded-3xl p-7 border border-glass-border">
                <h2 className="text-xl font-bold font-display text-text-primary mb-4">Operations & Compliance Checklist</h2>
                <div className="space-y-3.5">
                  {[
                    'Database Row-Level Security (RLS) active across all public queries',
                    'Automatic rejection for items with expired best-before and pickup deadlines',
                    'Atomic RPC stock reservation preventing double-selling on high demand items',
                    'Storage bucket image policies enforcing authenticated uploads with MIME restrictions',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 border-b border-border/40 pb-3 text-sm">
                      <CheckCircle2 className="text-brand-forest shrink-0" size={18} />
                      <span className="text-text-primary font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-7 border border-glass-border bg-gradient-to-br from-brand-mint/40 to-surface-white/60">
                <div className="flex items-center gap-2 text-brand-forest font-bold mb-2">
                  <ShieldCheck size={20} />
                  <span>Security & Authority</span>
                </div>
                <h3 className="font-bold text-lg text-text-primary mb-2">Verified Admin Scope</h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  Admin authorization is backed by database role assignment. Client-side state cannot elevate customer or seller credentials without matching PostgreSQL permissions.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="btn-primary w-full text-xs py-2.5"
                >
                  Inspect All Products
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="animate-fadeIn">
            <ProductManagement sellerOnly={false} />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="glass-panel-solid rounded-3xl p-6 border border-glass-border animate-fadeIn">
            <h2 className="text-2xl font-bold font-display text-text-primary mb-2">Marketplace Orders</h2>
            <p className="text-sm text-text-secondary mb-6">Live order history across all platform businesses.</p>

            {orders.length === 0 ? (
              <p className="text-text-secondary text-sm">No orders recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-text-primary">{o.id}</span>
                        <span className="badge badge-mint">{o.status}</span>
                      </div>
                      <p className="text-xs text-text-secondary">
                        Customer: <span className="font-medium text-text-primary">{o.customer.name}</span> ({o.customer.email}) • {new Date(o.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        Items: {o.items.map((it) => `${it.quantity}× ${it.product.name}`).join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-extrabold text-brand-forest">₹{o.total.toFixed(2)}</span>
                      <p className="text-[11px] text-text-secondary">Platform fee: ₹{o.platformFee.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'moderation' && (
          <div className="glass-panel-solid rounded-3xl p-8 border border-glass-border animate-fadeIn space-y-6">
            <div>
              <span className="eyebrow">Listing Eligibility Standards</span>
              <h2 className="text-2xl font-bold font-display text-text-primary mt-1">Food Safety Protocol</h2>
              <p className="text-sm text-text-secondary mt-1">
                RePlate enforces strict separation between human rescue food and feed diversion.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl p-5 bg-surface-secondary/70 border border-border-emeraldSubtle">
                <h4 className="font-bold text-sm text-text-primary mb-2">Best Before vs Use-By Distinction</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Best-before dates indicate sensory peak quality; use-by dates define microbiological safety. Listings with passed use-by dates are automatically removed by the rescue engine and cannot be purchased.
                </p>
              </div>

              <div className="rounded-2xl p-5 bg-surface-secondary/70 border border-border-emeraldSubtle">
                <h4 className="font-bold text-sm text-text-primary mb-2">Safe Archival vs Permanent Deletion</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Products referenced in customer orders cannot be permanently deleted. Instead, the system safely marks them as archived, preserving auditability and customer order records.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
