export function PaymentQR({ onPaymentComplete }) {
  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-800">Scan to Pay</h3>
      
      <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
        <div className="w-48 h-48 bg-white rounded-lg shadow-inner flex items-center justify-center">
          <div className="text-center text-gray-600">
            <div className="text-6xl mb-2">📱</div>
            <p className="text-sm">QR Code Here</p>
            <p className="text-xs text-gray-500 mt-2">(Demo)</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-600 mb-4">UPI ID: tripwise@upi</p>
        <button
          onClick={onPaymentComplete}
          className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
        >
          Simulate Payment Success
        </button>
      </div>
    </div>
  );
}
