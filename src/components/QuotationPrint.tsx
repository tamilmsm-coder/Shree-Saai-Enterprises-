import React from 'react';
import { Estimate, Currency } from '../types';

interface QuotationPrintProps {
  estimate: Estimate;
  currency: Currency;
}

export const QuotationPrint: React.FC<QuotationPrintProps> = ({ estimate, currency }) => {
  // Calculations
  const calculateItemSubtotal = (item: any) => {
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

  const formattedValue = (val: number) => {
    return `${currency.symbol}${val.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <div id="print-quotation" className="hidden print:block p-8 bg-white text-black min-h-screen text-xs leading-relaxed font-sans">
      {/* Header Grid */}
      <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">SSE ELECTRICAL</h1>
          <p className="text-sm font-semibold text-gray-600 mt-1">Authorized Electrical & Plumbing Rate Contractors</p>
          <div className="mt-3 text-gray-500 space-y-0.5">
            <p>Dealers in: Electrical, Plumbing, Sanitary, Solar, RO Purifiers & Home Appliances</p>
            <p>Main Bazar Road, Veppadai, Tamil Nadu</p>
            <p>Proprietor: <span className="font-bold text-gray-850">K. Tamilarasu</span> | Phone: <span className="font-bold text-gray-850">+91 98424 07449</span> | Email: contact@sseelectrical.com</p>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 font-bold rounded text-xs uppercase tracking-wider mb-2">
            Quotation / Rate Sheet
          </span>
          <p className="text-gray-500 font-semibold">Quote Ref: <span className="text-black font-bold">{estimate.estimateNumber || 'SSE-2026-001'}</span></p>
          <p className="text-gray-500 mt-1">Date: <span className="text-black font-semibold">{estimate.date || new Date().toLocaleDateString()}</span></p>
        </div>
      </div>

      {/* Customer Info Section */}
      <div className="grid grid-cols-2 gap-8 bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Estimate Prepared For:</h3>
          {estimate.customerName ? (
            <div className="space-y-1">
              <p className="text-sm font-bold text-gray-900">{estimate.customerName}</p>
              {estimate.customerPhone && <p className="text-gray-700">Phone: {estimate.customerPhone}</p>}
              {estimate.customerAddress && <p className="text-gray-700 whitespace-pre-wrap">Address: {estimate.customerAddress}</p>}
            </div>
          ) : (
            <p className="text-gray-400 italic">No customer details entered</p>
          )}
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Terms & Conditions:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Prices are valid for 15 days from the date of issue.</li>
            <li>Subject to availability of stock at the time of order confirmation.</li>
            <li>Standard manufacturer warranty applies to branded appliances/components.</li>
            <li>Installation charges are not included unless specified otherwise.</li>
          </ul>
        </div>
      </div>

      {/* Itemized Table */}
      <table className="w-full text-left border-collapse border border-gray-200 mb-6">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="p-3 font-bold text-gray-700 text-center w-10">#</th>
            <th className="p-3 font-bold text-gray-700">Product / Specification</th>
            <th className="p-3 font-bold text-gray-700">Brand</th>
            <th className="p-3 font-bold text-gray-700 text-right w-24">Unit Rate</th>
            <th className="p-3 font-bold text-gray-700 text-center w-20">Qty</th>
            <th className="p-3 font-bold text-gray-700 text-right w-20">Disc %</th>
            <th className="p-3 font-bold text-gray-700 text-right w-28">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {estimate.items.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-8 text-center text-gray-400 italic bg-white">
                No items added to this estimate.
              </td>
            </tr>
          ) : (
            estimate.items.map((item, idx) => {
              const rate = item.customRate !== undefined ? item.customRate : item.product.rate;
              return (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 text-center text-gray-500 font-medium">{idx + 1}</td>
                  <td className="p-3">
                    <p className="font-bold text-gray-900">{item.product.name}</p>
                    {item.product.specification && (
                      <p className="text-gray-500 font-normal text-[10px] mt-0.5">{item.product.specification}</p>
                    )}
                    {item.notes && (
                      <p className="text-blue-600 italic text-[10px] mt-0.5">Note: {item.notes}</p>
                    )}
                  </td>
                  <td className="p-3 font-medium text-gray-700">{item.product.brand}</td>
                  <td className="p-3 text-right text-gray-700 font-medium">
                    {formattedValue(rate)}
                    <span className="text-[10px] text-gray-400 block font-normal">per {item.product.unit}</span>
                  </td>
                  <td className="p-3 text-center font-semibold text-gray-800">{item.quantity}</td>
                  <td className="p-3 text-right text-gray-600">
                    {item.discountPercent > 0 ? `${item.discountPercent}%` : '-'}
                  </td>
                  <td className="p-3 text-right font-bold text-gray-900">
                    {formattedValue(calculateItemSubtotal(item))}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Summary Columns */}
      <div className="flex justify-between items-start gap-8">
        <div className="flex-1 max-w-sm">
          <div className="border border-gray-200 rounded p-3 bg-gray-50 space-y-1">
            <h4 className="font-bold text-gray-800 mb-1">Payment Instructions</h4>
            <p className="text-gray-600">Please make payments in favor of:</p>
            <p className="font-bold text-gray-900">SSE ELECTRICALS</p>
            <p className="text-gray-600">Bank Name: State Bank of India</p>
            <p className="text-gray-600">A/C No: 1234567890123 (IFSC: SBIN0001234)</p>
            <p className="text-gray-600">GPay/UPI ID: sseelectrical@upi</p>
          </div>
        </div>

        <div className="w-80">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Items Total:</span>
              <span className="font-semibold">{formattedValue(subtotal)}</span>
            </div>

            {estimate.overallDiscountPercent > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Overall Discount ({estimate.overallDiscountPercent}%):</span>
                <span>-{formattedValue(overallDiscount)}</span>
              </div>
            )}

            {estimate.includeTax && (
              <div className="flex justify-between text-gray-600">
                <span>GST / Tax ({estimate.taxPercent}%):</span>
                <span>{formattedValue(taxAmount)}</span>
              </div>
            )}

            <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold text-gray-900">
              <span>Grand Total:</span>
              <span>{formattedValue(grandTotal)}</span>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200 text-center">
            <div className="h-10"></div> {/* Spacer for physical signature */}
            <p className="font-bold text-gray-900 border-t border-gray-300 pt-1 inline-block px-6">K. Tamilarasu</p>
            <p className="text-[10px] text-gray-500 mt-1">Proprietor, SSE Electrical</p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center text-gray-400 text-[10px] border-t border-gray-100 pt-4">
        Thank you for your business! This is a computer-generated quotation sheet.
      </div>
    </div>
  );
};
