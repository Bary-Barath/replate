import { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, X, RefreshCw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../context/useAppContext';
import { filterMarketplaceProducts, type MarketplaceSort } from '../utils/marketplaceEngine';

const categories = ['All', 'Bakery', 'Fruits & Vegetables', 'Dairy', 'Meals', 'Beverages', 'Snacks'];

const Marketplace = () => {
  const { products, isLoadingProducts } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('ending-soon');
  const [minDiscount, setMinDiscount] = useState<number>(0);

  const filteredProducts = useMemo(() => {
    return filterMarketplaceProducts(products, {
      searchQuery,
      category: selectedCategory,
      minDiscount,
      sortBy: sortBy as MarketplaceSort,
    });
  }, [products, searchQuery, selectedCategory, minDiscount, sortBy]);

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header & Search */}
        <div className="glass-panel-solid rounded-3xl p-6 md:p-8 mb-10 border border-glass-border shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="eyebrow">Direct Surplus Marketplace</span>
              {isLoadingProducts && (
                <span className="text-[10px] text-brand-forest font-bold animate-pulse flex items-center gap-1">
                  <RefreshCw size={10} className="animate-spin" /> Syncing with DB...
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-text-primary tracking-tight">
              Explore Deals
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Find premium surplus food from neighborhood partners at discounted prices.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <input
                type="text"
                placeholder="Search bakery, cakes, fruit..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-glass-border bg-surface-white/90 focus:outline-none focus:ring-2 focus:ring-brand-forest/20 text-xs shadow-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3.5 top-3 text-text-secondary" size={17} strokeWidth={2.5} />
            </div>

            <button
              type="button"
              className="p-3 bg-surface-white border border-glass-border rounded-2xl text-text-secondary hover:text-text-primary transition-colors shadow-sm md:hidden cursor-pointer"
              onClick={() => setIsFilterOpen(true)}
            >
              <SlidersHorizontal size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar / Filters */}
          <div
            className={`fixed inset-0 z-50 bg-surface-main/95 backdrop-blur-xl lg:static lg:block lg:w-72 lg:bg-transparent lg:z-auto transition-transform duration-300 ${
              isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
          >
            <div className="h-full flex flex-col p-6 lg:p-0">
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="text-xl font-bold font-display text-text-primary">Filters</h2>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 rounded-full hover:bg-surface-secondary transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="glass-panel-solid rounded-3xl p-6 border border-glass-border space-y-6">
                <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
                  <Filter size={16} className="text-brand-forest" /> Filters & Categories
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-extrabold text-text-secondary mb-3">
                    Categories
                  </h3>
                  <div className="space-y-1.5">
                    {categories.map((category) => {
                      const isSelected = selectedCategory === category;
                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-brand-forest text-surface-white shadow-sm'
                              : 'text-text-secondary hover:bg-surface-white/60 hover:text-text-primary'
                          }`}
                        >
                          <span>{category}</span>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-brand-lime" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Minimum Discount */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs uppercase tracking-wider font-extrabold text-text-secondary">
                      Min Discount
                    </h3>
                    <span className="badge badge-discount text-[10px]">
                      {minDiscount}%+
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="75"
                    step="15"
                    value={minDiscount}
                    onChange={(e) => setMinDiscount(Number(e.target.value))}
                    className="w-full accent-brand-forest cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-text-secondary mt-1 font-medium">
                    <span>0%</span>
                    <span>30%</span>
                    <span>60%</span>
                    <span>75%</span>
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setMinDiscount(0);
                    setIsFilterOpen(false);
                  }}
                  className="btn-secondary w-full py-2.5 text-xs cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-text-secondary text-sm">
                Showing{' '}
                <span className="text-text-primary font-bold">{filteredProducts.length}</span> active rescue deals
              </p>

              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="bg-surface-white border border-glass-border rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-forest/20 cursor-pointer shadow-sm"
                >
                  <option value="ending-soon">Ending Soon</option>
                  <option value="discount">Biggest Discount</option>
                  <option value="price">Lowest Price</option>
                  <option value="distance">Nearest Distance</option>
                </select>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="glass-panel-solid rounded-3xl border border-glass-border p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-surface-secondary/80 rounded-2xl flex items-center justify-center mb-4 text-brand-forest">
                  <Search size={26} />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-1">No rescue deals found</h3>
                <p className="text-xs text-text-secondary max-w-sm mb-6">
                  Try adjusting your keywords or loosening your minimum discount slider.
                </p>
                <button
                  type="button"
                  className="btn-secondary text-xs"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setMinDiscount(0);
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
