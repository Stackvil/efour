import React, { useState, useEffect } from 'react';
import { LogOut, Maximize, Scan } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';

const Scanner = () => {
    const navigate = useNavigate();
    const [result, setResult] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [hasCameraError, setHasCameraError] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    useEffect(() => {
        const html5QrCode = new Html5Qrcode("qr-camera-element");

        const startScanner = () => {
            html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                    setResult(decodedText);
                    // html5QrCode.stop(); // Optional: stop scanning after read
                },
                (errorMessage) => {
                    // Ignore regular frame errors
                }
            ).then(() => {
                setIsScanning(true);
            }).catch((err) => {
                console.error(err);
                setHasCameraError(true);
            });
        };

        // Delay starting slightly to ensure DOM is ready
        setTimeout(startScanner, 300);

        return () => {
            if (html5QrCode.isScanning) {
                html5QrCode.stop().then(() => {
                    html5QrCode.clear();
                }).catch(console.error);
            }
        };
    }, []);

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
                    {!isScanning && !hasCameraError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <Maximize className="text-[#AAB2C5]/20 group-hover:text-[#FF7A18]/40 transition-colors mb-4" size={48} />
                            <p className="text-[#AAB2C5]/50 text-[10px] font-bold tracking-widest uppercase">Initializing Camera...</p>
                        </div>
                    )}
                    
                    {hasCameraError && (
                        <div className="text-center p-4 absolute z-10">
                            <p className="text-red-400 text-[10px] font-bold tracking-widest uppercase mb-2">Camera Access Denied</p>
                            <p className="text-[#AAB2C5]/50 text-[8px] uppercase">Please allow permissions.</p>
                        </div>
                    )}

                    {/* The element where the camera feed will be rendered */}
                    <div id="qr-camera-element" className={`absolute inset-0 z-0 [&>video]:object-cover [&>video]:w-full [&>video]:h-full [&>video]:rounded-3xl ${hasCameraError ? 'hidden' : ''}`}></div>
                </div>

                <p className="mt-6 text-xs text-[#AAB2C5]/60 text-center font-bold tracking-widest uppercase">Align the QR code within the frame to scan seamlessly.</p>
                
                {result && (
                    <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl w-full text-center text-emerald-400 font-bold uppercase tracking-widest text-[10px] break-all">
                        {result}
                        <button 
                            onClick={() => setResult('')} 
                            className="mt-3 w-full py-3 bg-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/30 transition-colors font-black tracking-[0.2em]"
                        >
                            CLEAR RESULT
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Scanner;
