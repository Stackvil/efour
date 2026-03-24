import React, { memo } from 'react';
import useStore from '../store/useStore';
import OptimizedImage from './common/OptimizedImage';
import { ShoppingBag, Zap, Sparkles } from 'lucide-react';

const RideCard = ({ ride, priority = false }) => {
    const addToCart = useStore(state => state.addToCart);
    const openCart = useStore(state => state.openCart);
    const showToast = useStore(state => state.showToast);

    const handleAddToCart = (e) => {
        if (e) e.stopPropagation();
        
        const cartItem = {
            id: `play-${ride.id}`,
            name: ride.title,
            price: typeof ride.price === 'number' ? ride.price : (parseFloat(ride.price) || 0),
            image: ride.image,
            stall: ride.category || 'Ride',
            quantity: 1
        };

        addToCart(cartItem, 1);
        showToast(`${ride.title} added to cart!`);
    };

    const handleBookNow = (e) => {
        if (e) e.stopPropagation();
        
        const cartItem = {
            id: `play-${ride.id}`,
            name: ride.title,
            price: typeof ride.price === 'number' ? ride.price : (parseFloat(ride.price) || 0),
            image: ride.image,
            stall: ride.category || 'Ride',
            quantity: 1
        };

        addToCart(cartItem, 1);
        openCart();
    };

    return (
        <div className="glass-card rounded-[1.5rem] transition-all duration-500 group w-full flex flex-col h-full overflow-hidden relative border border-white/5 hover:border-white/10">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            {/* --- Image Architecture --- */}
            <div className="w-full relative h-32 sm:h-36 overflow-hidden">
                <OptimizedImage
                    src={ride.image}
                    alt={ride.title}
                    priority={priority}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out brightness-90 group-hover:brightness-105"
                />

                {/* Age Group Badge - Muted Glass */}
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/5 flex items-center gap-2">
                    <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                    <span className="text-white/60 text-[9px] font-bold uppercase tracking-wider">{ride.ageGroup || 'All Ages'}</span>
                </div>

                {/* Status Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
            </div>

            {/* --- Content Architecture --- */}
            <div className="p-4 flex flex-col flex-grow justify-between gap-3">
                <div className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                        <h3 className="text-white font-bold text-[13px] leading-tight tracking-tight group-hover:text-indigo-400 transition-all duration-300 line-clamp-2" title={ride.title}>
                            {ride.title}
                        </h3>
                        <div className="shrink-0 flex flex-row sm:flex-col items-center sm:items-end gap-1.5 sm:gap-0">
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">PRICE</span>
                            <p className="text-base font-bold text-white leading-none">
                                {typeof ride.price === 'number' ? `₹${ride.price}` : ride.price}
                            </p>
                        </div>
                    </div>

                    <p className="text-slate-400 text-[10px] font-medium leading-relaxed line-clamp-2 transition-colors">
                        {ride.desc || 'Enjoy a fun and safe ride with us.'}
                    </p>
                </div>

                {/* --- Action Matrix --- stacked on mobile for usability */}
                <div className="flex flex-col xl:flex-row gap-2 pt-2 border-t border-white/5 relative z-20">
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className="flex-1 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all border border-white/5 active:scale-95 flex items-center justify-center gap-2 group/btn cursor-pointer"
                    >
                        <ShoppingBag size={12} />
                        Add
                    </button>
                    <button
                        type="button"
                        onClick={handleBookNow}
                        className="btn-premium flex-1 text-[10px] py-2.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 shadow-none cursor-pointer"
                    >
                        <Zap size={10} className="fill-current" />
                        Book
                    </button>
                </div>
            </div>

            {/* Side Ribbon Accent */}
            <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-gradient-to-b from-indigo-500 to-transparent transition-all duration-700 ease-in-out" />
        </div>
    );
};

export default RideCard;

