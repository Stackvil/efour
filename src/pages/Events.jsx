import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, ArrowRight, User, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import OptimizedImage from '../components/common/OptimizedImage';

const Events = () => {
    const { addToCart, toggleCart } = useStore();
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

    React.useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events?location=E4');
                if (res.ok) {
                    const data = await res.json();
                    const eventsArr = Array.isArray(data) ? data : [];
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

    React.useEffect(() => {
        const fetchSlots = async () => {
            if (!selectedDate) {
                setSlots([]);
                return;
            }
            setLoadingSlots(true);
            try {
                const res = await fetch(`/api/bookings/slots?location=e4&date=${selectedDate}`);
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
        <div className="bg-[#FAFAFA] min-h-screen py-24">
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                {/* Header Title Optional */}
                <div className="mb-12">
                    <span className="text-sunset-orange font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Event Management</span>
                    <h1 className="text-4xl md:text-5xl font-heading font-black mb-4">Host Your<br /><span className="text-riverside-teal">Special Moments.</span></h1>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* LEFT PANEL */}
                    <div className="lg:col-span-7 space-y-8">
                        {loadingEvents ? (
                            <div className="p-8 text-center text-gray-500 font-bold animate-pulse bg-white rounded-[2rem] shadow-sm">Loading Venues...</div>
                        ) : !room ? (
                            <div className="p-8 text-center text-gray-500 font-bold bg-white rounded-[2rem] shadow-sm">No venues found.</div>
                        ) : (
                            <>
                                {/* Venue Detail Card */}
                                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
                                    {/* Inline Room Selector (Top Right Dropdown) */}
                                    <div className="absolute top-8 right-8 z-10">
                                        <select
                                            value={selectedRoom}
                                            onChange={(e) => { setSelectedRoom(e.target.value); setSelectedSlotHour(''); }}
                                            className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold shadow-lg focus:outline-none focus:ring-2 focus:ring-sunset-orange text-charcoal-grey appearance-none pr-8 cursor-pointer"
                                            style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%232C3E50%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto' }}
                                        >
                                            {eventsList.map(r => <option key={r.id || r._id || r.name} value={r.name}>{r.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="w-full h-72 rounded-[1.5rem] overflow-hidden mb-8 relative">
                                        <OptimizedImage
                                            src={room.image || 'https://images.unsplash.com/photo-1519167758481-83f540f28b0f?q=80&w=1400'}
                                            alt={room.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h2 className="text-3xl font-heading font-black text-charcoal-grey mb-4">{room.name}</h2>

                                    <div className="flex flex-wrap gap-3 mb-6">
                                        <div className="flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-[1rem] text-sm font-bold border border-gray-100">
                                            <User size={16} className="text-sunset-orange" /> {room.capacity || '20-50'} People
                                        </div>
                                        <div className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-[1rem] text-sm font-bold border border-teal-100">
                                            <CheckCircle2 size={16} className="text-riverside-teal" /> Parties & Birthdays
                                        </div>
                                    </div>

                                    <div className="bg-[#FFF8F5] border border-[#FFE8DF] p-4 rounded-2xl flex gap-3 text-[#A85025] text-sm">
                                        <Info size={18} className="flex-shrink-0 mt-0.5 text-sunset-orange" />
                                        <p><strong className="font-bold">Customer Policy:</strong> We provide the space only. Tables, chairs, decor & cake must be managed by you.</p>
                                    </div>
                                </div>

                                {/* Available Slots Calendar */}
                                <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                        <h3 className="text-2xl font-heading font-black text-charcoal-grey">Available Slots</h3>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-sunset-orange" size={18} />
                                            <input
                                                type="date"
                                                className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-sunset-orange focus:border-sunset-orange shadow-sm w-full sm:w-auto"
                                                value={selectedDate}
                                                onChange={(e) => {
                                                    setSelectedDate(e.target.value);
                                                    setSelectedSlotHour('');
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-500 mb-8">
                                        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full bg-green-100 border-2 border-green-500" /> Available ({availableCount})</div>
                                        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full bg-red-50 border-2 border-red-300" /> Booked ({bookedCount})</div>
                                        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full bg-riverside-teal border-2 border-riverside-teal" /> Selected</div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {loadingSlots ? (
                                            <div className="col-span-full py-12 text-center text-gray-400 font-bold animate-pulse">Checking Calendar...</div>
                                        ) : slots.length === 0 ? (
                                            <div className="col-span-full py-12 text-center text-gray-400 font-bold">No slots available for {selectedDate}.</div>
                                        ) : (
                                            slots.map(slot => {
                                                const isSelected = selectedSlotHour === slot.hour;
                                                const isAvailable = slot.status === 'available';
                                                const isBooked = slot.status === 'booked';

                                                let btnClass = "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ";

                                                if (isSelected) {
                                                    btnClass += "bg-riverside-teal border-riverside-teal text-white shadow-lg scale-[1.02] transform ring-4 ring-teal-50";
                                                } else if (isAvailable) {
                                                    btnClass += "bg-white border-green-100 text-green-600 hover:border-green-400 hover:bg-green-50 shadow-sm cursor-pointer";
                                                } else if (isBooked) {
                                                    btnClass += "bg-red-50 border-red-100 text-red-400 opacity-60 cursor-not-allowed";
                                                } else { // past
                                                    btnClass += "bg-gray-50 border-gray-100 text-gray-300 opacity-50 cursor-not-allowed";
                                                }

                                                return (
                                                    <button
                                                        key={slot.hour}
                                                        disabled={!isAvailable}
                                                        onClick={() => setSelectedSlotHour(slot.hour)}
                                                        className={btnClass}
                                                    >
                                                        <span className="font-bold whitespace-nowrap text-[15px]">{slot.label}</span>
                                                        <span className={`text-xs mt-1.5 font-bold ${isSelected ? 'text-teal-100' : isAvailable ? 'text-green-500' : isBooked ? 'text-red-300' : 'text-gray-400'}`}>
                                                            {isAvailable ? `₹${(slot.price || room.price || 0).toLocaleString('en-IN')}` : isBooked ? 'Booked' : 'Past'}
                                                        </span>
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* RIGHT PANEL - BOOKING ENGINE */}
                    <div className="lg:col-span-5 sticky top-32">
                        <div className="bg-[#2A2B2A] text-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                            {/* Subtle background glow */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />

                            <h2 className="text-3xl font-heading font-black mb-2 tracking-tight">Booking Engine</h2>
                            <p className="text-gray-400 text-sm mb-10">Select a slot on the left, fill in your details, and confirm.</p>

                            <form onSubmit={handleBook} className="space-y-6 relative z-10">

                                {/* Slot Info Box */}
                                <div className={`w-full border rounded-xl px-5 py-4 text-center transition-colors ${selectedSlotHour ? 'bg-riverside-teal/10 border-riverside-teal/30' : 'bg-white/5 border-white/10'}`}>
                                    {selectedSlotHour ? (
                                        <div className="flex flex-col gap-1 items-center">
                                            <span className="text-base font-bold text-teal-400">
                                                {new Date(selectedDate).toLocaleDateString('en-GB')}, {slots.find(s => s.hour === selectedSlotHour)?.label}
                                            </span>
                                            <span className="text-xs text-teal-600/60 font-black uppercase tracking-widest">Selected Slot</span>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-500 font-bold flex items-center justify-center gap-2">
                                            &larr; Pick a green slot from the calendar
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-5 pt-2">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2.5 block">Your Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-sunset-orange transition-colors" size={18} />
                                            <input
                                                type="text"
                                                required
                                                placeholder="Full name"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 font-medium focus:border-sunset-orange focus:ring-1 focus:ring-sunset-orange focus:outline-none transition-all outline-none"
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2.5 block">Expected Guests</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-sunset-orange transition-colors" size={18} />
                                            <input
                                                type="number"
                                                required
                                                placeholder="e.g. 25"
                                                min="1"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 font-medium focus:border-sunset-orange focus:ring-1 focus:ring-sunset-orange focus:outline-none transition-all outline-none"
                                                value={expectedGuests}
                                                onChange={(e) => setExpectedGuests(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Total Price */}
                                <div className="flex justify-between items-center py-5 border-t border-white/10 mt-8 mb-4">
                                    <span className="text-gray-400 font-bold text-sm">Total</span>
                                    {selectedSlotHour ? (
                                        <span className="text-3xl font-black text-riverside-teal">
                                            ₹{(slots.find(s => s.hour === selectedSlotHour)?.price || room?.price || 0).toLocaleString('en-IN')}
                                        </span>
                                    ) : (
                                        <span className="text-3xl font-black text-gray-600">&mdash;</span>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={!selectedSlotHour || booked}
                                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 ${selectedSlotHour
                                            ? 'bg-white text-[#2A2B2A] hover:bg-gray-100 shadow-xl shadow-white/10 transform hover:-translate-y-1'
                                            : 'bg-white/5 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        {booked ? (
                                            <span className="text-green-500 flex items-center gap-2"><CheckCircle2 size={18} /> Request Sent!</span>
                                        ) : selectedSlotHour ? (
                                            <>Confirm Reservation <ArrowRight size={18} /></>
                                        ) : (
                                            <>Select a Slot First <ArrowRight size={18} className="opacity-50" /></>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-10 flex items-center gap-8 border-t border-white/5 pt-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1">Inquiries</span>
                                    <span className="text-sm font-bold text-gray-300">+91 70369 23456</span>
                                </div>
                                <div className="w-px h-8 bg-white/10"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1">Support</span>
                                    <span className="text-sm font-bold text-gray-300">efoureluru@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Events;
