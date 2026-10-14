import { ArrowRight, Minus, Plus, ShoppingCart, Trash2, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import ProductImage from '../components/ProductImage';

const Cart = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, cartTotal, platformFee } = useAppContext();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-brand-mint/60 flex items-center justify-center mb-6 text-brand-forest">
          <ShoppingCart size={36} />
        </div>
        <h2 className="text-3xl font-display font-extrabold text-text-primary mb-3">Your cart is empty</h2>
        <p className="text-text-secondary text-base mb-8 max-w-md">
          Discover high quality surplus food deals from local bakeries and stores at up to 75% off.
        </p>
        <Link to="/explore" className="btn-primary">
          Explore Rescue Deals
        </Link>
      </div>
    );
  }

  const savings = cart.reduce(
    (total, item) => total + (item.product.originalPrice - item.product.rescuePrice) * item.quantity,
    0
  );

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
      <div className="mb-10">
        <span className="eyebrow">Checkout Review</span>
        <h1 className="text-4xl font-display font-extrabold text-text-primary tracking-tight">Your Cart</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items List */}
        <div className="flex-grow space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="card p-5 sm:p-6 bg-surface-white/85 flex flex-col sm:flex-row sm:items-center gap-5 border border-glass-border shadow-sm"
            >
              {/* Product Image using canonical ProductImage component */}
              <ProductImage
                src={item.product.imageUrl}
                alt={item.product.name}
                productName={item.product.name}
                className="w-full sm:w-24 h-40 sm:h-24 rounded-2xl shrink-0 border border-glass-border"
              />

              <div className="flex-grow min-w-0">
                <span className="badge badge-discount text-[9px] mb-1">
                  {item.product.discountPercentage}% OFF
                </span>
                <h2 className="font-bold text-lg text-text-primary leading-tight truncate">
                  {item.product.name}
                </h2>
                <p className="text-text-secondary text-xs mt-0.5 mb-3">{item.product.sellerName}</p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-text-secondary">Quantity:</span>
                  <div className="flex items-center bg-surface-secondary/80 border border-glass-border rounded-xl overflow-hidden">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={item.quantity <= 1}
                      onClick={() => decreaseQuantity(item.product.id)}
                      className="p-2 hover:bg-surface-white transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-9 text-center font-bold text-xs text-text-primary">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={item.quantity >= item.product.availableQuantity}
                      onClick={() => increaseQuantity(item.product.id)}
                      className="p-2 hover:bg-surface-white transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-[11px] text-text-secondary font-medium">
                    ({item.product.availableQuantity} available)
                  </span>
                </div>
              </div>

              {/* Price and Remove */}
              <div className="flex sm:flex-col justify-between sm:items-end gap-2 pt-3 sm:pt-0 border-t sm:border-0 border-border/50">
                <button
                  type="button"
                  aria-label={`Remove ${item.product.name}`}
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-text-secondary hover:text-accent-critical p-1 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <div className="text-right">
                  <span className="font-extrabold text-xl text-brand-forest">
                    ₹{(item.product.rescuePrice * item.quantity).toFixed(2)}
                  </span>
                  <p className="text-[11px] text-text-secondary line-through">
                    ₹{(item.product.originalPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <aside className="lg:w-[380px] shrink-0">
          <div className="glass-panel-solid rounded-3xl border border-glass-border p-7 sticky top-28 shadow-sm">
            <h2 className="text-xl font-display font-extrabold text-text-primary mb-6">Order Summary</h2>

            <div className="space-y-3.5 mb-6 border-b border-border/60 pb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Subtotal</span>
                <span className="font-bold text-text-primary">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Platform Contribution</span>
                <span className="font-semibold text-text-primary">₹{platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-brand-forest font-semibold">
                <span>Total Food Savings</span>
                <span>-₹{savings.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline mb-6">
              <span className="text-base font-bold text-text-primary">Final Total</span>
              <span className="text-3xl font-extrabold text-brand-forest">
                ₹{(cartTotal + platformFee).toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/customer/checkout')}
              className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 mb-4"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-text-secondary">
              <ShieldCheck size={14} className="text-brand-forest" />
              <span>Stock revalidated before confirmation</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
