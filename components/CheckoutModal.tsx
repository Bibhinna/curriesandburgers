
import React, { useState, useEffect } from 'react';
import { X, CreditCard, Wallet, Banknote, MapPin, Phone, User as UserIcon, Receipt, ChevronRight, ChevronLeft, Calendar, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { CartItem, User } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  total: number;
  onPlaceOrder: (details: any) => void;
  user: User | null;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartItems, total, onPlaceOrder, user }) => {
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');
  
  // Order Details State
  const [details, setDetails] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    instructions: ''
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    upiId: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processingStage, setProcessingStage] = useState('');
  const [orderIdRef, setOrderIdRef] = useState('');

  // Reset logic when opening
  useEffect(() => {
    if (isOpen) {
        setStep('details');
        setOrderIdRef(`CB-${Math.floor(Math.random()*10000)}`); // Temporary ID for display
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const tax = total * 0.1;
  const deliveryFee = 5.00;
  const grandTotal = total + tax + deliveryFee;

  // --- Helpers ---

  // Luhn Algorithm for Credit Card Validation
  const luhnCheck = (val: string) => {
    let checksum = 0; 
    let j = 1; 
    for (let i = val.length - 1; i >= 0; i--) {
      let calc = 0;
      calc = Number(val.charAt(i)) * j;
      if (calc > 9) {
        checksum = checksum + 1;
        calc = calc - 10;
      }
      checksum = checksum + calc;
      if (j === 1) {j = 2} else {j = 1};
    }
    return (checksum % 10) === 0;
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i=0, len=match.length; i<len; i+=4) {
      parts.push(match.substring(i, i+4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
        return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  }

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};
    
    if (paymentMethod === 'card') {
        const rawCardNum = paymentDetails.cardNumber.replace(/\s/g, '');
        if (rawCardNum.length < 13 || rawCardNum.length > 19) {
            newErrors.cardNumber = 'Invalid card length';
        } else if (!luhnCheck(rawCardNum)) {
            newErrors.cardNumber = 'Invalid card number';
        }
        
        if (!paymentDetails.cardName.trim()) newErrors.cardName = 'Name on card is required';
        
        if (!/^\d{2}\/\d{2}$/.test(paymentDetails.cardExpiry)) {
             newErrors.cardExpiry = 'Invalid Date (MM/YY)';
        } else {
             const [month, year] = paymentDetails.cardExpiry.split('/').map(Number);
             const currentYear = parseInt(new Date().getFullYear().toString().substr(-2));
             const currentMonth = new Date().getMonth() + 1;

             if (month < 1 || month > 12) newErrors.cardExpiry = 'Invalid Month';
             else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                 newErrors.cardExpiry = 'Card Expired';
             }
        }

        if (paymentDetails.cardCvv.length < 3) newErrors.cardCvv = 'Invalid CVV';
    } 
    
    if (paymentMethod === 'upi') {
        if (!paymentDetails.upiId.trim() || !/^[\w.-]+@[\w.-]+$/.test(paymentDetails.upiId)) {
            newErrors.upiId = 'Invalid UPI ID (e.g. user@bank)';
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrderClick = () => {
    if (validatePayment()) {
        setStep('processing');
        
        // Simulation Sequence
        setProcessingStage('Securely connecting to payment gateway...');
        
        setTimeout(() => {
            setProcessingStage('Verifying payment details...');
        }, 1500);

        setTimeout(() => {
             if (paymentMethod === 'card') setProcessingStage('Authorizing transaction...');
             else if (paymentMethod === 'upi') setProcessingStage('Waiting for UPI approval...');
             else setProcessingStage('Confirming order...');
        }, 3000);

        setTimeout(() => {
          setStep('success');
          onPlaceOrder({ 
              ...details, 
              paymentMethod, 
              paymentDetails: paymentMethod !== 'cod' ? paymentDetails : null,
              items: cartItems, 
              total 
          });
        }, 5000);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state after animation clears
    setTimeout(() => {
        setStep('details');
        setPaymentMethod('card');
        setErrors({});
        setPaymentDetails({ cardNumber: '', cardExpiry: '', cardCvv: '', cardName: '', upiId: '' });
    }, 500);
  };

  if (step === 'success') {
    return (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 to-brand-600"></div>
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <Banknote size={48} />
                </div>
                <h2 className="text-3xl font-bold mb-2 dark:text-white font-serif">Order Placed!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    {paymentMethod === 'cod' ? 'Order confirmed. Please pay on delivery.' : 'Payment successful! Transaction ID generated.'}
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-8 text-left border border-gray-100 dark:border-gray-600">
                    <div className="flex justify-between items-center mb-2">
                         <span className="text-sm text-gray-500 dark:text-gray-400">Items</span>
                         <span className="font-bold dark:text-white">{cartItems.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Estimated Delivery</span>
                        <span className="font-bold text-lg text-brand-600">35 - 45 Mins</span>
                    </div>
                </div>
                <button 
                    onClick={handleClose}
                    className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30"
                >
                    Back to Menu
                </button>
            </div>
        </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
        
        {/* Processing Overlay */}
        {step === 'processing' && (
            <div className="absolute inset-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur flex flex-col items-center justify-center">
                 <div className="w-20 h-20 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-6"></div>
                 <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Processing Payment</h3>
                 <p className="text-gray-500 dark:text-gray-400 animate-pulse">{processingStage}</p>
                 <div className="mt-8 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full">
                    <ShieldCheck size={16} /> 256-bit Secure Encryption
                 </div>
            </div>
        )}

        {/* Order Summary Side */}
        <div className="w-full md:w-2/5 bg-gray-50 dark:bg-gray-900/50 p-6 md:p-8 border-r border-gray-200 dark:border-gray-700 overflow-y-auto hidden md:block">
            <h3 className="font-serif text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
                <Receipt size={24} className="text-brand-600" /> Order Summary
            </h3>
            <div className="space-y-4 mb-8">
                {cartItems.map(item => (
                    <div key={item.id} className="flex gap-4 items-center">
                        <div className="relative">
                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                                {item.quantity}
                            </span>
                        </div>
                        <div className="flex-1 dark:text-gray-300">
                            <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                            <p className="text-gray-500 dark:text-gray-500 text-sm">${item.price}</p>
                        </div>
                        <div className="font-bold dark:text-gray-300">
                            ${(item.price * item.quantity).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                <div className="flex justify-between text-xl font-bold dark:text-white">
                    <span>Total</span>
                    <span className="text-brand-600">${grandTotal.toFixed(2)}</span>
                </div>
            </div>
        </div>

        {/* Form Side */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-white dark:bg-gray-800 flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold font-serif dark:text-white">Checkout</h2>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                        <span className={`px-2 py-1 rounded ${step === 'details' ? 'bg-brand-100 text-brand-700 font-bold' : 'text-gray-500'}`}>1. Details</span>
                        <ChevronRight size={14} className="text-gray-400" />
                        <span className={`px-2 py-1 rounded ${step === 'payment' ? 'bg-brand-100 text-brand-700 font-bold' : 'text-gray-500'}`}>2. Payment</span>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            {step === 'details' && (
                <div className="space-y-6 animate-fade-in flex-1">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Full Name</label>
                            <div className="relative group">
                                <UserIcon className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={20} />
                                <input 
                                    type="text" 
                                    value={details.name}
                                    onChange={e => setDetails({...details, name: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={20} />
                                <input 
                                    type="tel" 
                                    value={details.phone}
                                    onChange={e => setDetails({...details, phone: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                                    placeholder="(555) 000-0000"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-300">Delivery Address</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={20} />
                            <textarea 
                                value={details.address}
                                onChange={e => setDetails({...details, address: e.target.value})}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none min-h-[100px] resize-none transition-all"
                                placeholder="Street address, Apt, City, Zip Code"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-300">Delivery Instructions (Optional)</label>
                        <textarea 
                            value={details.instructions}
                            onChange={e => setDetails({...details, instructions: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none transition-all"
                            placeholder="Gate code, leave at door, etc."
                        />
                    </div>

                    <div className="md:hidden mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center font-bold text-lg dark:text-white">
                             <span>Total</span>
                             <span>${grandTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => setStep('payment')}
                        disabled={!details.name || !details.phone || !details.address}
                        className="w-full mt-auto bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
                    >
                        Proceed to Payment <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {step === 'payment' && (
                <div className="space-y-4 animate-fade-in flex-1 flex flex-col">
                    <h3 className="text-lg font-medium dark:text-white text-gray-500">Select Payment Method</h3>
                    
                    {/* CREDIT CARD */}
                    <div className={`border-2 rounded-2xl transition-all overflow-hidden ${paymentMethod === 'card' ? 'border-brand-600 bg-brand-50/30 dark:bg-brand-900/10' : 'border-gray-200 dark:border-gray-700'}`}>
                        <button 
                            onClick={() => { setPaymentMethod('card'); setErrors({}); }}
                            className="w-full flex items-center gap-4 p-5 text-left"
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'card' ? 'border-brand-600' : 'border-gray-300 dark:border-gray-600'}`}>
                                {paymentMethod === 'card' && <div className="w-3 h-3 rounded-full bg-brand-600"></div>}
                            </div>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${paymentMethod === 'card' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                <CreditCard size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-900 dark:text-white">Credit / Debit Card</p>
                                <p className="text-sm text-gray-500">Secure payment via Stripe</p>
                            </div>
                        </button>
                        
                        {paymentMethod === 'card' && (
                            <div className="px-5 pb-5 pt-0 animate-fade-in space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Card Number</label>
                                    <div className="relative">
                                        <input 
                                            type="text"
                                            maxLength={19}
                                            value={paymentDetails.cardNumber}
                                            onChange={e => {
                                                if (/^[\d\s]*$/.test(e.target.value)) {
                                                    setPaymentDetails({...paymentDetails, cardNumber: formatCardNumber(e.target.value)})
                                                }
                                            }}
                                            placeholder="0000 0000 0000 0000"
                                            className={`w-full pl-10 pr-4 py-3 rounded-xl border dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 ${errors.cardNumber ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600'}`}
                                        />
                                        <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    </div>
                                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.cardNumber}</p>}
                                </div>

                                <div>
                                     <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Name on Card</label>
                                     <input 
                                         type="text"
                                         value={paymentDetails.cardName}
                                         onChange={e => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
                                         placeholder="John Doe"
                                         className={`w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 ${errors.cardName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600'}`}
                                     />
                                     {errors.cardName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.cardName}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Expiry</label>
                                        <div className="relative">
                                            <input 
                                                type="text"
                                                maxLength={5}
                                                value={paymentDetails.cardExpiry}
                                                onChange={e => setPaymentDetails({...paymentDetails, cardExpiry: formatExpiry(e.target.value)})}
                                                placeholder="MM/YY"
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl border dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 ${errors.cardExpiry ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600'}`}
                                            />
                                            <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                        </div>
                                        {errors.cardExpiry && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.cardExpiry}</p>}
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">CVV</label>
                                        <div className="relative">
                                            <input 
                                                type="password"
                                                maxLength={4}
                                                value={paymentDetails.cardCvv}
                                                onChange={e => {
                                                    if (/^\d*$/.test(e.target.value)) setPaymentDetails({...paymentDetails, cardCvv: e.target.value})
                                                }}
                                                placeholder="123"
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl border dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 ${errors.cardCvv ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600'}`}
                                            />
                                            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                        </div>
                                        {errors.cardCvv && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.cardCvv}</p>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* UPI */}
                    <div className={`border-2 rounded-2xl transition-all overflow-hidden ${paymentMethod === 'upi' ? 'border-brand-600 bg-brand-50/30 dark:bg-brand-900/10' : 'border-gray-200 dark:border-gray-700'}`}>
                        <button 
                            onClick={() => { setPaymentMethod('upi'); setErrors({}); }}
                            className="w-full flex items-center gap-4 p-5 text-left"
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'upi' ? 'border-brand-600' : 'border-gray-300 dark:border-gray-600'}`}>
                                {paymentMethod === 'upi' && <div className="w-3 h-3 rounded-full bg-brand-600"></div>}
                            </div>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${paymentMethod === 'upi' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                <Wallet size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-900 dark:text-white">UPI / Wallet</p>
                                <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</p>
                            </div>
                        </button>
                        
                         {paymentMethod === 'upi' && (
                            <div className="px-5 pb-5 pt-0 animate-fade-in">
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">UPI ID</label>
                                <input 
                                    type="text"
                                    value={paymentDetails.upiId}
                                    onChange={e => setPaymentDetails({...paymentDetails, upiId: e.target.value})}
                                    placeholder="username@bank"
                                    className={`w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 ${errors.upiId ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600'}`}
                                />
                                {errors.upiId && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.upiId}</p>}
                                <p className="text-xs text-gray-400 mt-2">A payment request will be sent to your UPI app.</p>
                            </div>
                        )}
                    </div>

                    {/* COD */}
                    <div className={`border-2 rounded-2xl transition-all overflow-hidden ${paymentMethod === 'cod' ? 'border-brand-600 bg-brand-50/30 dark:bg-brand-900/10' : 'border-gray-200 dark:border-gray-700'}`}>
                        <button 
                            onClick={() => { setPaymentMethod('cod'); setErrors({}); }}
                            className="w-full flex items-center gap-4 p-5 text-left"
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'cod' ? 'border-brand-600' : 'border-gray-300 dark:border-gray-600'}`}>
                                {paymentMethod === 'cod' && <div className="w-3 h-3 rounded-full bg-brand-600"></div>}
                            </div>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${paymentMethod === 'cod' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                <Banknote size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-900 dark:text-white">Cash on Delivery</p>
                                <p className="text-sm text-gray-500">Pay neatly in cash upon delivery</p>
                            </div>
                        </button>
                    </div>

                    <div className="md:hidden mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center font-bold text-lg dark:text-white">
                             <span>Total</span>
                             <span>${grandTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-auto">
                        <button 
                            onClick={() => setStep('details')}
                            className="flex-none w-20 py-4 rounded-xl border border-gray-300 dark:border-gray-600 font-bold dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button 
                            onClick={handlePlaceOrderClick}
                            className="flex-1 bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30"
                        >
                            {paymentMethod === 'cod' ? 'Place Order' : `Pay $${grandTotal.toFixed(2)}`}
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
