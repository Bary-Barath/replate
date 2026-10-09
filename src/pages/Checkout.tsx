import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useAppContext();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    card: '',
    expiry: '',
    cvv: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.card) return;
    
    setIsSubmitted(true);
    setTimeout(() => {
      clearCart();
    }, 2000);
  };

  if (cart.length === 0 && !isSubmitted) {
    navigate('/cart');
    return null;
  }

  if (isSubmitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-surface-white">
        <CheckCircle size={80} className="text-brand-fresh mb-6" strokeWidth={1.5} />
        <h2 className="text-4xl font-display font-extrabold text-text-primary mb-4 tracking-tight">Order Confirmed!</h2>
        <p className="text-text-secondary text-lg mb-8 max-w-md">
          Thank you for rescuing food today. Your order details have been sent to {formData.email}.
        </p>
        <button onClick={() => navigate('/explore')} className="btn-primary">
          Continue Rescuing
        </button>
      </div>
    );
  }

  const finalTotal = cartTotal + cartTotal * 0.05;

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
      <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Cart
      </button>
      
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-grow">
          <h1 className="text-3xl font-display font-extrabold text-text-primary mb-8 tracking-tight">Checkout</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-bold text-xl">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-border/80 focus:ring-1 focus:ring-brand-forest focus:border-brand-forest" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-border/80 focus:ring-1 focus:ring-brand-forest focus:border-brand-forest" placeholder="jane@example.com" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <h3 className="font-bold text-xl">Payment Details</h3>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Card Number</label>
                <input required type="text" name="card" value={formData.card} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-border/80 focus:ring-1 focus:ring-brand-forest focus:border-brand-forest" placeholder="0000 0000 0000 0000" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Expiry Date</label>
                  <input required type="text" name="expiry" value={formData.expiry} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-border/80 focus:ring-1 focus:ring-brand-forest focus:border-brand-forest" placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">CVV</label>
                  <input required type="text" name="cvv" value={formData.cvv} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-border/80 focus:ring-1 focus:ring-brand-forest focus:border-brand-forest" placeholder="123" />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-4 text-lg">
              Pay ₹{finalTotal.toFixed(2)}
            </button>
          </form>
        </div>

        <div className="lg:w-[400px]">
          <div className="bg-surface-ivory rounded-xl border border-border/80 p-8 sticky top-32">
            <h2 className="text-xl font-bold text-text-primary mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-text-secondary">{item.quantity}x</span>
                    <span className="text-text-primary font-medium truncate max-w-[180px]">{item.product.name}</span>
                  </div>
                  <span className="font-medium">₹{(item.product.rescuePrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border/50 pt-4 flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span className="text-brand-forest">₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
