import { useState } from 'react';
import { LocateFixed, MapPin, Navigation, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import { isProductPurchasable } from '../utils/eligibility';
import RescueClock from '../components/RescueClock';
import ProductImage from '../components/ProductImage';

const NearbyRadar = () => {
  const { products } = useAppContext();
  const [status, setStatus] = useState('Showing partners sorted by nearest collection point.');

  const locate = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation not supported in this browser. Showing default nearby partners.');
      return;
    }
    setStatus('Detecting nearby partners...');
    navigator.geolocation.getCurrentPosition(
      () => setStatus('Location active. Showing nearest verified food partners.'),
      () => setStatus('Location permission denied. Showing default radius.')
    );
  };

  const nearby = products.filter(isProductPurchasable);

  return (
    <main className="min-h-screen py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="eyebrow mb-2">Nearby Rescue Radar</span>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-text-primary tracking-tight">
              Rescue what is closest.
            </h1>
            <p className="text-text-secondary text-base mt-3 max-w-2xl leading-relaxed">
              Discover eligible surplus food items within your immediate neighborhood. Cut down transport emissions and rescue fresh surplus directly from local bakeries and grocers.
            </p>
          </div>
          <button type="button" onClick={locate} className="btn-secondary inline-flex items-center gap-2">
            <LocateFixed size={16} /> Use my location
          </button>
        </div>

        <div className="glass-panel rounded-2xl p-4 mb-8 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <span className="text-xs text-text-secondary flex items-center gap-2">
            <Navigation size={15} className="text-brand-forest" /> {status}
          </span>
          <span className="text-[11px] uppercase tracking-wider font-bold text-brand-forest">
            Live Verified Radius
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nearby.map((product) => (
            <article key={product.id} className="card p-5 flex gap-4 bg-surface-white/80">
              <ProductImage
                src={product.imageUrl}
                alt={product.name}
                productName={product.name}
                className="w-24 h-24 rounded-2xl shrink-0 border border-glass-border"
              />
              <div className="min-w-0 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-forest bg-brand-mint/60 px-2 py-0.5 rounded-md">
                        {product.distance ?? 'Nearby'}
                      </span>
                      <h2 className="font-bold text-base text-text-primary truncate mt-1">
                        {product.name}
                      </h2>
                      <p className="text-xs text-text-secondary">{product.sellerName}</p>
                    </div>
                    <span className="text-lg font-extrabold text-brand-forest">
                      ₹{product.rescuePrice.toFixed(0)}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-2 flex items-center gap-1">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">{product.collectionLocation ?? 'Local Store'}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50 gap-2">
                  <span className="text-xs text-accent-amber font-semibold">
                    <RescueClock deadline={product.pickupDeadline ?? product.bestBefore} />
                  </span>
                  <Link to={`/product/${product.id}`} className="btn-primary px-4 py-1.5 text-xs">
                    View Deal
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {nearby.length === 0 && (
          <div className="card p-12 text-center bg-surface-white/80">
            <ShieldCheck className="mx-auto text-brand-forest mb-3" size={32} />
            <h2 className="font-bold text-xl text-text-primary">No eligible human-food deals nearby</h2>
            <p className="text-text-secondary text-sm mt-2 max-w-sm mx-auto">
              Check back soon as local bakeries list fresh surplus throughout the afternoon.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default NearbyRadar;
