import { useState, useEffect } from 'react';
import { Product, Estimate, CURRENCIES, Currency } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { ProductList } from './components/ProductList';
import { EstimateBuilder } from './components/EstimateBuilder';
import { CustomProductForm } from './components/CustomProductForm';
import { QuotationPrint } from './components/QuotationPrint';
import { 
  Zap, Settings, RefreshCw, Plus, Sparkles, Info, 
  ChevronDown, Check, Coins, Layers, Eye
} from 'lucide-react';

export default function App() {
  // State for products list (includes pre-loaded and user custom products)
  const [products, setProducts] = useState<Product[]>([]);
  
  // Active compiled estimate/quotation
  const [estimate, setEstimate] = useState<Estimate>({
    id: 'active',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    estimateNumber: '',
    date: new Date().toISOString().split('T')[0],
    items: [],
    overallDiscountPercent: 0,
    taxPercent: 18,
    includeTax: false
  });

  // Selected currency
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  // Modals & Panels UI toggles
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'estimate'>('browse');
  const [showResetSuccess, setShowResetSuccess] = useState(false);

  // 1. Initial State Loading from LocalStorage
  useEffect(() => {
    // Load products
    const storedProducts = localStorage.getItem('sse_products');
    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch (e) {
        setProducts(INITIAL_PRODUCTS);
      }
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('sse_products', JSON.stringify(INITIAL_PRODUCTS));
    }

    // Load active estimate
    const storedEstimate = localStorage.getItem('sse_active_estimate');
    if (storedEstimate) {
      try {
        setEstimate(JSON.parse(storedEstimate));
      } catch (e) {}
    } else {
      // Set default estimate number
      setEstimate(prev => ({
        ...prev,
        estimateNumber: `SSE-${Date.now().toString().slice(-5)}`
      }));
    }

    // Load selected currency
    const storedCurrencyCode = localStorage.getItem('sse_currency_code');
    if (storedCurrencyCode) {
      const match = CURRENCIES.find(c => c.code === storedCurrencyCode);
      if (match) setCurrency(match);
    }
  }, []);

  // 2. Persisting state edits
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('sse_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sse_active_estimate', JSON.stringify(estimate));
  }, [estimate]);

  const handleSelectCurrency = (curr: Currency) => {
    setCurrency(curr);
    localStorage.setItem('sse_currency_code', curr.code);
    setShowCurrencyDropdown(false);
  };

  // Add Item to active compilation
  const handleAddToEstimate = (product: Product, qty: number) => {
    setEstimate((prev) => {
      // Check if item already exists
      const existingIdx = prev.items.findIndex(item => item.product.id === product.id);
      
      const updatedItems = [...prev.items];
      if (existingIdx > -1) {
        // Increment quantity
        const existingItem = updatedItems[existingIdx];
        updatedItems[existingIdx] = {
          ...existingItem,
          quantity: existingItem.quantity + qty
        };
      } else {
        // Add new line item
        updatedItems.push({
          product,
          quantity: qty,
          discountPercent: 0
        });
      }

      return {
        ...prev,
        items: updatedItems
      };
    });
  };

  // Save new custom product or edit an existing one
  const handleSaveProduct = (updatedProduct: Product) => {
    setProducts((prev) => {
      const existsIdx = prev.findIndex(p => p.id === updatedProduct.id);
      const copy = [...prev];
      if (existsIdx > -1) {
        copy[existsIdx] = updatedProduct;
      } else {
        copy.unshift(updatedProduct);
      }
      return copy;
    });

    // If we updated a product that is currently in the active estimate, update it there too!
    setEstimate((prev) => {
      const updatedItems = prev.items.map(item => {
        if (item.product.id === updatedProduct.id) {
          return { ...item, product: updatedProduct };
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter(p => p.id !== productId));
    // Remove from estimate too
    setEstimate((prev) => ({
      ...prev,
      items: prev.items.filter(item => item.product.id !== productId)
    }));
  };

  const handleClearEstimate = () => {
    if (confirm('Are you sure you want to clear this entire estimate?')) {
      setEstimate({
        id: 'active',
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        estimateNumber: `SSE-${Date.now().toString().slice(-5)}`,
        date: new Date().toISOString().split('T')[0],
        items: [],
        overallDiscountPercent: 0,
        taxPercent: 18,
        includeTax: false
      });
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to restore original default rates? Any customized product additions or modified prices will be reset.')) {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('sse_products', JSON.stringify(INITIAL_PRODUCTS));
      
      // Update items inside estimate to reflect default rates
      setEstimate((prev) => {
        const updatedItems = prev.items.map(item => {
          const matchedOriginal = INITIAL_PRODUCTS.find(p => p.id === item.product.id);
          if (matchedOriginal) {
            return { 
              ...item, 
              product: matchedOriginal,
              customRate: undefined // Reset individual rate overrides
            };
          }
          return item;
        });
        return { ...prev, items: updatedItems };
      });

      setShowResetSuccess(true);
      setTimeout(() => setShowResetSuccess(false), 3000);
    }
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/20 antialiased">
      
      {/* 1. Print View Portal (only renders under @media print) */}
      <QuotationPrint estimate={estimate} currency={currency} />

      {/* 2. Interactive Web Application Interface (hidden during print) */}
      <div className="print:hidden flex flex-col min-h-screen">
        
        {/* Top Header Navigation */}
        <header className="sticky top-0 z-40 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 shadow-md border-b border-blue-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
            
            {/* Store branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-blue-950 font-black text-lg tracking-tighter shadow-sm font-display relative overflow-hidden shrink-0">
                <Zap className="w-4 h-4 text-blue-900 fill-yellow-400 absolute opacity-30 -right-0.5 -bottom-0.5" />
                <span className="relative z-10">SSE</span>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white leading-none font-display">SSE ELECTRICAL</h1>
                <p className="text-[10px] font-bold text-blue-100/90 mt-0.5 uppercase tracking-wider">Product Rates & Estimation Directory</p>
                <p className="text-[9px] font-bold text-yellow-300 mt-1 uppercase tracking-wider flex items-center flex-wrap gap-x-1.5 gap-y-0.5">
                  <span>Proprietor: K. Tamilarasu</span>
                  <span className="text-blue-300/60">•</span>
                  <span>Ph: 9842407449</span>
                  <span className="text-blue-300/60">•</span>
                  <span className="text-white">Veppadai</span>
                </p>
              </div>
            </div>

            {/* Quick Actions Area */}
            <div className="flex items-center gap-2.5">
              
              {/* Currency Dropdown Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-blue-700/60 border border-blue-500/50 hover:bg-blue-700 hover:border-blue-400 rounded-xl transition-all cursor-pointer"
                >
                  <Coins className="w-3.5 h-3.5 text-blue-200" />
                  <span>{currency.code} ({currency.symbol})</span>
                  <ChevronDown className="w-3 h-3 text-blue-200" />
                </button>

                {showCurrencyDropdown && (
                  <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden">
                    {CURRENCIES.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => handleSelectCurrency(curr)}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-between ${
                          currency.code === curr.code ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <span>{curr.label}</span>
                        {currency.code === curr.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Custom Rate item */}
              <button
                onClick={handleOpenCreateProduct}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-blue-950 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-blue-950" />
                Add Custom Product
              </button>

              {/* Factory Reset original list */}
              <button
                onClick={handleResetToDefaults}
                title="Restore default database product rates"
                className="p-2 border border-blue-500/50 text-blue-200 hover:text-white hover:bg-blue-700 rounded-xl transition-all cursor-pointer shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Reset Success Banner */}
        {showResetSuccess && (
          <div className="bg-emerald-600 text-white text-center py-2.5 text-xs font-bold px-4 flex items-center justify-center gap-2 animate-fade-in shrink-0">
            <Check className="w-4 h-4" />
            Standard product database rates have been successfully restored to factory defaults!
          </div>
        )}

        {/* Main Workspace Body */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
          
          {/* Mobile responsive toggle tabs */}
          <div className="flex sm:hidden border border-slate-200 rounded-xl overflow-hidden bg-white p-1 shadow-xs shrink-0">
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'browse'
                  ? 'bg-blue-600 text-white shadow-sm font-display'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Browse Rate Sheets
            </button>
            <button
              onClick={() => setActiveTab('estimate')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'estimate'
                  ? 'bg-blue-600 text-white shadow-sm font-display'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Quotation Estimator
              {estimate.items.length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black leading-none ${activeTab === 'estimate' ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}>
                  {estimate.items.length}
                </span>
              )}
            </button>
          </div>

          {/* Core Layout Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left side column: Product Rates Catalog */}
            <section className={`lg:col-span-7 space-y-6 ${activeTab !== 'browse' ? 'hidden lg:block' : ''}`}>
              <div className="flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 font-display">
                    <Layers className="w-5 h-5 text-blue-600" />
                    Product Rates Directory
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Select items and quantities below to compile quotes instantly.</p>
                </div>
                
                {/* Floating button for custom item on mobile */}
                <button
                  onClick={handleOpenCreateProduct}
                  className="sm:hidden p-2 rounded-xl bg-yellow-400 text-blue-950 shadow-lg active:bg-yellow-500 flex items-center justify-center"
                  title="Add Custom Product"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <ProductList
                products={products}
                onAddToEstimate={handleAddToEstimate}
                onEditProduct={handleOpenEditProduct}
                onDeleteProduct={handleDeleteProduct}
                currencySymbol={currency.symbol}
              />
            </section>

            {/* Right side column: Active Estimate Builder */}
            <section className={`lg:col-span-5 h-full ${activeTab !== 'estimate' ? 'hidden lg:block' : ''}`}>
              <EstimateBuilder
                estimate={estimate}
                onUpdateEstimate={setEstimate}
                onClearEstimate={handleClearEstimate}
                currency={currency}
              />
            </section>

          </div>

        </main>

        {/* Informative Footer */}
        <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 mt-auto text-xs font-medium">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse"></span>
              <p>SSE Electrical Price Catalog — Offline Local Persistent Mode Active</p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Proprietor: <strong className="text-slate-200">K. Tamilarasu (9842407449)</strong></span>
              <span className="text-slate-700">|</span>
              <span>Location: <strong className="text-slate-200">Veppadai</strong></span>
              <span className="text-slate-700">|</span>
              <span>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              <span className="text-slate-700">|</span>
              <p>Electrical, Plumbing, Sanitary & Solar Contractors</p>
            </div>
          </div>
        </footer>

        {/* 3. Modal Overlay for Custom Product Form */}
        {isProductModalOpen && (
          <CustomProductForm
            onClose={() => setIsProductModalOpen(false)}
            onSave={handleSaveProduct}
            editingProduct={editingProduct}
          />
        )}

      </div>
    </div>
  );
}
