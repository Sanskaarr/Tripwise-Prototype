"use client";

import { IndianRupee, CheckCircle2, Smartphone } from "lucide-react";
import { useState } from "react";

interface PaymentQRProps {
  amount: number;
  onSuccess: () => void;
}

export function PaymentQR({ amount, onSuccess }: PaymentQRProps) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(onSuccess, 1500);
    }, 2000);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center py-8 animate-in fade-in zoom-in">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h3 className="text-xl font-semibold text-emerald-600">Payment Successful!</h3>
        <p className="text-slate-500 mt-2">Redirecting to confirmation...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-6">
        <p className="text-sm text-slate-500">Total Amount</p>
        <div className="flex items-center justify-center text-3xl font-bold text-slate-800">
          <IndianRupee className="w-6 h-6" />
          {amount.toLocaleString()}
        </div>
      </div>

      <div className="w-64 h-64 bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-lg">
        <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center relative overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-full h-full p-4">
            {[...Array(10)].map((_, i) => (
              <g key={i}>
                {[...Array(10)].map((_, j) => (
                  <rect
                    key={`${i}-${j}`}
                    x={i * 10 + 2}
                    y={j * 10 + 2}
                    width="6"
                    height="6"
                    fill={Math.random() > 0.5 ? "#1e293b" : "transparent"}
                    rx="1"
                  />
                ))}
              </g>
            ))}
            <rect x="35" y="35" width="30" height="30" fill="white" rx="4" />
            <text x="50" y="54" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0ea5e9">
              UPI
            </text>
          </svg>
        </div>
      </div>

      <p className="text-sm text-slate-500 mt-4 text-center">
        Scan with any UPI app to pay
      </p>

      <div className="flex items-center gap-2 mt-4 text-slate-400">
        <span className="w-8 h-0.5 bg-slate-200" />
        <span className="text-sm">or</span>
        <span className="w-8 h-0.5 bg-slate-200" />
      </div>

      <button
        onClick={handlePayment}
        disabled={processing}
        className={`mt-4 flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
          processing
            ? "bg-slate-100 text-slate-400"
            : "bg-gradient-to-r from-sky-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-sky-200"
        }`}
      >
        <Smartphone className="w-5 h-5" />
        {processing ? "Processing..." : "Simulate Payment"}
      </button>
    </div>
  );
}
