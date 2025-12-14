import { QrCode } from 'lucide-react';

export function PaymentQR({ onPaymentComplete }) {
  return (
    <div className="flex flex-col items-center gap-8 glassmorphism p-8 rounded-3xl border border-white/10 animate-fade-in">
      <h3 className="text-2xl font-display font-bold text-ice-white">Scan to Pay</h3>
      
      <div className="relative w-72 h-72 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-aurora-blue via-aurora-purple to-aurora-pink opacity-20 animate-aurora-shift" />
        <div className="absolute inset-4 glassmorphism rounded-xl flex items-center justify-center">
          <div className="text-center">
            <QrCode size={120} className="text-ice-white/30 mx-auto mb-4" />
            <p className="text-sm text-ice-white/60 font-medium">QR Code Demo</p>
            <p className="text-xs text-ice-white/40 mt-2">(Simulated)</p>
          </div>
        </div>
      </div>

      <div className="text-center space-y-5 w-full">
        <div className="glassmorphism px-6 py-3 rounded-xl border border-white/10">
          <p className="text-xs text-ice-white/50 mb-1 tracking-wider uppercase">UPI ID</p>
          <p className="text-ice-white font-mono">tripwise@upi</p>
        </div>
        
        <button
          onClick={onPaymentComplete}
          className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-display font-semibold hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-[1.02]"
        >
          Simulate Payment Success
        </button>
      </div>
    </div>
  );
}
