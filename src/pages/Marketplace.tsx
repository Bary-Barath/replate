import { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../mockData';

const categories = ['All', 'Bakery', 'Fruits & Vegetables', 'Dairy', 'Meals', 'Beverages', 'Snacks'];

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filters
  const [minDiscount, setMinDiscount] = useState<number>(0);
  
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesDiscount = product.discountPercentage >= minDiscount;
      const matchesEligibility = product.isEligibleForSale;
      
      return matchesSearch && matchesCategory && matchesDiscount && matchesEligibility;
    });
  }, [searchQuery, selectedCategory, minDiscount]);

  return (
    <div className="bg-surface-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Explore Rescue Deals</h1>
            <p className="text-text-secondary">Find great food near you at better prices.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <input 
                type="text" 
                placeholder="Search food or businesses..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface-white focus:outline-none focus:ring-2 focus:ring-brand-forest/50 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3.5 text-text-secondary" size={20} />
            </div>
            <button 
              className="p-3 bg-surface-white border border-border rounded-xl text-text-secondary hover:text-brand-forest hover:border-brand-forest transition-colors shadow-sm md:hidden"
              onClick={() => setIsFilterOpen(true)}
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Filters (Desktop) */}
          <div className={`fixed inset-0 z-50 bg-surface-white lg:static lg:block lg:w-64 lg:bg-transparent lg:z-auto transition-transform duration-300 ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="h-full flex flex-col p-6 lg:p-0">
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 rounded-full hover:bg-surface-ivory">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex items-center gap-2 mb-6 text-lg font-semibold text-text-primary">
                <Filter size={20} className="text-brand-forest" /> Filters
              </div>
              
              <div className="space-y-8 flex-grow lg:flex-grow-0 overflow-y-auto lg:overflow-visible">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-text-secondary mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="radio" 
                            name="category"
                            className="peer appearance-none w-5 h-5 border border-border rounded-full checked:border-brand-forest checked:bg-surface-white transition-all cursor-pointer"
                            checked={selectedCategory === category}
                            onChange={() => setSelectedCategory(category)}
                          />
                          <div className="absolute w-2.5 h-2.5 rounded-full bg-brand-forest opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                        <span className={`text-sm ${selectedCategory === category ? 'font-semibold text-brand-forest' : 'text-text-primary group-hover:text-brand-fresh'}`}>
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Minimum Discount */}
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-text-secondary mb-4">Minimum Discount</h3>
                  <div className="space-y-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="75" 
                      step="15" 
                      value={minDiscount} 
                      onChange={(e) => setMinDiscount(Number(e.target.value))}
                      className="w-full accent-brand-forest"
                    />
                    <div className="flex justify-between text-xs text-text-secondary">
                      <span>0%</span>
                      <span>15%</span>
                      <span>30%</span>
                      <span>45%</span>
                      <span>60%</span>
                      <span>75%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border flex gap-4 lg:hidden">
                <button 
                  className="btn-secondary flex-1"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setMinDiscount(0);
                  }}
                >
                  Clear
                </button>
                <button className="btn-primary flex-1" onClick={() => setIsFilterOpen(false)}>Apply</button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-text-secondary font-medium">
                Showing <span className="text-text-primary font-bold">{filteredProducts.length}</span> rescue deals
              </p>
              
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-text-secondary">Sort by:</span>
                <select className="bg-surface-white border border-border rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-forest/50">
                  <option>Ending Soon</option>
                  <option>Biggest Discount</option>
                  <option>Lowest Price</option>
                  <option>Nearest</option>
                </select>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-surface-white rounded-2xl border border-border p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-surface-ivory rounded-full flex items-center justify-center mb-4">
                  <Search size={24} className="text-text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">No deals found</h3>
                <p className="text-text-secondary max-w-md">
                  We couldn't find any rescue deals matching your filters. Try adjusting your search or clearing some filters.
                </p>
                <button 
                  className="btn-secondary mt-6"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setMinDiscount(0);
                  }}
                >
                  Clear All Filters
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
