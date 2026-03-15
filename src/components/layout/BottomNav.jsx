import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Utensils, Play, Calendar, User, Ticket, Phone } from 'lucide-react';
import useStore from '../../store/useStore';

const BottomNav = () => {
    const { user } = useStore();

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#080C14]/60 backdrop-blur-lg border-t border-white/10 z-50 pb-safe">
            <div className="flex justify-around items-center h-16 px-4">
                <NavLink
                    to="/"
                    className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#FF7A18]' : 'text-[#AAB2C5]'}`}
                >
                    <Home size={22} />
                    <span className="text-[10px] font-bold uppercase tracking-tight">Home</span>
                </NavLink>

                <NavLink
                    to="/dine"
                    className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#FF7A18]' : 'text-[#AAB2C5]'}`}
                >
                    <div className="relative">
                        <Utensils size={22} />
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7A18] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF7A18]"></span>
                        </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tight">Dine</span>
                </NavLink>

                <NavLink
                    to="/login"
                    className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#FF7A18]' : 'text-[#AAB2C5]'}`}
                >
                    <User size={22} />
                    <span className="text-[10px] font-bold uppercase tracking-tight truncate max-w-[60px]">{user ? (user.name || 'User') : 'Profile'}</span>
                </NavLink>

                <NavLink
                    to="/contact"
                    className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#FF7A18]' : 'text-[#AAB2C5]'}`}
                >
                    <Phone size={22} />
                    <span className="text-[10px] font-bold uppercase tracking-tight">Contact</span>
                </NavLink>
                {user && (
                    <NavLink
                        to="/tickets"
                        className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#FF7A18]' : 'text-[#AAB2C5]'}`}
                    >
                        <Ticket size={22} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Your Tickets</span>
                    </NavLink>
                )}
            </div>
        </nav>
    );
};

export default BottomNav;
