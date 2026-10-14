import { useState } from 'react';
import { ArrowLeft, CheckCircle, ShieldCheck, MapPin, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CustomerInfo, Order } from '../types';
import { useAppContext } from '../context/useAppContext';
import { useAuth } from '../context/useAuth';
import ProductImage from '../components/ProductImage';

const Checkout = () => {
  const { cart, cartTotal, platformFee, placeOrderAsync } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CustomerInfo>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    pickupPreference: 'standard',
  });

  if (cart.length === 0 && !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-display font-extrabold text-text-primary mb-3">Nothing to check out</h2>
        <p className="text-text-secondary mb-8">Add a rescue deal to your cart first.</p>
        <button type="button" onClick={() => navigate('/explore')} className="btn-primary">
          Explore Deals
        </button>
      </div>
    );
  }

  if (order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="glass-panel-solid rounded-3xl p-10 max-w-lg w-full border border-glass-border shadow-lg">
          <div className="w-20 h-20 rounded-full bg-brand-mint/70 flex items-center justify-center mx-auto mb-6 text-brand-forest">
            <CheckCircle size={44} />
          </div>
          <span className="eyebrow mb-2">Order Confirmed</span>
          <h1 className="text-3xl font-display font-extrabold text-text-primary mb-3">Rescue Reserved!</h1>
          <p className="text-text-secondary text-sm mb-6">
            Thanks for rescuing food today, <span className="font-bold text-text-primary">{order.customer.name}</span>.
            Your order is confirmed and reserved in the store inventory.
          </p>

          <div className="bg-surface-secondary/70 rounded-2xl p-5 mb-6 text-left border border-border-emeraldSubtle space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-text-secondary">Order Reference:</span>
              <span className="font-bold text-text-primary">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Total Paid:</span>
              <span className="font-bold text-brand-forest">₹{order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Pickup Preference:</span>
              <span className="font-semibold capitalize text-text-primary">{order.customer.pickupPreference} pickup</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/customer/orders')} className="btn-secondary flex-1 text-xs">
              View Order History
            </button>
            <button type="button" onClick={() => navigate('/explore')} className="btn-primary flex-1 text-xs">
              Continue Rescuing
            </button>
          </div>
        </div>
      </div>
    );
  }

  const updateField = (field: keyof CustomerInfo, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.includes('@') || formData.phone.trim().length < 7) {
      setError('Please provide a complete name, valid email address, and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await placeOrderAsync(formData);
      if (res.error || !res.order) {
        setError(res.error || 'Failed to complete order.');
      } else {
        setOrder(res.order);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Checkout encountered an error';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalTotal = cartTotal + platformFee;

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
      <button
        type="button"
        onClick={() => navigate('/customer/cart')}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8 text-sm font-semibold transition-colors"
      >
        <ArrowLeft size={18} /> Back to Cart
      </button>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Checkout Form */}
        <div className="flex-grow">
          <div className="mb-8">
            <span className="eyebrow">Store Collection Details</span>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-text-primary tracking-tight">
              Order Confirmation
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-accent-coral/70 border border-accent-amber/30 text-accent-amber text-xs font-semibold flex items-center gap-2">
              <AlertTriangle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-panel-solid rounded-3xl p-6 sm:p-8 border border-glass-border space-y-4">
              <h2 className="font-bold font-display text-lg text-text-primary mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-brand-forest" /> Pickup Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-glass-border bg-surface-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-glass-border bg-surface-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-glass-border bg-surface-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Collection Preference</label>
                  <select
                    value={formData.pickupPreference}
                    onChange={(e) => updateField('pickupPreference', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-glass-border bg-surface-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-forest/20"
                  >
                    <option value="standard">Standard counter collection</option>
                    <option value="contactless">Contactless grab-and-go</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-4 text-base font-bold shadow-md cursor-pointer"
            >
              {isSubmitting ? 'Confirming and Validating Stock...' : `Reserve & Confirm · ₹${finalTotal.toFixed(2)}`}
            </button>

            <div className="p-4 rounded-2xl bg-surface-secondary/60 border border-border-emeraldSubtle text-xs text-text-secondary flex items-start gap-3">
              <ShieldCheck size={18} className="text-brand-forest shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-text-primary mb-0.5">Verified In-Store Pickup</p>
                <p>
                  No advance payment is collected online. Pay upon store collection or confirm your reservation directly with the merchant.
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Aside Summary */}
        <aside className="lg:w-[420px] shrink-0">
          <div className="glass-panel-solid rounded-3xl border border-glass-border p-7 sticky top-28 shadow-sm">
            <h2 className="text-lg font-bold font-display text-text-primary mb-4">Items in Your Rescue</h2>

            <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 py-2 border-b border-border/40">
                  <ProductImage
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    productName={item.product.name}
                    className="w-12 h-12 rounded-xl shrink-0 border border-glass-border"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-text-primary truncate">{item.product.name}</p>
                    <p className="text-[11px] text-text-secondary">{item.quantity} × ₹{item.product.rescuePrice.toFixed(2)}</p>
                  </div>
                  <span className="font-extrabold text-xs text-brand-forest">
                    ₹{(item.product.rescuePrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6 text-xs text-text-secondary border-b border-border/60 pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-text-primary">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Contribution</span>
                <span className="font-semibold text-text-primary">₹{platformFee.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline mb-2">
              <span className="font-bold text-sm text-text-primary">Total Due at Pickup</span>
              <span className="text-2xl font-extrabold text-brand-forest">₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
