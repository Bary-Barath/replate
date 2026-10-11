import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, Leaf, PackageCheck, PiggyBank, Recycle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';

const history = [
  { month: 'May', kg: 1820, savings: 68000 },
  { month: 'Jun', kg: 2140, savings: 79500 },
  { month: 'Jul', kg: 2460, savings: 91400 },
  { month: 'Aug', kg: 2850, savings: 105000 },
  { month: 'Sep', kg: 3120, savings: 118000 },
  { month: 'Oct', kg: 3480, savings: 132500 },
];

const ImpactDashboard = () => {
  const { orders } = useAppContext();
  const personalImpact = useMemo(() => orders.reduce((impact, order) => {
    const quantity = order.items.reduce((total, item) => total + item.quantity, 0);
    return {
      orders: impact.orders + 1,
      kg: impact.kg + quantity * 0.35,
      savings: impact.savings + order.items.reduce((total, item) => total + (item.product.originalPrice - item.product.rescuePrice) * item.quantity, 0),
    };
  }, { orders: 0, kg: 0, savings: 0 }), [orders]);

  const metrics = [
    { label: 'Food rescued', value: '12,400 kg', detail: 'across the RePlate network', icon: Recycle, color: 'text-brand-fresh' },
    { label: 'Customer savings', value: '₹4.5 Cr', detail: 'returned to local communities', icon: PiggyBank, color: 'text-accent-amber' },
    { label: 'Partner businesses', value: '850+', detail: 'actively reducing surplus', icon: PackageCheck, color: 'text-brand-forest' },
    { label: 'CO₂e avoided', value: '31,000 kg', detail: 'estimated platform impact', icon: Leaf, color: 'text-brand-fresh' },
  ];

  return <div className="bg-surface-ivory min-h-screen"><section className="bg-brand-deep text-surface-white"><div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 md:py-20"><div className="max-w-3xl"><p className="text-accent-amber uppercase tracking-[0.2em] text-xs font-bold mb-5">The RePlate effect</p><h1 className="text-4xl md:text-6xl font-display font-extrabold leading-tight mb-6">Every rescue deal makes waste less inevitable.</h1><p className="text-surface-ivory/75 text-lg md:text-xl leading-relaxed">Track the food, money, and emissions kept in circulation by the RePlate community.</p></div></div></section><main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 md:py-16"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">{metrics.map((metric) => <div key={metric.label} className="bg-surface-white border border-border/70 rounded-2xl p-6 shadow-sm"><metric.icon className={`${metric.color} mb-5`} size={28} strokeWidth={1.8} /><p className="text-sm text-text-secondary font-medium mb-2">{metric.label}</p><p className="text-3xl font-display font-extrabold mb-2">{metric.value}</p><p className="text-xs text-text-secondary">{metric.detail}</p></div>)}</div><div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-8"><section className="bg-surface-white border border-border/70 rounded-3xl p-6 md:p-8 shadow-sm"><div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8"><div><p className="text-xs uppercase tracking-widest text-brand-forest font-bold mb-2">Network progress</p><h2 className="text-2xl font-display font-extrabold">Food rescued over time</h2></div><span className="text-sm text-text-secondary">Last 6 months</span></div><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={history} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E9E3" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#70776F', fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#70776F', fontSize: 12 }} /><Tooltip cursor={{ fill: '#FAF8F2' }} formatter={(value) => [`${Number(value).toLocaleString()} kg`, 'Food rescued']} /><Bar dataKey="kg" fill="#2F7D57" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></section><aside className="bg-brand-forest text-surface-white rounded-3xl p-6 md:p-8 flex flex-col"><p className="text-accent-amber text-xs uppercase tracking-widest font-bold mb-3">Your contribution</p><h2 className="text-2xl font-display font-extrabold mb-3">Your rescue history</h2><p className="text-surface-ivory/75 leading-relaxed mb-8">Your confirmed orders become measurable impact as soon as you rescue your first meal.</p><div className="grid grid-cols-3 gap-3 mb-8"><div><p className="text-2xl font-extrabold">{personalImpact.orders}</p><p className="text-xs text-surface-ivory/65">Orders</p></div><div><p className="text-2xl font-extrabold">{personalImpact.kg.toFixed(1)}</p><p className="text-xs text-surface-ivory/65">kg saved</p></div><div><p className="text-2xl font-extrabold">₹{personalImpact.savings.toFixed(0)}</p><p className="text-xs text-surface-ivory/65">saved</p></div></div><Link to="/explore" className="btn-secondary mt-auto bg-surface-white/10 text-surface-white border-surface-white/30 hover:bg-surface-white hover:text-brand-forest">Rescue a deal <ArrowRight size={16} className="ml-2" /></Link></aside></div><p className="text-xs text-text-secondary mt-8">Network figures are demonstration data for this hackathon build. Personal figures are calculated from orders created in this browser.</p></main></div>;
};

export default ImpactDashboard;
