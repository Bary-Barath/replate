import { Package, TrendingUp, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/useAppContext';
import { useAuth } from '../context/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { isProductPurchasable } from '../utils/eligibility';
import { ProductManagement } from '../components/ProductManagement';
import ProductImage from '../components/ProductImage';

const SellerDashboard = () => {
  const { products, orders } = useAppContext();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const routeTab = location.pathname.includes('/products/new')
    ? 'add-product'
    : location.pathname.includes('/products')
    ? 'products'
    : location.pathname.includes('/orders')
    ? 'orders'
    : location.pathname.includes('/rescue-deals')
    ? 'rescue-deals'
    : location.pathname.includes('/feed-rescue')
    ? 'feed-rescue'
    : location.pathname.includes('/analytics')
    ? 'analytics'
    : location.pathname.includes('/settings')
    ? 'settings'
    : 'overview';

  const activeTab = routeTab;
  const sellerName = user?.businessName ?? 'FreshBake Bakery';
  const sellerProducts = products.filter(
    (product) =>
      product.sellerName === sellerName ||
      (product.sellerId && user?.id && product.sellerId === user.id) ||
      (!product.sellerId && product.sellerName === 'FreshBake Bakery')
  );
  const sellerProductIds = new Set(sellerProducts.map((product) => product.id));
  const sellerOrders = orders.filter((order) =>
    order.items.some((item) => sellerProductIds.has(item.product.id))
  );

  const sellerRevenue = sellerOrders.reduce(
    (total, order) =>
      total +
      order.items
        .filter((item) => sellerProductIds.has(item.product.id))
        .reduce((sum, item) => sum + item.product.rescuePrice * item.quantity, 0),
    0
  );

  const sellerUnits = sellerOrders.reduce(
    (total, order) =>
      total +
      order.items
        .filter((item) => sellerProductIds.has(item.product.id))
        .reduce((sum, item) => sum + item.quantity, 0),
    0
  );

  const sellerKg = sellerProducts.reduce(
    (total, product) => total + (product.availableWeightKg ?? 0.5 * product.availableQuantity),
    0
  );
  const activeListings = sellerProducts.filter(isProductPurchasable).length;

  const sellerStats = [
    { label: 'Revenue Recovered', value: `₹${sellerRevenue.toFixed(0)}`, icon: DollarSign, color: 'text-brand-forest' },
    { label: 'Products Rescued', value: String(sellerUnits), icon: Package, color: 'text-accent-warning' },
    { label: 'Food Listed (kg)', value: sellerKg ? sellerKg.toFixed(1) : '—', icon: TrendingUp, color: 'text-brand-forest' },
    { label: 'Active Listings', value: String(activeListings), icon: Clock, color: 'text-brand-forest' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 glass-panel border-r border-glass-border shrink-0 p-6">
        <div className="pb-6 border-b border-glass-border mb-6">
          <span className="eyebrow">Seller Hub</span>
          <h2 className="text-xl font-display font-extrabold text-brand-forest truncate">{sellerName}</h2>
          <p className="text-xs text-text-secondary mt-1">Verified Partner</p>
        </div>

        <nav className="space-y-1.5">
          {[
            { id: 'overview', label: 'Overview', path: '/seller/dashboard' },
            { id: 'products', label: 'My Listings', path: '/seller/products' },
            { id: 'add-product', label: 'Add Deal', path: '/seller/products/new' },
            { id: 'orders', label: 'Orders', path: '/seller/orders' },
            { id: 'rescue-deals', label: 'Rescue Radar', path: '/seller/rescue-deals' },
            { id: 'feed-rescue', label: 'Feed Rescue', path: '/seller/feed-rescue' },
            { id: 'analytics', label: 'Analytics', path: '/seller/analytics' },
            { id: 'settings', label: 'Settings', path: '/seller/settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-xs capitalize transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-brand-forest text-surface-white shadow-sm'
                  : 'text-text-secondary hover:bg-surface-white/70 hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-text-primary">
            Turn surplus into recovered revenue.
          </h1>
          <p className="text-text-secondary mt-1">
            Manage your rescue deals, upload product imagery, and track customer collections.
          </p>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {sellerStats.map((stat) => (
                <div key={stat.label} className="glass-panel-solid rounded-3xl p-6 border border-glass-border">
                  <div className={`p-3 rounded-2xl bg-brand-mint/60 w-fit mb-3 ${stat.color}`}>
                    <stat.icon size={22} />
                  </div>
                  <p className="text-xs uppercase tracking-wider text-text-secondary font-semibold mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-display font-extrabold text-text-primary">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Expiring Listings Alert */}
            <div className="bg-brand-mint/50 border border-brand-forest/20 rounded-3xl p-6 flex items-start gap-4 shadow-sm">
              <AlertCircle className="text-brand-forest shrink-0 mt-0.5" size={22} />
              <div>
                <h4 className="font-bold text-text-primary text-sm mb-1">Smart Rescue Urgency</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  You have active listings approaching their scheduled pickup deadline. RePlate's smart pricing
                  recommends final discounts to accelerate rescues and avoid food waste.
                </p>
              </div>
            </div>

            {/* Quick Listings View */}
            <div className="glass-panel-solid rounded-3xl p-6 border border-glass-border">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold font-display text-xl text-text-primary">Active Rescue Deals</h3>
                  <p className="text-xs text-text-secondary">Your current surplus listings live in the marketplace</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/seller/products')}
                  className="btn-secondary text-xs"
                >
                  Manage All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sellerProducts.slice(0, 4).map((product) => (
                  <div key={product.id} className="card p-4 flex items-center gap-4 bg-surface-white/80">
                    <ProductImage
                      src={product.imageUrl}
                      alt={product.name}
                      productName={product.name}
                      className="w-16 h-16 rounded-2xl shrink-0 border border-glass-border"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-text-primary truncate">{product.name}</h4>
                      <p className="text-xs text-text-secondary">{product.category} • {product.availableQuantity} left</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-extrabold text-brand-forest text-sm">
                          ₹{product.rescuePrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-text-secondary line-through">
                          ₹{product.originalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'products' || activeTab === 'add-product') && (
          <div className="animate-fadeIn">
            <ProductManagement sellerOnly={true} />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="glass-panel-solid rounded-3xl p-6 border border-glass-border animate-fadeIn">
            <h2 className="text-2xl font-bold font-display text-text-primary mb-2">Customer Rescue Orders</h2>
            <p className="text-sm text-text-secondary mb-6">Orders containing your products appear here.</p>

            {sellerOrders.length > 0 ? (
              <div className="space-y-4">
                {sellerOrders.map((order) => {
                  const relevantItems = order.items.filter((item) => sellerProductIds.has(item.product.id));
                  return (
                    <div key={order.id} className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-brand-mint/60 flex items-center justify-center text-brand-forest shrink-0 font-bold text-sm">
                          {relevantItems.length}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-text-primary">{order.id}</h3>
                            <span className="badge badge-mint">{order.status}</span>
                          </div>
                          <p className="text-xs text-text-secondary">
                            Customer: {order.customer.name} ({order.customer.phone})
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {relevantItems.map((item) => (
                              <div key={item.product.id} className="flex items-center gap-2 bg-surface-secondary/60 rounded-xl px-2.5 py-1 text-xs">
                                <ProductImage
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  productName={item.product.name}
                                  className="w-5 h-5 rounded-md"
                                />
                                <span className="font-medium text-text-primary">
                                  {item.quantity}× {item.product.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-extrabold text-brand-forest">
                          ₹{relevantItems.reduce((s, it) => s + it.product.rescuePrice * it.quantity, 0).toFixed(2)}
                        </span>
                        <p className="text-[11px] text-text-secondary">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-text-secondary text-sm">No customer orders placed yet.</p>
            )}
          </div>
        )}

        {['rescue-deals', 'feed-rescue', 'analytics', 'settings'].includes(activeTab) && (
          <div className="glass-panel-solid rounded-3xl p-8 border border-glass-border animate-fadeIn">
            <span className="eyebrow">Seller Operations</span>
            <h2 className="text-2xl font-display font-extrabold text-text-primary mb-3 capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
            <p className="text-sm text-text-secondary max-w-xl mb-6">
              Track business performance, manage collection schedules, and inspect revenue recovery trends.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-surface-secondary/60 p-4 border border-border-emeraldSubtle">
                <p className="text-xs text-text-secondary mb-1">Active Products</p>
                <p className="text-2xl font-bold font-display text-brand-forest">{sellerProducts.length}</p>
              </div>
              <div className="rounded-2xl bg-surface-secondary/60 p-4 border border-border-emeraldSubtle">
                <p className="text-xs text-text-secondary mb-1">Fulfilled Orders</p>
                <p className="text-2xl font-bold font-display text-brand-forest">{sellerOrders.length}</p>
              </div>
              <div className="rounded-2xl bg-surface-secondary/60 p-4 border border-border-emeraldSubtle">
                <p className="text-xs text-text-secondary mb-1">Recovered Revenue</p>
                <p className="text-2xl font-bold font-display text-brand-forest">₹{sellerRevenue.toFixed(0)}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SellerDashboard;
