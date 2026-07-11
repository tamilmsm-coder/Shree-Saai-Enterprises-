import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, Plus, Edit3 } from 'lucide-react';

interface CustomProductFormProps {
  onClose: () => void;
  onSave: (product: Product) => void;
  editingProduct?: Product | null;
}

export const CustomProductForm: React.FC<CustomProductFormProps> = ({
  onClose,
  onSave,
  editingProduct
}) => {
  const [category, setCategory] = useState<Product['category']>('electrical');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [rate, setRate] = useState<number | ''>('');
  const [unit, setUnit] = useState('Piece');
  const [specification, setSpecification] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingProduct) {
      setCategory(editingProduct.category);
      setName(editingProduct.name);
      setBrand(editingProduct.brand);
      setRate(editingProduct.rate);
      setUnit(editingProduct.unit);
      setSpecification(editingProduct.specification || '');
    }
  }, [editingProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!brand.trim()) newErrors.brand = 'Brand / Maker is required';
    if (rate === '' || rate <= 0) newErrors.rate = 'Rate must be a positive number';
    if (!unit.trim()) newErrors.unit = 'Unit is required (e.g. Piece, Meter, Coil)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const productData: Product = {
      id: editingProduct ? editingProduct.id : `custom-${Date.now()}`,
      category,
      name: name.trim(),
      brand: brand.trim(),
      rate: Number(rate),
      unit: unit.trim(),
      specification: specification.trim() || undefined,
      isCustom: editingProduct ? editingProduct.isCustom : true
    };

    onSave(productData);
    onClose();
  };

  const categoriesList: { value: Product['category']; label: string }[] = [
    { value: 'electrical', label: 'Electrical' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'sanitary', label: 'Sanitary Wares' },
    { value: 'solar', label: 'Solar Panels' },
    { value: 'tools', label: 'Tools' },
    { value: 'ro', label: 'RO Systems' },
    { value: 'security', label: 'Security System' },
    { value: 'appliances', label: 'Home Appliances' },
    { value: 'accessories', label: 'Accessories' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            {editingProduct ? (
              <Edit3 className="w-5 h-5 text-blue-600" />
            ) : (
              <Plus className="w-5 h-5 text-blue-600" />
            )}
            <h2 className="text-lg font-bold text-slate-900 font-display">
              {editingProduct ? 'Edit Product Details & Rate' : 'Add Custom Product & Rate'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Product['category'])}
              disabled={!!editingProduct}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer"
            >
              {categoriesList.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="e.g. 1.5 Sq.mm Flexible 3 Core Cable"
              className={`w-full px-3.5 py-2 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.name ? 'border-red-400 ring-2 ring-red-500/10' : 'border-slate-200'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Brand and Unit Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Brand *
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  if (errors.brand) setErrors((prev) => ({ ...prev, brand: '' }));
                }}
                placeholder="e.g. Finolex, Jaquar"
                className={`w-full px-3.5 py-2 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                  errors.brand ? 'border-red-400 ring-2 ring-red-500/10' : 'border-slate-200'
                }`}
              />
              {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Unit *
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => {
                  setUnit(e.target.value);
                  if (errors.unit) setErrors((prev) => ({ ...prev, unit: '' }));
                }}
                placeholder="e.g. Piece, Meter, Coil, Box"
                className={`w-full px-3.5 py-2 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                  errors.unit ? 'border-red-400 ring-2 ring-red-500/10' : 'border-slate-200'
                }`}
              />
              {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit}</p>}
            </div>
          </div>

          {/* Rate / Price & Specification Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Standard Rate *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={rate}
                  onChange={(e) => {
                    setRate(e.target.value === '' ? '' : Number(e.target.value));
                    if (errors.rate) setErrors((prev) => ({ ...prev, rate: '' }));
                  }}
                  placeholder="0.00"
                  className={`w-full px-3.5 py-2 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    errors.rate ? 'border-red-400 ring-2 ring-red-500/10' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.rate && <p className="text-red-500 text-xs mt-1">{errors.rate}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Specifications
              </label>
              <input
                type="text"
                value={specification}
                onChange={(e) => setSpecification(e.target.value)}
                placeholder="e.g. 100m roll, heavy duty"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Guidelines info */}
          <div className="bg-amber-50 rounded-lg p-3.5 border border-amber-100 flex gap-2">
            <span className="text-amber-500 text-sm font-semibold">💡</span>
            <p className="text-xs text-amber-700 leading-relaxed">
              Adding custom products or modifying rates will persist instantly in your local browser cache. You can view, search, and load them into estimates.
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer font-display"
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
