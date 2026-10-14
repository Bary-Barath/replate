import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, Leaf, PackageCheck, PiggyBank, Recycle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import { calculatePersonalImpact } from '../utils/impactEngine';

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
  const personalImpact = useMemo(() => calculatePersonalImpact(orders), [orders]);

  const metrics = [
    { label: 'Food Rescued', value: '12,400 kg', detail: 'across verified partners', icon: Recycle, color: 'text-brand-forest' },
    { label: 'Shopper Savings', value: '₹4.5 Cr', detail: 'returned to local communities', icon: PiggyBank, color: 'text-accent-amber' },
    { label: 'Partner Businesses', value: '850+', detail: 'actively reducing surplus', icon: PackageCheck, color: 'text-brand-forest' },
    { label: 'CO₂e Prevented', value: '31,000 kg', detail: 'avoided methane emissions', icon: Leaf, color: 'text-brand-forest' },
  ];

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header Hero Banner */}
        <section className="glass-panel-solid rounded-3xl p-8 md:p-14 mb-10 border border-glass-border shadow-sm relative overflow-hidden bg-gradient-to-br from-brand-mint/50 via-surface-white/90 to-brand-mint/20">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-brand-mint text-brand-forest font-extrabold text-[11px] uppercase tracking-wider mb-4 border border-brand-forest/20">
              <Sparkles size={13} />
              <span>The RePlate Impact Engine</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-text-primary leading-tight mb-4 tracking-tight">
              Every rescue makes waste less inevitable.
            </h1>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-2xl">
              Track the food, money, and emissions kept in circulation through collective community action.
            </p>
          </div>
        </section>

        {/* Global Impact Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {metrics.map((metric) => (
            <div key={metric.label} className="glass-panel-solid rounded-3xl p-6 border border-glass-border shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-brand-mint/70 flex items-center justify-center mb-4 text-brand-forest">
                <metric.icon size={24} strokeWidth={2} />
              </div>
              <p className="text-xs uppercase tracking-wider text-text-secondary font-bold mb-1">{metric.label}</p>
              <p className="text-3xl font-display font-extrabold text-text-primary mb-1">{metric.value}</p>
              <p className="text-xs text-text-secondary">{metric.detail}</p>
            </div>
          ))}
        </div>

        {/* Charts & Personal Passport */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-8">
          {/* Chart Section */}
          <section className="glass-panel-solid rounded-3xl p-6 md:p-8 border border-glass-border shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <span className="eyebrow mb-1">Network Progress</span>
                <h2 className="text-2xl font-display font-extrabold text-text-primary">Food Rescued Over Time</h2>
              </div>
              <span className="text-xs font-semibold text-text-secondary bg-surface-secondary px-3 py-1 rounded-full">
                Last 6 Months
              </span>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={history} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(37, 133, 90, 0.1)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64786C', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64786C', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.85)',
                      boxShadow: '0 8px 32px rgba(35, 88, 58, 0.08)',
                    }}
                    formatter={(value) => [`${Number(value).toLocaleString()} kg`, 'Food rescued']}
                  />
                  <Bar dataKey="kg" fill="#25855A" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Personal Passport Aside */}
          <aside className="glass-panel rounded-3xl p-6 md:p-8 border border-glass-border shadow-sm flex flex-col justify-between bg-gradient-to-br from-brand-mint/40 to-surface-white/70">
            <div>
              <span className="eyebrow mb-1">Personal Impact Passport</span>
              <h2 className="text-2xl font-display font-extrabold text-text-primary mb-2">Your Contribution</h2>
              <p className="text-xs text-text-secondary leading-relaxed mb-6">
                Your confirmed orders become verified impact metrics directly logged in your account.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6 bg-surface-white/80 rounded-2xl p-4 border border-glass-border">
                <div>
                  <p className="text-2xl font-extrabold text-brand-forest">{personalImpact.orders}</p>
                  <p className="text-[10px] uppercase font-bold text-text-secondary">Orders</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-brand-forest">{personalImpact.kg.toFixed(1)}</p>
                  <p className="text-[10px] uppercase font-bold text-text-secondary">kg Saved</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-brand-forest">₹{personalImpact.savings.toFixed(0)}</p>
                  <p className="text-[10px] uppercase font-bold text-text-secondary">Saved</p>
                </div>
              </div>
            </div>

            <Link to="/explore" className="btn-primary w-full py-3 text-xs flex items-center justify-center gap-2">
              Rescue Another Meal <ArrowRight size={15} />
            </Link>
          </aside>
        </div>

        <p className="text-[11px] text-text-secondary mt-8 text-center">
          Platform-wide metrics represent demonstration totals. Personal figures are aggregated from your verified orders.
        </p>
      </div>
    </div>
  );
};

export default ImpactDashboard;
