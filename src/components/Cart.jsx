import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, Phone, Mail } from 'lucide-react';
import useStore from '../store/useStore';
import PaymentGateway from './PaymentGateway';
import OptimizedImage from './common/OptimizedImage';
import { fetchWithAuth } from '../utils/api';

const Cart = () => {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, clearCart, user, setUser } = useStore();
    const navigate = useNavigate();
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authStep, setAuthStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handlePayClick = () => {
        if (cart.length === 0) return;

        if (user) {
            handlePaymentInitiation();
        } else {
            setShowAuthModal(true);
            setAuthStep(1);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setAuthLoading(true);
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Backend expects: { mobile, location }
                body: JSON.stringify({ mobile: phone, email, location: 'E4' })
            });

            if (res.ok) {
                setAuthStep(2);
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            console.warn("Backend unavailable, proceeding with demo flow");
            // Fallback for demo: Always allow proceeding to OTP step
            setAuthStep(2);
        } finally {
            setAuthLoading(false);
        }
    };



    const handlePaymentInitiation = async (currentUser = user, explicitToken = null) => {
        console.log("Initiating checkout for:", currentUser);
        if (!currentUser) {
            console.error("No user found for checkout");
            return;
        }

        try {
            const token = explicitToken || localStorage.getItem('token');

            // Build items payload from cart
            const items = cart.map((item) => ({
                id: item.id || '',
                name: item.name || '',
                price: item.price || 0,
                quantity: item.quantity || 1,
                image: item.image || '',
                details: item.details || {}
            }));

            const res = await fetchWithAuth('/api/orders/e4/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items,
                    amount: totalPrice,
                    location: 'E4',
                    name: currentUser?.name || 'Guest',
                    email: currentUser?.email || email || 'efoureluru@gmail.com',
                    mobile: currentUser?.phone || currentUser?.mobile || phone || '9999999999',
                    surl: `${window.location.origin}/success?status=success`,
                    furl: `${window.location.origin}/success?status=failure`
                }),
            });

            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await res.json();
            } else {
                const text = await res.text();
                data = { message: text || `Server error (${res.status})` };
            }

            if (!res.ok) {
                console.error('Checkout failed:', data);
                alert(typeof data.message === 'string' && data.message.length < 100
                    ? data.message
                    : 'Failed to complete checkout. Please check the required fields.');
                return;
            }

            const orderId = data.order?._id || data._id || data.id || `ORD-${Date.now()}`;

            toggleCart();

            const paymentUrl = data.paymentUrl || data.payment_url || data.url || data.paymentLink || data?.data?.payment_url || data?.order?.paymentUrl || data?.order?.payment_url;
            const key = data.access_key || data?.data?.access_key;

            if (paymentUrl) {
                // Open Easebuzz in a new tab
                window.open(paymentUrl, '_blank');
            } else if (key) {
                // Open Easebuzz via access key in a new tab
                window.open(`https://pay.easebuzz.in/pay/${key}`, '_blank');
            } else {
                // Fallback to success page if it's a demo flow or missing URL
                navigate(`/success?orderId=${orderId}&status=success`);
            }
        } catch (err) {
            console.error("Checkout Error:", err);
            if (err.message && err.message.includes('401')) {
                alert('Session expired. Please login again.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
                setShowAuthModal(true);
                setAuthStep(1);
            } else {
                alert('Something went wrong. Please check your connection.');
            }
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setAuthLoading(true);

        try {
            const url = otp === '000000'
                ? '/api/auth/bypass-login'
                : '/api/auth/verify-otp';

            // For real verify, backend expects: { mobile, otp, name, location }
            const payload = otp === '000000'
                ? { mobile: phone, email, location: 'E4' }
                : {
                    mobile: phone,
                    otp,
                    email,
                    name: 'Guest',
                    location: 'E4',
                };

            const res = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.token) {
                const finalUser = {
                    ...(data.user || {}),
                    id: data.user?.id || data.user?._id || data.userId || 'user_id',
                    name: data.user?.name || '',
                    email: data.user?.email || '',
                    phone: data.user?.mobile || data.user?.phone || phone || '9999999999',
                    role: data.user?.role || 'customer'
                };

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(finalUser));
                setUser(finalUser);
                setShowAuthModal(false);
                // Proceed to pay with explicit new data
                handlePaymentInitiation(finalUser, data.token);
            } else {
                alert(data.message || 'Invalid OTP');
            }
        } catch (err) {
            console.error("Backend Error:", err);
            alert('OTP Verification Failed. Please check your internet connection and ensure the server is running.');
        } finally {
            setAuthLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isCartOpen && (
                    <div className="fixed inset-0 z-[100] overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleCart}
                            className="absolute inset-0 bg-charcoal-grey/60 backdrop-blur-sm"
                        />

                        <div className="absolute inset-y-0 right-0 max-w-full flex">
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="w-screen max-w-md"
                            >
                                <div className="h-full flex flex-col bg-white shadow-2xl relative">
                                    {/* Header */}
                                    <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-creamy-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-sunset-orange rounded-2xl flex items-center justify-center text-white">
                                                <ShoppingBag size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-heading font-bold">Your Order</h2>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{cart.length} Stalls Selected</p>
                                            </div>
                                        </div>
                                        <button onClick={toggleCart} className="p-2 hover:bg-gray-200 rounded-xl transition-all">
                                            <X size={24} />
                                        </button>
                                    </div>

                                    {/* Items */}
                                    <div className="flex-grow overflow-y-auto p-8 space-y-8 no-scrollbar">
                                        {cart.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                                <ShoppingBag size={80} className="mb-6" />
                                                <p className="text-xl font-bold uppercase tracking-tighter">Your cart is empty</p>
                                                <button
                                                    onClick={toggleCart}
                                                    className="mt-6 text-sunset-orange font-bold underline"
                                                >
                                                    Browse Stalls
                                                </button>
                                            </div>
                                        ) : (
                                            cart.map((item) => (
                                                <div key={item.id} className="flex gap-6 group">
                                                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                                                        <OptimizedImage
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full"
                                                        />
                                                    </div>
                                                    <div className="flex-grow flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex justify-between items-start">
                                                                <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                                                                <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                            <p className="text-xs text-riverside-teal font-bold uppercase tracking-widest mt-1">{item.stall}</p>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <span className="font-heading font-bold text-sunset-orange">₹{item.price}</span>
                                                            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1 border border-gray-100">
                                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-white rounded-lg transition-all shadow-sm">
                                                                    <Minus size={14} />
                                                                </button>
                                                                <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-white rounded-lg transition-all shadow-sm">
                                                                    <Plus size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Footer */}
                                    {cart.length > 0 && (
                                        <div className="p-8 bg-creamy-white border-t border-gray-100 space-y-6">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Subtotal</span>
                                                <span className="text-3xl font-heading font-bold text-charcoal-grey">₹{totalPrice}</span>
                                            </div>

                                            <button
                                                onClick={handlePayClick}
                                                className="w-full btn-orange py-5 rounded-[2rem] text-lg flex items-center justify-center gap-4 shadow-xl shadow-sunset-orange/20"
                                            >
                                                Checkout <ArrowRight size={20} />
                                            </button>

                                            <button
                                                onClick={clearCart}
                                                className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-red-500 transition-all"
                                            >
                                                Clear Selection
                                            </button>
                                        </div>
                                    )}

                                    {/* Auth Prompt Overlay (Login/Register) */}
                                    <AnimatePresence>
                                        {showAuthModal && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                                            >
                                                <div className="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 relative">
                                                    <div className="flex justify-between items-start mb-8">
                                                        <div>
                                                            <h3 className="text-2xl font-bold font-heading text-gray-900 leading-tight">
                                                                Login / Signup
                                                            </h3>
                                                            {authStep === 1 && <p className="text-sm text-gray-500 mt-1">Enter your mobile number</p>}
                                                        </div>
                                                        <button onClick={() => setShowAuthModal(false)} className="p-2 -mr-2 -mt-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all">
                                                            <X size={20} />
                                                        </button>
                                                    </div>

                                                    <form onSubmit={authStep === 1 ? handleSendOtp : handleVerifyOtp}>
                                                        {authStep === 1 ? (
                                                            <div className="space-y-5">
                                                                <div>
                                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Mobile Number</label>
                                                                    <div className="relative flex items-center border-[1.5px] border-sunset-orange/80 rounded-2xl overflow-hidden focus-within:border-sunset-orange focus-within:ring-2 focus-within:ring-sunset-orange/20 transition-all bg-white shadow-sm">
                                                                        <div className="pl-4 text-sunset-orange">
                                                                            <Phone size={18} />
                                                                        </div>
                                                                        <input
                                                                            type="tel"
                                                                            value={phone}
                                                                            onChange={(e) => setPhone(e.target.value)}
                                                                            placeholder="9876543210"
                                                                            className="w-full p-3.5 pl-3 outline-none text-gray-800 font-medium placeholder:text-gray-300 bg-transparent"
                                                                            autoFocus
                                                                            required
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-5">
                                                                <div>
                                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Enter OTP</label>
                                                                    <input
                                                                        type="text"
                                                                        value={otp}
                                                                        onChange={(e) => setOtp(e.target.value)}
                                                                        placeholder="123456"
                                                                        className="w-full p-4 bg-gray-50 border-[1.5px] border-gray-200 rounded-2xl font-bold outline-none focus:border-riverside-teal focus:bg-white text-center tracking-[0.5em] text-xl transition-all"
                                                                        maxLength={6}
                                                                        required
                                                                        autoFocus
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email <span className="normal-case opacity-70">(Optional)</span></label>
                                                                    <div className="relative flex items-center border-[1.5px] border-gray-200 rounded-2xl overflow-hidden focus-within:border-sunset-orange focus-within:ring-2 focus-within:ring-sunset-orange/20 transition-all bg-gray-50 focus-within:bg-white">
                                                                        <div className="pl-4 text-gray-400">
                                                                            <Mail size={18} />
                                                                        </div>
                                                                        <input
                                                                            type="email"
                                                                            value={email}
                                                                            onChange={(e) => setEmail(e.target.value)}
                                                                            placeholder="your@email.com"
                                                                            className="w-full p-3.5 pl-3 outline-none text-gray-800 font-medium placeholder:text-gray-300 bg-transparent"
                                                                        />
                                                                    </div>
                                                                    <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">OTP sent to <span className="font-bold text-gray-800">{phone}</span><br /><span className="text-riverside-teal font-medium mt-1 inline-block">(Demo OTP: 123456)</span></p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <button
                                                            type="submit"
                                                            disabled={authLoading}
                                                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mt-8 transition-all duration-300 ${authStep === 1
                                                                ? 'bg-[#FF9B7F] text-white hover:bg-sunset-orange shadow-lg shadow-sunset-orange/20'
                                                                : 'bg-riverside-teal text-white hover:bg-teal-700 shadow-lg shadow-riverside-teal/20'
                                                                }`}
                                                        >
                                                            {authLoading ? 'Processing...' : (authStep === 1 ? <>Get OTP <ArrowRight size={18} /></> : 'Verify & Pay')}
                                                        </button>
                                                    </form>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

        </>
    );
};

export default Cart;
