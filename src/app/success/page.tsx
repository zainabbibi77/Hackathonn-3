import { CheckCircle } from "lucide-react";

export default function Success() {
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">Payment Successful!</h1>
        <p className="text-xl text-gray-600 mt-2">Thank you for your order.</p>
        
      </div>
    </div>
  );
}
