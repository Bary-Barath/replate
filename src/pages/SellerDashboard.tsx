import { useState } from 'react';
import { Package, TrendingUp, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { calculateDiscount } from '../utils/discountEngine';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
  const { addProduct } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="bg-surface-ivory min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface-white border-r border-border shrink-0">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-display font-bold text-brand-forest">Seller Hub</h2>
          <p className="text-sm text-text-secondary">FreshBake Bakery</p>
        </div>
        <nav className="p-4 space-y-2">
          {['overview', 'products', 'add-product', 'orders'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
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
              {[
                { label: 'Revenue Recovered', value: '₹12,450', icon: DollarSign, color: 'text-brand-fresh' },
                { label: 'Products Rescued', value: '185', icon: Package, color: 'text-accent-warning' },
                { label: 'Food Rescued (kg)', value: '42.5', icon: TrendingUp, color: 'text-brand-forest' },
                { label: 'Active Listings', value: '8', icon: Clock, color: 'text-accent-amber' },
              ].map(stat => (
                <div key={stat.label} className="bg-surface-white p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4">
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

        {activeTab === 'add-product' && <AddProductForm />}
      </main>
    </div>
  );
};

const AddProductForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    originalPrice: '',
    bestBefore: '',
    quantity: '1',
  });

  const recommendation = formData.originalPrice && formData.bestBefore 
    ? calculateDiscount(Number(formData.originalPrice), formData.bestBefore)
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
            <button className="btn-primary w-full mt-6" onClick={() => setStep(2)}>Next Step</button>
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
            
            <div className="flex gap-4 mt-6">
              <button className="btn-secondary flex-1" onClick={() => setStep(1)}>Back</button>
              <button className="btn-primary flex-1" onClick={() => setStep(3)}>Next Step</button>
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
                    sellerName: 'FreshBake Bakery',
                    originalPrice: Number(formData.originalPrice),
                    rescuePrice: recommendation?.recommendedRescuePrice || 0,
                    discountPercentage: recommendation?.recommendedDiscountPercentage || 0,
                    bestBefore: formData.bestBefore ? new Date(formData.bestBefore).toISOString() : new Date().toISOString(),
                    availableQuantity: Number(formData.quantity),
                    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
                    category: formData.category,
                    distance: '0.5 km',
                    isEligibleForSale: true
                  };
                  addProduct(newProduct);
                  setActiveTab('overview');
                  setStep(1);
                  setFormData({ name: '', category: 'Bakery', originalPrice: '', quantity: '', bestBefore: '' });
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
