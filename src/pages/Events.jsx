import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, ArrowRight, User, Info, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import OptimizedImage from '../components/common/OptimizedImage';
import { BASE_URL } from '../utils/api';

const Events = () => {
    const { addToCart, toggleCart, showToast } = useStore();
    const navigate = useNavigate();
    const [eventsList, setEventsList] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    });
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedSlotHour, setSelectedSlotHour] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [expectedGuests, setExpectedGuests] = useState('');
    const [booked, setBooked] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/events?location=E4`);
                if (res.ok) {
                    const data = await res.json();
                    const eventsArr = (Array.isArray(data) ? data : []).filter(Boolean);
                    setEventsList(eventsArr);
                    if (eventsArr.length > 0 && !selectedRoom) {
                        setSelectedRoom(eventsArr[0].name);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch events", err);
            } finally {
                setLoadingEvents(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        const fetchSlots = async () => {
            if (!selectedDate) {
                setSlots([]);
                return;
            }
            setLoadingSlots(true);
            try {
                const res = await fetch(`${BASE_URL}/api/bookings/slots?location=e4&date=${selectedDate}`);
                if (res.ok) {
                    const data = await res.json();
                    setSlots(data.slots || []);
                } else {
                    setSlots([]);
                }
            } catch (err) {
                console.error("Failed to fetch slots", err);
                setSlots([]);
            } finally {
                setLoadingSlots(false);
            }
        };
        fetchSlots();
    }, [selectedDate]);

    const handleBook = (e) => {
        e.preventDefault();
        const room = eventsList.find(r => r.name === selectedRoom);
        if (!room) return;
        const slot = slots.find(s => s.hour.toString() === selectedSlotHour.toString());

        const price = slot?.price || room.price;
        const timeLabel = slot ? slot.label : '';

        addToCart({
            id: `event-${room.id || room._id}-${slot?.hour || Date.now()}`,
            name: `${room.name} Booking${timeLabel ? ` (${timeLabel})` : ''}`,
            price: price,
            image: room.image,
            stall: 'Events',
            details: { date: selectedDate, time: timeLabel, hour: slot?.hour, customerName, expectedGuests }
        });

        setBooked(true);
        showToast("Booking added to cart!");

        setTimeout(() => {
            setBooked(false);
            setCustomerName('');
            setExpectedGuests('');
            setSelectedSlotHour('');
            toggleCart();
        }, 1500);
    };

    const room = eventsList.find(r => r.name === selectedRoom);
    const availableCount = slots.filter(s => s.status === 'available').length;
    const bookedCount = slots.filter(s => s.status === 'booked').length;

    return (
        <div className="bg-[#070B14] min-h-screen pt-32 pb-32 selection:bg-[#FF7A18]/30 overflow-hidden relative">
            {/* Cinematic Background Architecture */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF7A18]/5 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#5B8CFF]/5 blur-[150px] rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* --- Header Navigation Architecture --- */}
                <div className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-12 md:pb-116">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-[#FF7A18] font-black uppercase tracking-[0.5em] text-[10px] italic">Book Your Event</span>
                                <div className="w-8 h-px bg-white/10" />
                            </div>
                            <h1 className="text-4xl md:text-8xl font-black italic tracking-tighter text-[#F8FAFC] leading-[0.85] transform -skew-x-6 mb-8 uppercase">
                                Host Your <br />
                                <span className="text-gradient-primary">Special Moments.</span>
                            </h1>
                            <p className="text-[#AAB2C5] text-lg font-medium italic opacity-60 max-w-md border-l-2 border-white/10 pl-8">
                                We offer beautiful spaces for your private parties and special events.
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    {/* --- LEFT PANEL: VENUE & CALENDAR ARCHITECTURE --- */}
                    <div className="lg:col-span-7 space-y-12">
                        {loadingEvents ? (
                            <div className="p-20 text-center bg-white/5 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 shadow-2xl">
                                <div className="w-12 h-12 border-3 border-[#FF7A18] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                                <p className="text-[#AAB2C5] font-black uppercase tracking-[0.4em] text-[10px] animate-pulse italic">Loading venues...</p>
                            </div>
                        ) : !room ? (
                            <div className="p-20 text-center bg-white/5 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 shadow-2xl">
                                <Info size={40} className="text-white/10 mx-auto mb-6" />
                                <p className="text-[#F8FAFC] font-black uppercase tracking-widest italic">No Venues Found</p>
                            </div>
                        ) : (
                            <>
                                {/* Venue Hero Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                    className="glass-card p-8 rounded-[3.5rem] border border-white/10 relative overflow-hidden group"
                                >
                                    {/* Inline Room Selector Protocol */}
                                    <div className="absolute top-10 right-10 z-20">
                                        <div className="relative">
                                            <select
                                                value={selectedRoom}
                                                onChange={(e) => { setSelectedRoom(e.target.value); setSelectedSlotHour(''); }}
                                                className="bg-black text-[#F8FAFC] border border-white/10 rounded-2xl px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-4xl focus:border-[#FF7A18]/50 focus:ring-4 focus:ring-[#FF7A18]/5 outline-none appearance-none cursor-pointer transition-all pr-12 italic transform -skew-x-6"
                                            >
                                                {eventsList.map(r => <option key={r.id || r._id || r.name} value={r.name} className="bg-black">{r.name}</option>)}
                                            </select>
                                            <Zap size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#FF7A18] pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="w-full h-64 md:h-[450px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden mb-8 md:mb-10 relative">
                                        <OptimizedImage
                                            src={room.image || 'https://images.unsplash.com/photo-1519167758481-83f540f28b0f?q=80&w=1400'}
                                            alt={room.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-transparent opacity-60" />
                                    </div>

                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-3xl md:text-6xl font-black italic text-[#F8FAFC] leading-none transform -skew-x-6 group-hover:text-[#FF7A18] transition-colors duration-700 uppercase">
                                            {room.name}
                                        </h2>
                                        <div className="w-16 h-px bg-white/10" />
                                    </div>

                                    <div className="flex flex-wrap gap-4 mb-10">
                                        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-3xl text-white px-6 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest border border-white/5 shadow-inner">
                                            <User size={16} className="text-[#FF7A18]" /> {room.capacity || '20-50'} Guests
                                        </div>
                                        <div className="flex items-center gap-3 bg-[#5B8CFF]/10 text-[#5B8CFF] px-6 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest border border-[#5B8CFF]/20 shadow-[0_0_15px_rgba(91,140,255,0.15)]">
                                            <ShieldCheck size={16} /> Best Service
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem] flex gap-5 text-[#AAB2C5] text-xs font-medium backdrop-blur-3xl italic relative overflow-hidden group/policy">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-[#FF7A18] opacity-20 group-hover/policy:opacity-100 transition-opacity" />
                                        <Info size={22} className="flex-shrink-0 mt-0.5 text-[#FF7A18]" />
                                        <p className="opacity-60 group-hover:opacity-100 transition-opacity duration-700">
                                            <strong className="text-[#FF7A18] font-black uppercase tracking-widest mr-2">Note:</strong>
                                            We provide the space. Tables, chairs, and decorations must be arranged by you.
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Resource Calendar Architecture */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                                    className="glass-card p-10 md:p-12 rounded-[3.5rem] border border-white/10 shadow-3xl"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-12">
                                        <h3 className="text-3xl font-black italic text-[#F8FAFC] uppercase tracking-tighter transform -skew-x-6 leading-none">Choose Date & Time</h3>
                                        <div className="relative group/input">
                                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FF7A18] group-hover/input:scale-110 transition-transform" size={20} />
                                            <input
                                                type="date"
                                                className="pl-16 pr-8 py-5 bg-black border border-white/10 rounded-[1.5rem] font-black uppercase tracking-widest text-[#F8FAFC] text-[10px] outline-none focus:ring-4 focus:ring-[#FF7A18]/5 focus:border-[#FF7A18]/30 shadow-inner w-full sm:w-auto italic transition-all appearance-none"
                                                value={selectedDate}
                                                onChange={(e) => {
                                                    setSelectedDate(e.target.value);
                                                    setSelectedSlotHour('');
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-[#AAB2C5]/40 mb-12 italic border-b border-white/5 pb-8">
                                        <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-green-500/10 border border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]" /> Available ({availableCount})</div>
                                        <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-red-500/10 border border-red-500/30" /> Occupied ({bookedCount})</div>
                                        <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-[#5B8CFF] shadow-[0_0_15px_rgba(91,140,255,0.4)]" /> Selected</div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                        {loadingSlots ? (
                                            <div className="col-span-full py-20 text-center">
                                                <div className="w-8 h-8 border-2 border-[#AAB2C5]/20 border-t-[#FF7A18] rounded-full animate-spin mx-auto mb-4" />
                                                <p className="text-[#AAB2C5]/40 font-black uppercase tracking-widest text-[9px] italic">Loading calendar...</p>
                                            </div>
                                        ) : slots.length === 0 ? (
                                            <div className="col-span-full py-20 text-center bg-white/5 rounded-[2.5rem] border border-white/5">
                                                <Calendar size={32} className="text-white/5 mx-auto mb-4" />
                                                <p className="text-[#AAB2C5]/40 font-black uppercase tracking-widest text-[9px] italic">No slots found for {selectedDate}.</p>
                                            </div>
                                        ) : (
                                            slots.map(slot => {
                                                const isSelected = selectedSlotHour === slot.hour;
                                                const isAvailable = slot.status === 'available';
                                                const isBooked = slot.status === 'booked';
                                                const isPast = slot.status === 'past';

                                                let cardClass = "relative flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all duration-700 group/btn transform ";

                                                if (isSelected) {
                                                    cardClass += "bg-[#5B8CFF] border-[#5B8CFF] text-white shadow-[0_25px_60px_rgba(91,140,255,0.4)] scale-105 z-10 -translate-y-2";
                                                } else if (isAvailable) {
                                                    cardClass += "bg-white/5 border-white/10 text-white hover:border-[#FF7A18]/50 hover:bg-white/10 shadow-2xl cursor-pointer hover:-translate-y-2";
                                                } else if (isBooked) {
                                                    cardClass += "bg-white/5 border-red-500/10 text-white/20 opacity-40 cursor-not-allowed";
                                                } else { // past
                                                    cardClass += "bg-white/2 border-white/5 text-white/5 opacity-10 cursor-not-allowed";
                                                }

                                                return (
                                                    <motion.button
                                                        key={slot.hour}
                                                        whileHover={isAvailable && !isSelected ? { scale: 1.05 } : {}}
                                                        whileTap={isAvailable ? { scale: 0.95 } : {}}
                                                        disabled={!isAvailable}
                                                        onClick={() => setSelectedSlotHour(slot.hour)}
                                                        className={cardClass}
                                                    >
                                                        <span className="font-black italic text-lg uppercase tracking-tight mb-2 leading-none">{slot.label}</span>
                                                        <span className={`text-[10px] font-black uppercase tracking-widest italic flex items-center gap-1.5 ${isSelected ? 'text-white' : isAvailable ? 'text-[#FF7A18]' : 'text-current'}`}>
                                                            {isAvailable ? `₹${(slot.price || room.price || 0).toLocaleString('en-IN')}` : isBooked ? 'Booked' : 'Wait'}
                                                        </span>

                                                        {isAvailable && (
                                                            <div className={`absolute top-3 right-3 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#FF7A18]'} animate-pulse`} />
                                                        )}
                                                    </motion.button>
                                                );
                                            })
                                        )}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </div>

                    {/* --- RIGHT PANEL: BOOKING ENGINE ARCHITECTURE --- */}
                    <div className="lg:col-span-5 sticky top-32">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                            className="bg-[#0F172A] p-10 md:p-14 rounded-[4rem] shadow-4xl relative overflow-hidden border border-white/10 group"
                        >
                            {/* Cinematic Glow Engineering */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7A18]/5 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none group-hover:bg-[#FF7A18]/10 transition-colors duration-1000" />
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#FF7A18] border border-white/5 shadow-inner">
                                        <Zap size={20} />
                                    </div>
                                    <h2 className="text-3xl font-black italic text-[#F8FAFC] tracking-tighter uppercase transform -skew-x-6 leading-none">Book Now</h2>
                                </div>

                                <p className="text-[#AAB2C5]/50 text-xs font-medium italic mb-12 border-l border-white/10 pl-6">
                                    Enter your details below to book your event space at Efour.
                                </p>

                                <form onSubmit={handleBook} className="space-y-8">
                                    {/* Selected Telemetry Box */}
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={selectedSlotHour || 'none'}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={`w-full border rounded-[2rem] p-8 text-center transition-all duration-700 backdrop-blur-3xl shadow-2xl ${selectedSlotHour ? 'bg-[#5B8CFF]/5 border-[#5B8CFF]/30' : 'bg-white/5 border-white/5'}`}
                                        >
                                            {selectedSlotHour ? (
                                                <div className="flex flex-col gap-3 items-center">
                                                    <span className="text-xl font-black italic text-[#5B8CFF] uppercase tracking-tighter leading-none">
                                                        {new Date(selectedDate).toLocaleDateString('en-GB')}<br />
                                                        <span className="text-3xl text-white">{slots.find(s => s.hour === selectedSlotHour)?.label}</span>
                                                    </span>
                                                    <div className="h-px w-8 bg-white/10" />
                                                    <span className="text-[9px] text-[#AAB2C5]/40 font-black uppercase tracking-[0.4em] italic leading-none">Time Selected</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-4 py-4">
                                                    <Calendar size={24} className="text-white/5" />
                                                    <span className="text-[10px] text-[#AAB2C5]/30 font-black uppercase tracking-widest italic leading-relaxed max-w-[180px]">
                                                        Please select a time slot above.
                                                    </span>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>

                                    <div className="space-y-8 pt-4">
                                        <div className="group/field">
                                            <label className="text-[9px] uppercase tracking-[0.4em] font-black text-[#AAB2C5]/40 mb-4 block italic group-focus-within/field:text-[#FF7A18] transition-colors">Your Name</label>
                                            <div className="relative">
                                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-[#AAB2C5]/20 group-focus-within/field:text-[#FF7A18] transition-colors" size={20} />
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Enter your name"
                                                    className="w-full bg-black border border-white/10 rounded-[1.5rem] pl-16 pr-8 py-5 text-[#F8FAFC] placeholder-white/5 text-[10px] font-black uppercase tracking-widest italic outline-none focus:border-[#FF7A18]/50 focus:ring-4 focus:ring-[#FF7A18]/5 transition-all shadow-inner"
                                                    value={customerName}
                                                    onChange={(e) => setCustomerName(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="group/field">
                                            <label className="text-[9px] uppercase tracking-[0.4em] font-black text-[#AAB2C5]/40 mb-4 block italic group-focus-within/field:text-[#FF7A18] transition-colors">Number of Guests</label>
                                            <div className="relative">
                                                <Zap className="absolute left-6 top-1/2 -translate-y-1/2 text-[#AAB2C5]/20 group-focus-within/field:text-[#FF7A18] transition-colors" size={20} />
                                                <input
                                                    type="number"
                                                    required
                                                    placeholder="Number of guests"
                                                    min="1"
                                                    className="w-full bg-black border border-white/10 rounded-[1.5rem] pl-16 pr-8 py-5 text-[#F8FAFC] placeholder-white/5 text-[10px] font-black uppercase tracking-widest italic outline-none focus:border-[#FF7A18]/50 focus:ring-4 focus:ring-[#FF7A18]/5 transition-all shadow-inner"
                                                    value={expectedGuests}
                                                    onChange={(e) => setExpectedGuests(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Valuation Engine */}
                                    <div className="flex justify-between items-center py-10 border-t border-white/5 mt-10">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#AAB2C5]/30 italic mb-1">Total Price</span>
                                            <span className="text-white/5 font-black text-xs uppercase italic">Confirm Order</span>
                                        </div>
                                        {selectedSlotHour ? (
                                            <div className="flex flex-col items-end">
                                                <span className="text-4xl md:text-5xl font-black text-gradient-price drop-shadow-[0_25px_45px_rgba(255,122,24,0.4)] italic tracking-tighter leading-none">
                                                    ₹{(slots.find(s => s.hour === selectedSlotHour)?.price || room?.price || 0).toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-4xl font-black text-white/5 italic tracking-tighter">&mdash;</span>
                                        )}
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={!selectedSlotHour || booked}
                                            className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] italic flex items-center justify-center gap-4 transition-all duration-700 shadow-4xl transform active:scale-95 ${selectedSlotHour
                                                ? 'btn-premium hover:shadow-[0_45px_80px_rgba(255,122,24,0.3)] hover:-translate-y-2'
                                                : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5'
                                                }`}
                                        >
                                            {booked ? (
                                                <span className="text-[#22C55E] flex items-center gap-3 animate-pulse"><CheckCircle2 size={20} /> Booking Added</span>
                                            ) : selectedSlotHour ? (
                                                <>Add to Cart <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" /></>
                                            ) : (
                                                <>Select a Slot <Zap size={18} className="opacity-20" /></>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-16 flex items-center justify-between border-t border-white/5 pt-12">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] uppercase text-[#AAB2C5]/30 font-black tracking-[0.5em] mb-2 italic">Support Eluru</span>
                                        <span className="text-[10px] font-black text-white/60 italic tracking-widest">+91 70369 23456</span>
                                    </div>
                                    <div className="w-px h-10 bg-white/5" />
                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] uppercase text-[#AAB2C5]/30 font-black tracking-[0.5em] mb-2 italic">Data Stream</span>
                                        <span className="text-[10px] font-black text-white/60 italic tracking-widest group-hover:text-[#FF7A18] transition-colors">efoureluru@gmail.com</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Events;

