import { useState } from 'react';
import { Package, TrendingUp, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { calculateDiscount } from '../utils/discountEngine';
import { calculateRescueRecommendation } from '../utils/rescueEngine';
import { useAppContext } from '../context/useAppContext';
import { useAuth } from '../context/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { isProductPurchasable } from '../utils/eligibility';

const SellerDashboard = () => {
  const { products, orders, updateProduct } = useAppContext();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const routeTab = location.pathname.includes('/products/new') ? 'add-product' : location.pathname.includes('/products') ? 'products' : location.pathname.includes('/orders') ? 'orders' : location.pathname.includes('/rescue-deals') ? 'rescue-deals' : location.pathname.includes('/feed-rescue') ? 'feed-rescue' : location.pathname.includes('/analytics') ? 'analytics' : location.pathname.includes('/settings') ? 'settings' : 'overview';
  const activeTab = routeTab;
  const sellerName = user?.businessName ?? 'FreshBake Bakery';
  const sellerProducts = products.filter((product) => product.sellerName === sellerName);
  const sellerProductIds = new Set(sellerProducts.map((product) => product.id));
  const sellerOrders = orders.filter((order) => order.items.some((item) => sellerProductIds.has(item.product.id)));
  const sellerRevenue = sellerOrders.reduce((total, order) => total + order.items.filter((item) => sellerProductIds.has(item.product.id)).reduce((sum, item) => sum + item.product.rescuePrice * item.quantity, 0), 0);
  const sellerUnits = sellerOrders.reduce((total, order) => total + order.items.filter((item) => sellerProductIds.has(item.product.id)).reduce((sum, item) => sum + item.quantity, 0), 0);
  const sellerKg = sellerProducts.reduce((total, product) => total + (product.availableWeightKg ?? 0), 0);
  const activeListings = sellerProducts.filter(isProductPurchasable).length;
  const sellerStats = [
    { label: 'Revenue Recovered', value: `₹${sellerRevenue.toFixed(0)}`, icon: DollarSign, color: 'text-brand-fresh' },
    { label: 'Products Rescued', value: String(sellerUnits), icon: Package, color: 'text-accent-warning' },
    { label: 'Food Listed (kg)', value: sellerKg ? sellerKg.toFixed(1) : '—', icon: TrendingUp, color: 'text-brand-forest' },
    { label: 'Active Listings', value: String(activeListings), icon: Clock, color: 'text-accent-amber' },
  ];

  return (
    <div className="bg-surface-ivory min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface-white border-r border-border shrink-0">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-display font-bold text-brand-forest">Seller Hub</h2>
          <p className="text-sm text-text-secondary">{sellerName}</p>
        </div>
        <nav className="p-4 space-y-2">
          {['overview', 'products', 'add-product', 'rescue-deals', 'orders', 'feed-rescue', 'analytics', 'settings'].map(tab => (
            <button 
              key={tab}
              onClick={() => navigate(tab === 'overview' ? '/seller/dashboard' : tab === 'add-product' ? '/seller/products/new' : `/seller/${tab}`)}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                activeTab === tab ? 'bg-brand-forest/10 text-brand-forest' : 'text-text-secondary hover:bg-surface-ivory hover:text-text-primary'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Turn surplus into recovered revenue.</h1>
        <p className="text-text-secondary mb-8">Manage your rescue deals and track your impact.</p>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sellerStats.map(stat => (
                /*
                { label: 'Revenue Recovered', value: '₹12,450', icon: DollarSign, color: 'text-brand-fresh' },
                { label: 'Products Rescued', value: '185', icon: Package, color: 'text-accent-warning' },
                { label: 'Food Rescued (kg)', value: '42.5', icon: TrendingUp, color: 'text-brand-forest' },
                { label: 'Active Listings', value: '8', icon: Clock, color: 'text-accent-amber' },
                */<div key={stat.label} className="bg-surface-white p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-surface-ivory ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary font-medium mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Alerts */}
            <div className="bg-accent-warning/10 border border-accent-warning/20 rounded-2xl p-6 flex gap-4">
              <AlertCircle className="text-accent-warning shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-text-primary mb-1">Items approaching sale deadline</h4>
                <p className="text-sm text-text-secondary">You have 3 items whose applicable sale deadline is within 48 hours. Consider accepting the recommended final rescue discount.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-surface-white rounded-3xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6"><div><h2 className="text-2xl font-bold">Your listings</h2><p className="text-text-secondary">Manage the products currently associated with your business.</p></div><button type="button" className="btn-primary" onClick={() => navigate('/seller/products/new')}>Add product</button></div>
            {sellerProducts.length > 0 ? <div className="space-y-3">{sellerProducts.map((product) => <div key={product.id} className="flex flex-col sm:flex-row sm:items-center gap-4 border border-border rounded-xl p-4"><img src={product.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover" /><div className="flex-1"><h3 className="font-bold">{product.name}</h3><p className="text-sm text-text-secondary">{product.category} · {product.availableQuantity} available</p></div><span className={`badge ${product.isPaused || product.availableQuantity === 0 ? 'bg-accent-warning/15 text-accent-warning' : 'bg-brand-forest/10 text-brand-forest'}`}>{product.isPaused ? 'Paused' : product.availableQuantity === 0 ? 'Sold out' : 'Live'}</span><span className="font-bold text-brand-forest">₹{product.rescuePrice.toFixed(2)}</span><div className="flex gap-2"><button type="button" onClick={() => updateProduct(product.id, { isPaused: !product.isPaused }, user?.id ?? '')} className="btn-secondary px-3 py-2 text-xs">{product.isPaused ? 'Resume' : 'Pause'}</button><button type="button" onClick={() => updateProduct(product.id, { availableQuantity: 0 }, user?.id ?? '')} disabled={product.availableQuantity === 0} className="btn-secondary px-3 py-2 text-xs disabled:opacity-50">Sold out</button></div></div>)}</div> : <p className="text-text-secondary">No listings yet.</p>}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-surface-white rounded-3xl border border-border p-6 shadow-sm"><h2 className="text-2xl font-bold mb-2">Customer orders</h2><p className="text-text-secondary mb-6">Orders containing your products appear here.</p>{sellerOrders.length > 0 ? <div className="space-y-3">{sellerOrders.map((order) => <div key={order.id} className="border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3"><div className="flex-1"><h3 className="font-bold">{order.id}</h3><p className="text-sm text-text-secondary">{order.customer.name} · {order.items.filter((item) => sellerProductIds.has(item.product.id)).map((item) => `${item.quantity}× ${item.product.name}`).join(', ')}</p></div><span className="badge bg-brand-forest/10 text-brand-forest">{order.status}</span><span className="font-bold">₹{order.total.toFixed(2)}</span></div>)}</div> : <p className="text-text-secondary">No customer orders yet.</p>}</div>
        )}

        {activeTab === 'add-product' && (
          <AddProductForm onPublished={() => navigate('/seller/dashboard')} />
        )}

        {['rescue-deals', 'feed-rescue', 'analytics', 'settings'].includes(activeTab) && (
          <div className="bg-surface-white rounded-3xl border border-border p-8 shadow-sm"><p className="text-xs uppercase tracking-widest text-brand-forest font-bold mb-3">Seller workspace</p><h2 className="text-2xl font-display font-extrabold mb-3">{activeTab.replace('-', ' ')}</h2><p className="text-text-secondary max-w-xl mb-6">This seller workspace is ready for shared product and order data. Connect the backend provider to enable production fulfilment, analytics, and verification workflows.</p><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><div className="rounded-xl bg-surface-ivory p-4"><p className="text-xs text-text-secondary mb-2">Status</p><p className="font-bold text-brand-fresh">Demo ready</p></div><div className="rounded-xl bg-surface-ivory p-4"><p className="text-xs text-text-secondary mb-2">Listings</p><p className="font-bold">{sellerProducts.length}</p></div><div className="rounded-xl bg-surface-ivory p-4"><p className="text-xs text-text-secondary mb-2">Orders</p><p className="font-bold">{orders.length}</p></div></div></div>
        )}
      </main>
    </div>
  );
};

const AddProductForm = ({ onPublished }: { onPublished: () => void }) => {
  const { addProduct } = useAppContext();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Bakery',
    originalPrice: '',
    bestBefore: '',
    pickupDeadline: '',
    minimumPrice: '',
    quantity: '1',
  });

  const recommendation = formData.originalPrice && formData.bestBefore 
    ? calculateDiscount(Number(formData.originalPrice), formData.bestBefore)
    : null;
  const rescueRecommendation = formData.originalPrice && formData.pickupDeadline && formData.minimumPrice
    ? calculateRescueRecommendation({ id: 'draft', name: formData.name, sellerName: user?.businessName ?? 'Seller', originalPrice: Number(formData.originalPrice), rescuePrice: recommendation?.recommendedRescuePrice ?? Number(formData.originalPrice), discountPercentage: recommendation?.recommendedDiscountPercentage ?? 0, bestBefore: formData.bestBefore, pickupDeadline: new Date(formData.pickupDeadline).toISOString(), availableQuantity: Number(formData.quantity), imageUrl: '', category: formData.category, isEligibleForSale: true, minimumAcceptablePrice: Number(formData.minimumPrice), pathway: 'human' })
    : null;

  return (
    <div className="bg-surface-white rounded-3xl border border-border overflow-hidden max-w-3xl shadow-sm">
      <div className="border-b border-border flex">
        {[1, 2, 3].map(s => (
          <div key={s} className={`flex-1 p-4 text-center text-sm font-semibold border-b-2 transition-colors ${step === s ? 'border-brand-forest text-brand-forest' : 'border-transparent text-text-secondary'}`}>
            Step {s}
          </div>
        ))}
      </div>
      
      <div className="p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-text-primary">Product Information</h3>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Product Name</label>
              <input 
                type="text" 
                className="w-full border border-border rounded-xl p-3 bg-surface-ivory focus:outline-none focus:ring-2 focus:ring-brand-forest/50" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Category</label>
                <select
                  className="w-full border border-border rounded-xl p-3 bg-surface-ivory focus:outline-none focus:ring-2 focus:ring-brand-forest/50"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {['Bakery', 'Fruits & Vegetables', 'Dairy', 'Meals', 'Beverages', 'Snacks'].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Minimum acceptable rescue price (₹)</label>
                <input type="number" min="1" className="w-full border border-border rounded-xl p-3 bg-surface-ivory focus:outline-none focus:ring-2 focus:ring-brand-forest/50" value={formData.minimumPrice} onChange={e => setFormData({...formData, minimumPrice: e.target.value})} placeholder="100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Original Price (₹)</label>
                <input 
                  type="number" 
                  className="w-full border border-border rounded-xl p-3 bg-surface-ivory focus:outline-none focus:ring-2 focus:ring-brand-forest/50" 
                  value={formData.originalPrice}
                  onChange={e => setFormData({...formData, originalPrice: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Quantity</label>
                <input 
                  type="number" 
                  className="w-full border border-border rounded-xl p-3 bg-surface-ivory focus:outline-none focus:ring-2 focus:ring-brand-forest/50" 
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                />
              </div>
            </div>
            <button
              className="btn-primary w-full mt-6"
              disabled={!formData.name.trim() || Number(formData.originalPrice) <= 0 || Number(formData.quantity) <= 0}
              onClick={() => setStep(2)}
            >
              Next Step
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-text-primary">Dates & Eligibility</h3>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Best Before Date</label>
              <input 
                type="date" 
                className="w-full border border-border rounded-xl p-3 bg-surface-ivory focus:outline-none focus:ring-2 focus:ring-brand-forest/50" 
                value={formData.bestBefore}
                onChange={e => setFormData({...formData, bestBefore: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Pickup / rescue deadline</label>
              <input type="datetime-local" className="w-full border border-border rounded-xl p-3 bg-surface-ivory focus:outline-none focus:ring-2 focus:ring-brand-forest/50" value={formData.pickupDeadline} onChange={e => setFormData({...formData, pickupDeadline: e.target.value})} />
            </div>
            
            {formData.bestBefore && recommendation && (
              <div className="bg-brand-forest/5 border border-brand-forest/20 rounded-2xl p-6 mt-6">
                <h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <DollarSign size={20} className="text-brand-forest" />
                  Smart Pricing Recommendation
                </h4>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-surface-white p-3 rounded-xl border border-border">
                    <span className="block text-xs text-text-secondary mb-1">Recommended Discount</span>
                    <span className="text-lg font-bold text-brand-forest">{recommendation.recommendedDiscountPercentage}% OFF</span>
                  </div>
                  <div className="bg-surface-white p-3 rounded-xl border border-border">
                    <span className="block text-xs text-text-secondary mb-1">Rescue Price</span>
                    <span className="text-lg font-bold text-text-primary">₹{recommendation.recommendedRescuePrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <p className="text-sm text-text-secondary bg-surface-white p-3 rounded-xl border border-border italic">
                  {recommendation.reason}
                </p>
              </div>
            )}
            {rescueRecommendation && <div className="bg-brand-lime/10 border border-brand-lime/20 rounded-2xl p-6"><p className="eyebrow mb-2">Smart Rescue Engine</p><p className="font-bold text-lg mb-2">{rescueRecommendation.label} rescue priority · {rescueRecommendation.score}/100</p><p className="text-sm text-text-secondary">{rescueRecommendation.explanation} Seller floor protected at ₹{formData.minimumPrice}.</p></div>}
            
            <div className="flex gap-4 mt-6">
              <button className="btn-secondary flex-1" onClick={() => setStep(1)}>Back</button>
              <button
                className="btn-primary flex-1"
                disabled={!recommendation?.isEligible || !rescueRecommendation || rescueRecommendation.score === null}
                onClick={() => setStep(3)}
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-text-primary">Review & Publish</h3>
            
            <div className="bg-surface-ivory p-6 rounded-2xl border border-border space-y-4">
              <div className="flex justify-between border-b border-border pb-4">
                <span className="text-text-secondary">Product</span>
                <span className="font-semibold text-text-primary">{formData.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-4">
                <span className="text-text-secondary">Quantity</span>
                <span className="font-semibold text-text-primary">{formData.quantity} items</span>
              </div>
              <div className="flex justify-between border-b border-border pb-4">
                <span className="text-text-secondary">Original Price</span>
                <span className="font-semibold text-text-primary line-through">₹{formData.originalPrice}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-4">
                <span className="text-text-secondary">Rescue Price</span>
                <span className="font-bold text-brand-forest text-lg">₹{recommendation?.recommendedRescuePrice.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-text-secondary">Expected Revenue</span>
                <span className="font-bold text-text-primary">₹{((recommendation?.recommendedRescuePrice || 0) * Number(formData.quantity)).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button className="btn-secondary flex-1" onClick={() => setStep(2)}>Back</button>
              <button 
                className="btn-primary flex-1"
                onClick={() => {
                  const newProduct = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: formData.name,
                    sellerName: user?.businessName ?? 'FreshBake Bakery',
                    originalPrice: Number(formData.originalPrice),
                    rescuePrice: Math.max(Number(formData.minimumPrice), recommendation?.recommendedRescuePrice || 0),
                    discountPercentage: recommendation?.recommendedDiscountPercentage || 0,
                    bestBefore: formData.bestBefore ? new Date(formData.bestBefore).toISOString() : new Date().toISOString(),
                    pickupDeadline: formData.pickupDeadline ? new Date(formData.pickupDeadline).toISOString() : new Date().toISOString(),
                    availableQuantity: Number(formData.quantity),
                    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
                    category: formData.category,
                    distance: '0.5 km',
                    isEligibleForSale: true,
                    sellerId: user?.id
                    , pathway: 'human' as const,
                    minimumAcceptablePrice: Number(formData.minimumPrice),
                    pickupInstructions: 'Follow the collection instructions shown after publishing.',
                    collectionLocation: user?.businessAddress,
                  };
                  addProduct(newProduct);
                  onPublished();
                  setStep(1);
                  setFormData({ name: '', category: 'Bakery', originalPrice: '', quantity: '1', bestBefore: '', pickupDeadline: '', minimumPrice: '' });
                }}
              >Publish Listing</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
