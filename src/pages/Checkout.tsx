import { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CustomerInfo, Order } from '../types';
import { useAppContext } from '../context/useAppContext';

const Checkout = () => {
  const { cart, cartTotal, platformFee, placeOrder } = useAppContext();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CustomerInfo>({ name: '', email: '', phone: '', pickupPreference: 'standard' });

  if (cart.length === 0 && !order) return <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center"><h2 className="text-3xl font-display font-extrabold mb-3">Nothing to check out</h2><p className="text-text-secondary mb-8">Add a rescue deal to your cart first.</p><button type="button" onClick={() => navigate('/explore')} className="btn-primary">Explore Deals</button></div>;

  if (order) return <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-surface-white"><CheckCircle size={80} className="text-brand-fresh mb-6" strokeWidth={1.5} /><h1 className="text-4xl font-display font-extrabold mb-4">Order Confirmed!</h1><p className="text-text-secondary text-lg mb-2 max-w-md">Thanks for rescuing food today, {order.customer.name}.</p><p className="font-semibold text-brand-forest mb-8">Order {order.id} · ₹{order.total.toFixed(2)}</p><button type="button" onClick={() => navigate('/explore')} className="btn-primary">Continue Rescuing</button></div>;

  const updateField = (field: keyof CustomerInfo, value: string) => setFormData((current) => ({ ...current, [field]: value }));
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.email.includes('@') || formData.phone.trim().length < 7) {
      setError('Please enter a name, valid email address, and phone number.');
      return;
    }
    const createdOrder = placeOrder(formData);
    if (!createdOrder) setError('Your cart is empty.');
    else setOrder(createdOrder);
  };
  const finalTotal = cartTotal + platformFee;

  return <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12"><button type="button" onClick={() => navigate('/cart')} className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8"><ArrowLeft size={20} /> Back to Cart</button><div className="flex flex-col lg:flex-row gap-16"><div className="flex-grow"><h1 className="text-3xl font-display font-extrabold mb-8">Checkout</h1><form onSubmit={handleSubmit} className="space-y-8"><div className="space-y-4"><h2 className="font-bold text-xl">Pickup information</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><label className="block text-sm font-medium text-text-secondary">Full Name<input required type="text" value={formData.name} onChange={(event) => updateField('name', event.target.value)} className="mt-1 w-full px-4 py-3 rounded-lg border border-border/80" placeholder="Jane Doe" /></label><label className="block text-sm font-medium text-text-secondary">Email Address<input required type="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} className="mt-1 w-full px-4 py-3 rounded-lg border border-border/80" placeholder="jane@example.com" /></label></div><label className="block text-sm font-medium text-text-secondary">Phone Number<input required type="tel" value={formData.phone} onChange={(event) => updateField('phone', event.target.value)} className="mt-1 w-full px-4 py-3 rounded-lg border border-border/80" placeholder="9876543210" /></label><label className="block text-sm font-medium text-text-secondary">Collection preference<select value={formData.pickupPreference} onChange={(event) => updateField('pickupPreference', event.target.value)} className="mt-1 w-full px-4 py-3 rounded-lg border border-border/80"><option value="standard">Standard collection</option><option value="contactless">Contactless collection</option></select></label></div>{error && <p role="alert" className="text-accent-critical bg-accent-critical/10 rounded-lg p-3">{error}</p>}<button type="submit" className="btn-primary w-full py-4 text-lg">Confirm demo order · ₹{finalTotal.toFixed(2)}</button><p className="text-xs text-text-secondary">This is a demo checkout. No real payment is processed.</p></form></div><aside className="lg:w-[400px]"><div className="bg-surface-ivory rounded-xl border border-border/80 p-8 sticky top-32"><h2 className="text-xl font-bold mb-6">Order Summary</h2><div className="space-y-4 mb-6">{cart.map((item) => <div key={item.product.id} className="flex justify-between gap-4"><span className="text-text-secondary">{item.quantity}× {item.product.name}</span><span>₹{(item.product.rescuePrice * item.quantity).toFixed(2)}</span></div>)}</div><div className="border-t border-border/50 pt-4 flex justify-between text-lg font-bold"><span>Total</span><span className="text-brand-forest">₹{finalTotal.toFixed(2)}</span></div></div></aside></div></div>;
};

export default Checkout;
