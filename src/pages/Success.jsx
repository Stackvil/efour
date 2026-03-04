import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, User, X } from 'lucide-react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';

const Success = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const orderId = searchParams.get('orderId');
    const { clearCart } = useStore();

    const status = searchParams.get('status');
    const isSuccess = status === 'success';

    const [orderDetails, setOrderDetails] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`/api/payment/status/${orderId}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrderDetails(data.order || data);
                }
            } catch (err) {
                console.error('Failed to fetch order status', err);
            } finally {
                setLoading(false);
            }
        };

        if (isSuccess) {
            clearCart();
        }
        fetchOrder();
    }, [isSuccess, clearCart, orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-creamy-white flex items-center justify-center p-6 pt-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sunset-orange"></div>
            </div>
        );
    }
    if (!isSuccess && status) {
        return (
            <div className="min-h-screen bg-creamy-white flex items-center justify-center p-6 pt-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-red-500/10 max-w-lg w-full text-center border border-red-100"
                >
                    <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
                        <X size={48} />
                    </div>

                    <h1 className="text-4xl font-heading font-bold text-charcoal-grey mb-4 tracking-tighter">Payment Failed</h1>
                    <p className="text-gray-500 mb-8">Your transaction could not be completed. Please try again.</p>

                    <div className="space-y-4">
                        <Link to="/" className="w-full btn-orange py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold">
                            Try Again <ArrowRight size={20} />
                        </Link>
                        <Link to="/contact" className="block text-sm text-gray-400 font-bold uppercase tracking-widest hover:text-charcoal-grey">
                            Contact Support
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-creamy-white flex items-center justify-center p-6 pt-24">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-riverside-teal/10 max-w-lg w-full text-center border border-riverside-teal/5"
            >
                <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle size={48} />
                </div>

                <h1 className="text-4xl font-heading font-bold text-charcoal-grey mb-6 tracking-tighter">Order Confirmed!</h1>
                {/* ... rest of success UI ... */}

                <div className="flex justify-center mb-8">
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${orderId || 'ETH-782'}`}
                        alt="Order QR Code"
                        className="rounded-xl border-4 border-white shadow-lg"
                    />
                </div>

                {/* Tickets Section */}
                <div className="space-y-6 mb-8 text-left">
                    <h2 className="text-xl font-bold text-charcoal-grey text-center">Your Tickets</h2>
                    {(orderDetails?.items || []).map((item) => (
                        <div key={item.id || item._id} className="bg-white border rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-sunset-orange" />
                            <div className="flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                                <div>
                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity} • ₹{item.price * item.quantity}</p>
                                    <p className="text-[10px] uppercase font-bold text-riverside-teal tracking-widest mt-1">Valid for Today</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center border-l border-dashed border-gray-300 pl-4">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=ETH-${orderId || '782'}-${item.id || item._id}`}
                                    alt="QR"
                                    className="w-16 h-16 pointer-events-none"
                                />
                                <span className="text-[10px] font-bold text-gray-400 mt-1">SCAN ME</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <Link to="/login" className="w-full btn-orange py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold">
                        Go to Profile <User size={20} />
                    </Link>
                    <Link to="/dine" className="w-full text-riverside-teal font-bold hover:underline flex items-center justify-center gap-2">
                        Browse More Food <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="mt-12 p-6 bg-gray-50 rounded-2xl text-left border border-gray-100">
                    <h3 className="font-bold text-charcoal-grey mb-2">Next Steps</h3>
                    <ul className="text-sm text-gray-500 space-y-2">
                        <li>• Show your order ID at the respective stall.</li>
                        <li>• Real-time updates will be sent to your profile.</li>
                        <li>• Enjoy your meal on the river bank!</li>
                    </ul>
                </div>
            </motion.div>
        </div>
    );
};

export default Success;
