import React, { memo } from 'react';
import useStore from '../store/useStore';
import OptimizedImage from './common/OptimizedImage';
import { ShoppingBag, Zap, Sparkles } from 'lucide-react';

const RideCard = memo(({ ride, priority = false }) => {
    const addToCart = useStore(state => state.addToCart);
    const openCart = useStore(state => state.openCart);
    const showToast = useStore(state => state.showToast);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart({
            id: `play-${ride.id}`,
            name: ride.title,
            price: typeof ride.price === 'number' ? ride.price : 0,
            image: ride.image,
            stall: ride.category
        }, 1);
        showToast(`${ride.title} added to cart!`);
    };

    const handleBookNow = (e) => {
        e.stopPropagation();
        addToCart({
            id: `play-${ride.id}`,
            name: ride.title,
            price: typeof ride.price === 'number' ? ride.price : 0,
            image: ride.image,
            stall: ride.category
        }, 1);
        openCart();
    };

    return (
        <div className="glass-card rounded-[1.2rem] transition-all duration-500 group w-full flex flex-col h-full overflow-hidden relative border border-white/10 hover:border-[#FF7A18]/50 hover:shadow-[0_40px_100px_rgba(255,122,24,0.15)]">
            {/* --- Image Architecture --- */}
            <div className="w-full relative h-32 sm:h-36 overflow-hidden">
                <OptimizedImage
                    src={ride.image}
                    alt={ride.title}
                    priority={priority}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out brightness-90 group-hover:brightness-105"
                />

                {/* Age Group Floating Badge - Premium Design */}
                <div className="absolute top-2 right-2 bg-white/5 backdrop-blur-xl px-2 py-1 rounded-lg shadow-2xl flex items-center gap-1.5 border border-white/10 group-hover:border-[#FF7A18]/50 transition-all duration-500">
                    <div className="w-1 h-1 bg-[#FF7A18] rounded-full animate-pulse shadow-[0_0_8px_#FF7A18]" />
                    <span className="text-white text-[8px] font-bold uppercase tracking-widest italic">{ride.ageGroup || 'All Ages'}</span>
                </div>

                {/* Status Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
            </div>

            {/* --- Content Architecture --- */}
            <div className="p-4 flex flex-col flex-grow justify-between gap-3">
                <div className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                        <h3 className="text-[#F8FAFC] font-black text-base leading-tight tracking-tighter uppercase group-hover:text-[#FF7A18] transition-colors line-clamp-2 transform group-hover:-skew-x-6 duration-700" title={ride.title}>
                            {ride.title}
                        </h3>
                        <div className="shrink-0 flex flex-row sm:flex-col items-center sm:items-end gap-1.5 sm:gap-0">
                            <span className="text-[7px] font-bold text-[#FF7A18] uppercase tracking-[0.2em] italic opacity-60">Value</span>
                            <p className="text-base sm:text-lg font-black text-gradient-price leading-none drop-shadow-xl font-heading italic">
                                {typeof ride.price === 'number' ? `₹${ride.price}` : ride.price}
                            </p>
                        </div>
                    </div>

                    <p className="text-[#AAB2C5]/60 text-[9px] sm:text-[10px] font-medium leading-relaxed line-clamp-2 italic border-l border-white/10 pl-3 group-hover:text-[#AAB2C5] transition-colors">
                        {ride.desc || 'Experience the future of thrill with our premium architectural attractions.'}
                    </p>
                </div>

                {/* --- Action Matrix --- stacked on mobile for usability */}
                <div className="flex flex-col xl:flex-row gap-2 pt-2 border-t border-white/5">
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[8px] font-bold uppercase tracking-[0.2em] py-2.5 rounded-lg transition-all border border-white/10 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 group/btn"
                    >
                        <ShoppingBag size={10} className="group-hover/btn:scale-110 transition-transform" />
                        Add
                    </button>
                    <button
                        onClick={handleBookNow}
                        className="btn-premium flex-1 text-[8px] py-2.5 rounded-lg flex items-center justify-center gap-1.5 group/btn-p"
                    >
                        <Zap size={10} className="fill-current group-hover/btn-p:animate-pulse" />
                        Book
                    </button>
                </div>
            </div>

            {/* Aesthetic Side Ribbon */}
            <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-gradient-to-b from-[#FF7A18] to-transparent transition-all duration-1000 ease-in-out" />
        </div>
    );
});

export default RideCard;

