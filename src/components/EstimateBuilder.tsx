import React, { useState } from 'react';
import { Estimate, EstimateItem, Currency } from '../types';
import { 
  FileText, User, Phone, MapPin, Percent, DollarSign, Calendar, Hash,
  Trash2, Printer, Share2, Clipboard, ChevronDown, Check, Info, Settings, Tag, X, Plus, Sparkles
} from 'lucide-react';

interface EstimateBuilderProps {
  estimate: Estimate;
  onUpdateEstimate: (updater: (prev: Estimate) => Estimate) => void;
  onClearEstimate: () => void;
  currency: Currency;
}

export const EstimateBuilder: React.FC<EstimateBuilderProps> = ({
  estimate,
  onUpdateEstimate,
  onClearEstimate,
  currency
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [showTaxSettings, setShowTaxSettings] = useState(false);
  const [activeNoteEditId, setActiveNoteEditId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  // Rate overrides state
  const [rateOverrideId, setRateOverrideId] = useState<string | null>(null);
  const [overrideValue, setOverrideValue] = useState<number | ''>('');

  // Calculations
  const calculateItemSubtotal = (item: EstimateItem) => {
    const rate = item.customRate !== undefined ? item.customRate : item.product.rate;
    const baseTotal = rate * item.quantity;
    const itemDiscount = baseTotal * (item.discountPercent / 100);
    return baseTotal - itemDiscount;
  };

  const subtotal = estimate.items.reduce((acc, item) => acc + calculateItemSubtotal(item), 0);
  const overallDiscount = subtotal * (estimate.overallDiscountPercent / 100);
  const taxableAmount = subtotal - overallDiscount;
  const taxAmount = estimate.includeTax ? taxableAmount * (estimate.taxPercent / 100) : 0;
  const grandTotal = Math.round(taxableAmount + taxAmount);

  // Field change handlers
  const handleClientFieldChange = (field: keyof Estimate, val: any) => {
    onUpdateEstimate((prev) => ({
      ...prev,
      [field]: val
    }));
  };

  const handleUpdateItemQuantity = (idx: number, qty: number) => {
    const validQty = Math.max(1, qty);
    onUpdateEstimate((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[idx] = { ...updatedItems[idx], quantity: validQty };
      return { ...prev, items: updatedItems };
    });
  };

  const handleUpdateItemDiscount = (idx: number, disc: number) => {
    const validDisc = Math.min(100, Math.max(0, disc));
    onUpdateEstimate((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[idx] = { ...updatedItems[idx], discountPercent: validDisc };
      return { ...prev, items: updatedItems };
    });
  };

  const handleRemoveItem = (idx: number) => {
    onUpdateEstimate((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }));
  };

  // Note handler
  const handleOpenNoteModal = (item: EstimateItem, idx: number) => {
    setActiveNoteEditId(`${idx}`);
    setNoteText(item.notes || '');
  };

  const handleSaveNote = (idx: number) => {
    onUpdateEstimate((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[idx] = { ...updatedItems[idx], notes: noteText.trim() || undefined };
      return { ...prev, items: updatedItems };
    });
    setActiveNoteEditId(null);
  };

  // Custom rate overrides
  const handleOpenRateOverride = (item: EstimateItem, idx: number) => {
    setRateOverrideId(`${idx}`);
    setOverrideValue(item.customRate !== undefined ? item.customRate : item.product.rate);
  };

  const handleSaveRateOverride = (idx: number) => {
    onUpdateEstimate((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[idx] = { 
        ...updatedItems[idx], 
        customRate: overrideValue === '' || overrideValue === updatedItems[idx].product.rate ? undefined : Number(overrideValue) 
      };
      return { ...prev, items: updatedItems };
    });
    setRateOverrideId(null);
  };

  // Generate copyable text for sharing via WhatsApp
  const generateWhatsAppMessage = () => {
    let msg = `*SSE ELECTRICALS - ESTIMATE/QUOTATION*\n`;
    msg += `------------------------------------\n`;
    msg += `*Quote Ref*: ${estimate.estimateNumber || 'SSE-' + Date.now().toString().slice(-6)}\n`;
    msg += `*Date*: ${estimate.date}\n`;
    
    if (estimate.customerName) {
      msg += `*Client Name*: ${estimate.customerName}\n`;
    }
    if (estimate.customerPhone) {
      msg += `*Phone*: ${estimate.customerPhone}\n`;
    }
    msg += `------------------------------------\n\n`;

    estimate.items.forEach((item, idx) => {
      const activeRate = item.customRate !== undefined ? item.customRate : item.product.rate;
      const sub = calculateItemSubtotal(item);
      const discStr = item.discountPercent > 0 ? ` [Disc ${item.discountPercent}%]` : '';
      msg += `${idx + 1}. *${item.product.name}* (${item.product.brand})\n`;
      msg += `   Qty: ${item.quantity} ${item.product.unit} x ${currency.symbol}${activeRate.toLocaleString()}${discStr}\n`;
      if (item.notes) {
        msg += `   _Note: ${item.notes}_\n`;
      }
      msg += `   *Subtotal*: ${currency.symbol}${sub.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n\n`;
    });

    msg += `------------------------------------\n`;
    msg += `*Items Subtotal*: ${currency.symbol}${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n`;
    
    if (estimate.overallDiscountPercent > 0) {
      msg += `*Overall Discount (${estimate.overallDiscountPercent}%)*: -${currency.symbol}${overallDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n`;
    }
    
    if (estimate.includeTax) {
      msg += `*Tax / GST (${estimate.taxPercent}%)*: ${currency.symbol}${taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n`;
    }
    
    msg += `*GRAND TOTAL*: ${currency.symbol}${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n`;
    msg += `------------------------------------\n`;
    msg += `_Thank you for contacting SSE Electrical. We look forward to your order!_\n\n`;
    msg += `*Proprietor*: K. Tamilarasu\n`;
    msg += `*Location / Store*: Veppadai\n`;
    msg += `*Phone / WhatsApp*: +91 98424 07449`;

    return msg;
  };

  const handleCopyEstimate = () => {
    const text = generateWhatsAppMessage();
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    });
  };

  const triggerPrint = () => {
    window.print();
  };

  const formattedValue = (val: number) => {
    return `${currency.symbol}${val.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden flex flex-col h-full">
      {/* Builder Header */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-300 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide font-display">Quotation Estimator</h2>
              <p className="text-xs text-slate-300">
                {estimate.items.length} {estimate.items.length === 1 ? 'item' : 'items'} added
              </p>
            </div>
          </div>
          {estimate.items.length > 0 && (
            <button
              onClick={onClearEstimate}
              className="text-xs text-red-300 hover:text-red-100 font-bold px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Builder Scroll Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        
        {/* Client Metadata Fields */}
        <div className="space-y-3.5 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-600" />
            Client Details
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={estimate.customerName}
                onChange={(e) => handleClientFieldChange('customerName', e.target.value)}
                placeholder="Enter client name"
                className="w-full px-2.5 py-1.5 bg-white text-xs rounded border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={estimate.customerPhone}
                onChange={(e) => handleClientFieldChange('customerPhone', e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-2.5 py-1.5 bg-white text-xs rounded border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Quotation #
              </label>
              <div className="relative">
                <Hash className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={estimate.estimateNumber}
                  onChange={(e) => handleClientFieldChange('estimateNumber', e.target.value)}
                  placeholder="SSE-2026-001"
                  className="w-full pl-6.5 pr-2.5 py-1.5 bg-white text-xs rounded border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Estimate Date
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={estimate.date}
                  onChange={(e) => handleClientFieldChange('date', e.target.value)}
                  className="w-full pl-7.5 pr-2.5 py-1.5 bg-white text-xs rounded border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Site Address / Notes
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 absolute left-2 top-2.5 text-slate-400" />
              <textarea
                value={estimate.customerAddress}
                onChange={(e) => handleClientFieldChange('customerAddress', e.target.value)}
                placeholder="Enter client delivery site address"
                rows={2}
                className="w-full pl-7.5 pr-2.5 py-2 bg-white text-xs rounded border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Estimate Items Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
            Selected Items
          </h3>

          {estimate.items.length === 0 ? (
            <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-400 font-medium">No items in estimate yet.</p>
              <p className="text-[10px] text-slate-400 mt-1">Browse product rates and click the "Add" button to begin compiling an estimate sheet.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {estimate.items.map((item, idx) => {
                const activeRate = item.customRate !== undefined ? item.customRate : item.product.rate;
                const isOverridden = item.customRate !== undefined;

                return (
                  <div 
                    key={idx} 
                    className="p-3 bg-white border border-slate-100 hover:border-slate-200 shadow-xs rounded-xl flex flex-col gap-2 relative group"
                  >
                    {/* Item Details Line */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded uppercase">
                            {item.product.brand}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold font-mono">#{idx + 1}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 mt-1 leading-tight font-display">
                          {item.product.name}
                        </h4>
                        {item.product.specification && (
                          <span className="text-[10px] text-slate-400 block font-normal">
                            {item.product.specification}
                          </span>
                        )}
                        {item.notes && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-100">
                            <span>Note: {item.notes}</span>
                            <button 
                              onClick={() => handleOpenNoteModal(item, idx)}
                              className="text-amber-500 hover:text-amber-700 ml-1 font-bold cursor-pointer"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-300 hover:text-red-500 p-1 rounded-lg hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Inline overrides / settings */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-100 mt-1 text-xs">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Qty:</span>
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            type="button"
                            onClick={() => handleUpdateItemQuantity(idx, item.quantity - 1)}
                            className="px-1.5 py-0.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 font-bold transition-all cursor-pointer"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItemQuantity(idx, parseInt(e.target.value) || 1)}
                            className="w-8 text-center text-xs font-bold bg-transparent border-none p-0 focus:ring-0 text-slate-800"
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateItemQuantity(idx, item.quantity + 1)}
                            className="px-1.5 py-0.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 font-bold transition-all cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">/ {item.product.unit}</span>
                      </div>

                      {/* Unit rate block */}
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Rate:</span>
                        {rateOverrideId === `${idx}` ? (
                          <div className="flex items-center gap-1 border border-blue-200 rounded px-1 py-0.5 bg-white">
                            <span className="text-[10px] text-blue-600 font-bold">{currency.symbol}</span>
                            <input
                              type="number"
                              value={overrideValue}
                              onChange={(e) => setOverrideValue(e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-14 bg-transparent border-none p-0 text-xs text-blue-900 font-bold focus:ring-0 focus:outline-none"
                            />
                            <button 
                              onClick={() => handleSaveRateOverride(idx)}
                              className="text-emerald-600 font-bold hover:text-emerald-800 text-[10px] cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleOpenRateOverride(item, idx)}
                            className={`flex items-baseline gap-0.5 font-semibold text-slate-700 hover:text-blue-600 transition-colors border-b border-dashed border-slate-300 cursor-pointer ${isOverridden ? 'text-blue-600 font-extrabold font-display' : ''}`}
                            title="Click to override rate for this quotation"
                          >
                            <span>{currency.symbol}{activeRate}</span>
                            {isOverridden && <span className="text-[9px] text-blue-400 font-normal ml-0.5">(Modified)</span>}
                          </button>
                        )}
                      </div>

                      {/* Discount Selector */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Disc:</span>
                        <div className="flex items-center gap-1 border border-slate-200 rounded px-1 py-0.5 bg-slate-50">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.discountPercent || ''}
                            onChange={(e) => handleUpdateItemDiscount(idx, parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="w-7 text-center bg-transparent border-none p-0 text-xs font-bold text-slate-800 focus:ring-0 focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-400">%</span>
                        </div>
                      </div>

                      {/* Add note option */}
                      {activeNoteEditId === `${idx}` ? (
                        <div className="w-full flex items-center gap-2 border-t border-slate-100 pt-2.5 mt-1.5">
                          <input
                            type="text"
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="e.g. Copper wiring installation inclusive"
                            className="flex-1 bg-slate-50 text-xs rounded border border-slate-200 px-2.5 py-1 text-slate-900 focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveNote(idx)}
                            className="px-2.5 py-1 text-[10px] font-bold bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setActiveNoteEditId(null)}
                            className="px-2.5 py-1 text-[10px] font-medium bg-slate-100 rounded hover:bg-slate-200 text-slate-600 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        !item.notes && (
                          <button
                            onClick={() => handleOpenNoteModal(item, idx)}
                            className="text-[10px] text-slate-400 hover:text-blue-600 transition-colors font-medium border-b border-dashed border-slate-300 cursor-pointer"
                          >
                            + Add Item Note
                          </button>
                        )
                      )}

                      {/* Subtotal Label */}
                      <div className="w-full text-right font-extrabold text-slate-900 border-t border-slate-100 pt-2.5 mt-1.5 font-display">
                        {formattedValue(calculateItemSubtotal(item))}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Builder Footer Calculations */}
      {estimate.items.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-100 p-5 space-y-4 shadow-inner">
          <div className="space-y-2 text-xs font-medium">
            {/* Subtotal */}
            <div className="flex justify-between text-slate-500">
              <span>Items Total:</span>
              <span className="font-bold text-slate-700">{formattedValue(subtotal)}</span>
            </div>

            {/* Overall Discount Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-slate-500">
                <span>Overall Discount:</span>
                <div className="flex items-center gap-1 border border-slate-200 rounded px-1.5 py-0.5 bg-white">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={estimate.overallDiscountPercent || ''}
                    onChange={(e) => handleClientFieldChange('overallDiscountPercent', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-7 text-center bg-transparent border-none p-0 text-xs font-bold text-slate-800 focus:ring-0 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">%</span>
                </div>
              </div>
              {overallDiscount > 0 && (
                <span className="font-bold text-green-600">-{formattedValue(overallDiscount)}</span>
              )}
            </div>

            {/* Tax Settings Toggle */}
            <div className="border-t border-slate-200/80 pt-2.5 mt-2.5">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowTaxSettings(!showTaxSettings)}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Tax & GST Settings
                  <ChevronDown className={`w-3 h-3 transition-transform ${showTaxSettings ? 'rotate-180' : ''}`} />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Include:</span>
                  <button
                    onClick={() => handleClientFieldChange('includeTax', !estimate.includeTax)}
                    className={`w-8 h-4 rounded-full relative transition-colors ${
                      estimate.includeTax ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm absolute top-0.25 transition-all ${
                      estimate.includeTax ? 'left-4.25' : 'left-0.25'
                    }`} />
                  </button>
                </div>
              </div>

              {showTaxSettings && (
                <div className="mt-2.5 p-3 bg-white border border-slate-100 rounded-lg space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Tax / GST Percentage:</span>
                    <div className="flex items-center gap-1 border border-slate-200 rounded px-1.5 py-0.5">
                      <input
                        type="number"
                        value={estimate.taxPercent}
                        onChange={(e) => handleClientFieldChange('taxPercent', parseInt(e.target.value) || 0)}
                        className="w-8 text-center bg-transparent border-none p-0 text-xs font-bold text-slate-800 focus:ring-0 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400">%</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-normal">
                    Standard GST on Electricals and Spares is typically 18% in India. Customize this based on your regional standards.
                  </p>
                </div>
              )}
            </div>

            {estimate.includeTax && (
              <div className="flex justify-between text-slate-500 pt-1.5">
                <span>Tax Amount ({estimate.taxPercent}%):</span>
                <span className="font-bold text-slate-700">{formattedValue(taxAmount)}</span>
              </div>
            )}

            {/* Grand Total */}
            <div className="flex justify-between items-baseline pt-2.5 border-t border-slate-200">
              <span className="text-sm font-bold text-slate-900 uppercase tracking-wide font-display">Grand Total:</span>
              <span className="text-xl font-extrabold text-blue-600 font-display tracking-tight">
                {formattedValue(grandTotal)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleCopyEstimate}
              className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border shadow-xs transition-all cursor-pointer ${
                copiedText
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  Copied Text!
                </>
              ) : (
                <>
                  <Clipboard className="w-4 h-4 text-blue-600" />
                  Copy WhatsApp Quote
                </>
              )}
            </button>

            <button
              onClick={triggerPrint}
              className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-blue-600/15 cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
