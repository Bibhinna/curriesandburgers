import React, { useState } from 'react';
import { Search, Package, ChefHat, Truck, CheckCircle, Clock } from 'lucide-react';
import { dbService } from '../services/dbService';
import { Order } from '../types';

const OrderTracker: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    // Determine if we are searching for a specific order by ID
    const foundOrder = dbService.getOrderById(orderId);
    
    if (foundOrder) {
      setOrder(foundOrder);
      setError('');
    } else {
      setOrder(null);
      setError('Order not found. Please check your Order ID.');
    }
  };

  const steps = [
    { status: 'Pending', icon: Clock, label: 'Order Placed' },
    { status: 'Preparing', icon: ChefHat, label: 'Preparing' },
    { status: 'Out for Delivery', icon: Truck, label: 'Out for Delivery' },
    { status: 'Delivered', icon: CheckCircle, label: 'Delivered' }
  ];

  const getCurrentStepIndex = (status: string) => {
    return steps.findIndex(s => s.status === status);
  };

  const currentStep = order ? getCurrentStepIndex(order.status) : 0;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 animate-fade-in">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
           <h1 className="text-4xl font-serif font-bold dark:text-white mb-4">Track Your Order</h1>
           <p className="text-gray-500 dark:text-gray-400">Enter your Order ID (e.g., CB-123456) to see real-time status.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 mb-8">
           <form onSubmit={handleTrack} className="flex gap-2">
              <input 
                type="text" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID..."
                className="flex-1 px-6 py-4 rounded-xl bg-gray-50 dark:bg-gray-900 border-none outline-none focus:ring-2 focus:ring-brand-500 dark:text-white text-lg"
              />
              <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-8 rounded-xl font-bold transition-colors">
                Track
              </button>
           </form>
           {error && <p className="text-red-500 mt-4 text-center font-medium">{error}</p>}
        </div>

        {order && (
           <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-slide-up">
              <div className="flex justify-between items-start mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
                 <div>
                    <h3 className="font-bold text-xl dark:text-white">Order #{order.id}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Placed on {new Date(order.date).toLocaleDateString()}</p>
                 </div>
                 <div className="text-right">
                    <p className="font-bold text-2xl text-brand-600">${order.total.toFixed(2)}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{order.items.length} Items</p>
                 </div>
              </div>

              {/* Status Bar */}
              <div className="relative mb-12 px-4">
                 <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10 -translate-y-1/2 rounded-full"></div>
                 <div 
                   className="absolute top-1/2 left-0 h-1 bg-brand-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-1000 ease-out"
                   style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                 ></div>

                 <div className="flex justify-between">
                    {steps.map((step, idx) => {
                       const Icon = step.icon;
                       const isActive = idx <= currentStep;
                       const isCurrent = idx === currentStep;

                       return (
                          <div key={idx} className="flex flex-col items-center gap-3">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                                isActive ? 'bg-brand-600 text-white scale-110 shadow-lg shadow-brand-500/30' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                             }`}>
                                <Icon size={20} />
                             </div>
                             <span className={`text-xs font-bold ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'}`}>
                                {step.label}
                             </span>
                          </div>
                       );
                    })}
                 </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                 <h4 className="font-bold dark:text-white">Items in Order</h4>
                 {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm dark:text-gray-300">
                       <span className="flex items-center gap-2">
                         <span className="font-bold text-gray-900 dark:text-white">{item.quantity}x</span> {item.name}
                       </span>
                       <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracker;
