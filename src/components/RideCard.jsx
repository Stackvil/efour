import React, { memo } from 'react';
import useStore from '../store/useStore';
import OptimizedImage from './common/OptimizedImage';

const RideCard = memo(({ ride }) => {
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
        showToast(`${ride.title} added!`);
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
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 group w-full flex flex-col h-full overflow-hidden relative border border-gray-100/50 hover:border-sunset-orange/20">
            {/* Image section - Premium height and shape */}
            <div className="w-full relative h-32 overflow-hidden">
                <OptimizedImage
                    src={ride.image}
                    alt={ride.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Age Group Floating Badge - Smaller and more subtle */}
                <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md text-charcoal-grey text-[8px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-gray-100">
                    <span className="w-1 h-1 bg-riverside-teal rounded-full animate-pulse" />
                    {ride.ageGroup || 'All Ages'}
                </div>
                {/* Status Overlay for visual depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Content section - Compact Professional Layout */}
            <div className="p-3 flex flex-col flex-grow justify-between gap-2.5">
                <div>
                    <div className="flex justify-between items-start gap-3 mb-0.5">
                        <h3 className="text-gray-900 font-black text-sm leading-tight tracking-tight uppercase group-hover:text-sunset-orange transition-colors line-clamp-1" title={ride.title}>
                            {ride.title}
                        </h3>
                        <p className="text-lg font-black text-sunset-orange leading-none shrink-0 drop-shadow-sm font-heading">
                            {typeof ride.price === 'number' ? `₹${ride.price}` : ride.price}
                        </p>
                    </div>


                </div>

                {/* Buttons Block - Streamlined */}
                <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-charcoal-grey hover:bg-black text-white text-[8px] font-black uppercase tracking-widest py-2 rounded-lg transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1"
                    >
                        Add to Cart
                    </button>
                    <button
                        onClick={handleBookNow}
                        className="w-full bg-sunset-orange hover:bg-orange-600 text-white text-[8px] font-black uppercase tracking-widest py-2 rounded-lg shadow-md shadow-sunset-orange/10 hover:shadow-sunset-orange/30 transition-all active:scale-95 flex items-center justify-center gap-1"
                    >
                        Book a Ride
                    </button>
                </div>
            </div>
        </div>
    );
});

export default RideCard;
