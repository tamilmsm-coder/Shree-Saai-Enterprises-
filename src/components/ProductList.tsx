import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { CATEGORIES } from '../data/products';
import { 
  LayoutGrid, Zap, Droplets, Bath, Sun, Wrench, Filter as FilterIcon, ShieldAlert, Tv, Paperclip,
  Search, Plus, Edit2, Trash2, SlidersHorizontal, ArrowUpDown, CornerDownRight, PlusCircle, Check
} from 'lucide-react';

// Icon Map for dynamic lookup of categories
const IconMap: Record<string, React.ComponentType<any>> = {
  LayoutGrid,
  Zap,
  Droplets,
  Bath,
  Sun,
  Wrench,
  Filter: FilterIcon,
  ShieldAlert,
  Tv,
  Paperclip
};

interface ProductListProps {
  products: Product[];
  onAddToEstimate: (product: Product, quantity: number) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  currencySymbol: string;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onAddToEstimate,
  onEditProduct,
  onDeleteProduct,
  currencySymbol
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'rate-asc' | 'rate-desc' | 'brand'>('name');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedAnimation, setAddedAnimation] = useState<Record<string, boolean>>({});

  // Unique list of brands for filtering
  const brands = useMemo(() => {
    const allBrands = products
      .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
      .map(p => p.brand);
    return ['all', ...Array.from(new Set(allBrands))];
  }, [products, selectedCategory]);

  // Reset selected brand if it's no longer in the list after category change
  React.useEffect(() => {
    if (!brands.includes(selectedBrand)) {
      setSelectedBrand('all');
    }
  }, [brands, selectedBrand]);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.specification && p.specification.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      result = result.filter(p => p.brand === selectedBrand);
    }

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'brand') {
        return a.brand.localeCompare(b.brand);
      }
      if (sortBy === 'rate-asc') {
        return a.rate - b.rate;
      }
      if (sortBy === 'rate-desc') {
        return b.rate - a.rate;
      }
      return 0;
    });

    return result;
  }, [products, searchQuery, selectedCategory, selectedBrand, sortBy]);

  const handleQuantityChange = (productId: string, val: number) => {
    const num = Math.max(1, val);
    setQuantities(prev => ({ ...prev, [productId]: num }));
  };

  const triggerAdd = (product: Product) => {
    const qty = quantities[product.id] || 1;
    onAddToEstimate(product, qty);
    
    // Animate "Added" status briefly
    setAddedAnimation(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedAnimation(prev => ({ ...prev, [product.id]: false }));
    }, 1200);

    // Reset qty selector back to 1
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  return (
    <div className="space-y-6">
      
      {/* Category Horizontal Bar */}
      <div className="overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2.5 pb-2 min-w-max">
          {CATEGORIES.map((cat) => {
            const Icon = IconMap[cat.icon] || LayoutGrid;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all border shadow-xs cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-blue-600/10 font-display'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search, Filter & Sort Bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-3.5">
        <div className="relative">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search electrical wires, taps, solar panels, tools..."
            className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-between text-xs pt-1">
          <div className="flex flex-wrap gap-2.5 items-center">
            
            {/* Brand Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold">Brand:</span>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-transparent border-none p-0 focus:ring-0 text-slate-900 font-bold focus:outline-none cursor-pointer"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b === 'all' ? 'All Brands' : b}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none p-0 focus:ring-0 text-slate-900 font-bold focus:outline-none cursor-pointer"
              >
                <option value="name">Product Name (A-Z)</option>
                <option value="brand">Brand Name</option>
                <option value="rate-asc">Price: Low to High</option>
                <option value="rate-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="text-slate-500 font-semibold">
            Showing <span className="text-blue-600 font-bold font-mono">{filteredProducts.length}</span> items
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center shadow-xs">
          <p className="text-slate-400 font-medium mb-1.5">No products found</p>
          <p className="text-xs text-slate-400">Try adjusting your filters or search keywords, or add a custom rate item!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts.map((product) => {
            const qty = quantities[product.id] || 1;
            const isAdded = addedAnimation[product.id];
            
            return (
              <div 
                key={product.id}
                className="bg-white rounded-xl border border-slate-100 shadow-xs hover:shadow-md hover:border-slate-200 transition-all p-4.5 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Category Indicator Tag */}
                {product.isCustom && (
                  <span className="absolute top-0 right-0 bg-yellow-400 text-blue-950 font-extrabold px-2 py-0.5 rounded-bl-lg text-[9px] uppercase tracking-wider font-display">
                    Custom Rate
                  </span>
                )}

                <div>
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 mb-1">
                        {product.category}
                      </span>
                      <h3 className="font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors font-display">
                        {product.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 items-center text-xs text-slate-500 mb-3 font-medium">
                    <span>Brand: <strong className="text-slate-800">{product.brand}</strong></span>
                    {product.specification && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span>Specs: <strong className="text-slate-700">{product.specification}</strong></span>
                      </>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3.5 mt-2.5 flex items-end justify-between gap-4">
                  {/* Rate / Unit Label */}
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Standard Rate
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-slate-900 font-display">
                        {currencySymbol}{product.rate.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        / {product.unit}
                      </span>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex items-center gap-2">
                    {/* Add Quantity selector */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button 
                        type="button"
                        onClick={() => handleQuantityChange(product.id, qty - 1)}
                        className="px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <input 
                        type="number"
                        min="1"
                        value={qty}
                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                        className="w-8 text-center text-xs font-bold bg-transparent border-none p-0 focus:ring-0 text-slate-800"
                      />
                      <button 
                        type="button"
                        onClick={() => handleQuantityChange(product.id, qty + 1)}
                        className="px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onEditProduct(product)}
                        title="Edit Product details or rate"
                        className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {product.isCustom && (
                        <button
                          onClick={() => onDeleteProduct(product.id)}
                          title="Delete Custom Product"
                          className="p-2 rounded-lg border border-red-100 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => triggerAdd(product)}
                        className={`px-3.5 py-1.8 rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/10'
                            : 'bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-display shadow-sm'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Added
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-3.5 h-3.5 text-blue-950" />
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
