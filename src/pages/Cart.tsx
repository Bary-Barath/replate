import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Cart = () => {
  const { cart, removeFromCart, cartTotal } = useAppContext();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <ShoppingCart size={64} className="text-border mb-6" />
        <h2 className="text-3xl font-display font-extrabold text-text-primary mb-3">Your cart is empty</h2>
        <p className="text-text-secondary text-lg mb-8 max-w-md">
          Looks like you haven't added any rescue deals to your cart yet.
        </p>
        <Link to="/explore" className="btn-primary">
          Explore Deals
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
      <h1 className="text-4xl font-display font-extrabold text-text-primary mb-12 tracking-tight">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-grow space-y-6">
          {cart.map((item) => (
            <div key={item.product.id} className="flex gap-6 p-6 bg-surface-white rounded-xl border border-border/60 shadow-sm items-center">
              <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-cover rounded-lg" />
              <div className="flex-grow">
                <h3 className="font-bold text-lg text-text-primary mb-1">{item.product.name}</h3>
                <p className="text-text-secondary text-sm mb-2">{item.product.sellerName}</p>
                <p className="font-medium text-text-primary">Qty: {item.quantity}</p>
              </div>
              <div className="text-right flex flex-col justify-between h-full">
                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-text-secondary hover:text-accent-amber transition-colors self-end mb-4"
                >
                  <Trash2 size={20} />
                </button>
                <div className="font-bold text-xl text-text-primary">
                  ₹{(item.product.rescuePrice * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-96">
          <div className="bg-surface-ivory rounded-xl border border-border/80 p-8 sticky top-32">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-text-primary mb-8 border-b border-border/50 pb-8">
              <div className="flex justify-between">
                <span className="text-text-secondary">Subtotal</span>
                <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Platform Fee</span>
                <span className="font-medium">₹{(cartTotal * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-brand-fresh font-medium">
                <span>Total Savings</span>
                <span>
                  -₹{cart.reduce((total, item) => total + ((item.product.originalPrice - item.product.rescuePrice) * item.quantity), 0).toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-end mb-8">
              <span className="text-lg font-bold text-text-primary">Total</span>
              <span className="text-3xl font-extrabold text-brand-forest">
                ₹{(cartTotal + cartTotal * 0.05).toFixed(2)}
              </span>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4"
            >
              Proceed to Checkout <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
