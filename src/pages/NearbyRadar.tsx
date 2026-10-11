import { useMemo, useState } from 'react';
import { LocateFixed, MapPin, Navigation, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import { isProductPurchasable } from '../utils/eligibility';
import RescueClock from '../components/RescueClock';

const NearbyRadar = () => {
  const { products } = useAppContext();
  const [status, setStatus] = useState('Showing demo locations near you');
  const nearby = useMemo(() => products.filter(isProductPurchasable).sort((a, b) => (a.distance ?? '99').localeCompare(b.distance ?? '99')), [products]);
  const locate = () => {
    if (!navigator.geolocation) { setStatus('Location access is unavailable — list fallback remains active'); return; }
    setStatus('Location access requested. Demo distances remain seller-provided for this build.');
    navigator.geolocation.getCurrentPosition(() => undefined, () => setStatus('Location permission was not granted — list fallback remains active'));
  };
  return <main className="min-h-screen py-10 md:py-16"><div className="max-w-6xl mx-auto px-6 lg:px-12"><div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10"><div><p className="eyebrow mb-3">Nearby Rescue Radar</p><h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight">Rescue what is closest.</h1><p className="text-text-secondary text-lg mt-4 max-w-2xl">A practical list-first view of eligible human-food deals, ordered by the distance supplied by each partner.</p></div><button type="button" onClick={locate} className="btn-secondary inline-flex items-center gap-2"><LocateFixed size={17} /> Use my location</button></div><div className="card p-4 mb-8 flex flex-col sm:flex-row gap-3 sm:items-center justify-between"><span className="text-sm text-text-secondary flex items-center gap-2"><Navigation size={16} className="text-brand-lime" /> {status}</span><span className="text-xs uppercase tracking-widest text-text-secondary">Map service not configured · list fallback</span></div><div className="grid grid-cols-1 md:grid-cols-2 gap-5">{nearby.map((product) => <article key={product.id} className="card p-5 flex gap-4"><img src={product.imageUrl} alt="" className="w-24 h-24 rounded-2xl object-cover" /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><p className="text-xs text-brand-lime font-bold uppercase tracking-widest">{product.distance ?? 'Nearby'}</p><h2 className="font-bold text-lg truncate mt-1">{product.name}</h2><p className="text-sm text-text-secondary">{product.sellerName}</p></div><span className="text-xl font-extrabold text-brand-lime">₹{product.rescuePrice.toFixed(0)}</span></div><p className="text-sm text-text-secondary mt-3 flex items-center gap-1"><MapPin size={14} /> {product.collectionLocation ?? 'Collection details on listing'}</p><div className="flex items-center justify-between mt-4 gap-3"><span className="text-xs text-accent-amber"><RescueClock deadline={product.pickupDeadline ?? product.bestBefore} /></span><Link to={`/product/${product.id}`} className="btn-primary px-4 py-2 text-sm">View deal</Link></div></div></article>)}</div>{nearby.length === 0 && <div className="card p-10 text-center"><ShieldCheck className="mx-auto text-brand-lime mb-3" /><h2 className="font-bold text-xl">No eligible human-food deals nearby</h2><p className="text-text-secondary mt-2">Try exploring again later. Feed-rescue inventory is kept out of this marketplace.</p></div>}</div></main>;
};

export default NearbyRadar;
