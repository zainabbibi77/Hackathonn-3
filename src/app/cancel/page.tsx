import { XCircle } from "lucide-react";

export default function Cancel() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
        <XCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">Payment Cancelled</h1>
        <p className="text-gray-600 mt-2">Your payment was cancelled. Please try again.</p>
      </div>
    </div>
  );
}
