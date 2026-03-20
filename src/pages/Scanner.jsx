import React, { useState } from 'react';
import { LogOut, Maximize, Scan } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Scanner = () => {
    const navigate = useNavigate();
    const [result, setResult] = useState('');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center font-sans text-white p-6 relative overflow-hidden">
            <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-[#FF7A18]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-[#5B8CFF]/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="fixed top-0 w-full p-6 flex justify-between items-center z-10 bg-white/5 backdrop-blur-xl border-b border-white/10">
                <div className="flex items-center gap-4">
                    <Scan className="text-[#FF7A18]" size={28} />
                    <h1 className="text-xl font-black uppercase tracking-[0.3em] text-white italic">E4 Scanner</h1>
                </div>
                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                    <LogOut size={18} /> Exit
                </button>
            </header>

            {/* Main Scanner Area */}
            <div className="mt-20 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 w-full max-w-sm flex flex-col items-center shadow-2xl relative z-10">
                <h2 className="text-2xl font-black uppercase tracking-[0.2em] italic mb-6">Ticket Scanner</h2>
                
                <div className="relative w-full aspect-square border-4 border-dashed border-[#AAB2C5]/30 rounded-3xl flex items-center justify-center bg-black/40 overflow-hidden group hover:border-[#FF7A18]/50 transition-colors">
                    <Maximize className="absolute text-[#AAB2C5]/20 group-hover:text-[#FF7A18]/40 transition-colors" size={64} />
                    <p className="text-[#AAB2C5]/50 text-sm font-bold tracking-widest uppercase mt-24">Camera Access Required</p>
                    {/* Real scanner logic would mount here */}
                </div>

                <p className="mt-6 text-xs text-[#AAB2C5]/60 text-center font-bold tracking-widest uppercase">Align the QR code within the frame to scan seamlessly.</p>
                
                {result && (
                    <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl w-full text-center text-emerald-400 font-bold uppercase tracking-widest text-xs">
                        {result}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Scanner;
