import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import BankLogo from './BankLogo';

const ReceiptModal = ({ isOpen, onClose, receipt }) => {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const textContent = `
============================================================
           AURA APEX BANK - TRANSACTION RECEIPT
============================================================
Transaction ID:    ${receipt.transactionId || 'TXN-N/A'}
Reference Number:  ${receipt.referenceNumber || 'REF-N/A'}
Date & Time:       ${receipt.date} at ${receipt.time}
Transfer Channel:  ${receipt.transferType || 'IMPS'}
Status:            ${receipt.status || 'COMPLETED'}

SENDER DETAILS:
Name:              ${receipt.senderName || 'Authorized Customer'}
Account Number:    ${receipt.senderAccount || 'N/A'}
IFSC Code:         ${receipt.senderIfsc || 'AURA0001001'}

RECIPIENT DETAILS:
Name:              ${receipt.receiverName || 'Beneficiary'}
Account Number:    ${receipt.receiverAccount || 'N/A'}
IFSC Code:         ${receipt.receiverIfsc || 'N/A'}

AMOUNT TRANSFERRED: INR ${Number(receipt.amount || 0).toLocaleString('en-IN')}.00
Remaining Balance: INR ${Number(receipt.remainingBalance || 0).toLocaleString('en-IN')}.00
Remarks:           ${receipt.remarks || 'Electronic Fund Transfer'}

============================================================
This is a computer-generated receipt verified under
ISO 27001 banking standards. No physical signature required.
============================================================
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AuraReceipt_${receipt.referenceNumber || Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Receipt Action Bar (No Print) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between no-print">
          <div className="flex items-center space-x-2 text-xs font-bold text-navy-950">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Transaction Statement</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg text-slate-600 hover:text-navy-900 hover:bg-slate-200 transition-colors"
              title="Download Receipt (TXT)"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-slate-600 hover:text-navy-900 hover:bg-slate-200 transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formal Printable Document Area */}
        <div id="receipt-print-area" className="p-6 sm:p-8 space-y-6 bg-white text-slate-800">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-5">
            <BankLogo size="md" variant="dark" />
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                {receipt.status || 'COMPLETED'}
              </span>
              <p className="text-[10px] text-slate-400 font-mono mt-1">Ref: {receipt.referenceNumber}</p>
            </div>
          </div>

          {/* Amount Showcase */}
          <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <p className="text-[11px] font-bold uppercase text-slate-500">Amount Settled</p>
            <div className="text-3xl font-black text-navy-950 font-mono mt-0.5">
              ₹{Number(receipt.amount || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">
              Payment Rail: {receipt.transferType || 'IMPS 24x7'}
            </p>
          </div>

          {/* Details Grid */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Transaction ID</span>
              <span className="font-mono font-bold text-slate-900">{receipt.transactionId}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Date & Timestamp</span>
              <span className="font-medium text-slate-800">{receipt.date} at {receipt.time}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Sender Account</span>
              <span className="font-mono text-slate-800">{receipt.senderAccount} ({receipt.senderName})</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Beneficiary</span>
              <span className="font-mono font-bold text-navy-900">{receipt.receiverName} ({receipt.receiverAccount})</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Beneficiary IFSC</span>
              <span className="font-mono text-slate-800">{receipt.receiverIfsc || 'AURA0001001'}</span>
            </div>

            {receipt.remarks && (
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Purpose / Remarks</span>
                <span className="text-slate-800 italic">{receipt.remarks}</span>
              </div>
            )}

            {receipt.remainingBalance !== undefined && (
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Closing Available Balance</span>
                <span className="font-mono font-bold text-emerald-600">₹{Number(receipt.remainingBalance).toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          {/* Verification Watermark */}
          <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-500">Certified by Aura Apex Core Clearing Switch</p>
            <p>Authorized by Reserve Bank of India &bull; ISO/IEC 27001:2022 Certified</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ReceiptModal;