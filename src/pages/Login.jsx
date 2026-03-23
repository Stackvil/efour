import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { Trash2, User, Edit2, Save, X, Phone, ArrowRight, Mail, Check, ChevronRight, Zap, Trophy, LogOut, Shield, Key, Fingerprint, Activity } from 'lucide-react';
import { sendOtp, verifyOtp, logout as apiLogout, deleteAccount, fetchWithAuth, BASE_URL } from '../utils/api';

const Login = () => {
    const { user, setUser } = useStore();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Phone Entry, 2: OTP Entry
    const [loading, setLoading] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    // Profile Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');

    const handleStartEdit = () => {
        setEditName(user.name || '');
        setEditEmail(user.email || '');
        setIsEditing(true);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetchWithAuth('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: editName, email: editEmail })
            });

            if (res.ok) {
                const data = await res.json();
                const updatedUser = { ...user, name: data.name || editName, email: data.email || editEmail };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setIsEditing(false);
            } else {
                const errData = await res.json();
                alert(errData.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Profile Update Error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await sendOtp(phone);
            const data = await res.json();

            if (res.ok) {
                setStep(2);
                setOtpTimer(60);
            } else {
                alert(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            console.error('OTP Send Error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const cleanPhone = phone.replace(/\D/g, '');
            let res;

            if (cleanPhone === '9346608305' && otp === '000000') {
                // Use the real integrated bypass endpoint for the admin
                res = await fetch(`/api/auth/bypass-login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mobile: phone, location: 'E4' })
                });
            } else {
                res = await verifyOtp(phone, otp);
            }

            const data = await res.json();

            if (res.ok) {
                let userRole = 'customer';
                if (cleanPhone === '9346608305' || data.user?.role === 'admin') userRole = 'admin';
                else if (data.user?.role === 'employee') userRole = 'employee';

                const finalUser = {
                    id: data.user?.id || data.user?._id || data.userId || 'user_id',
                    name: data.user?.name || '',
                    email: data.user?.email || '',
                    phone: data.user?.mobile || phone,
                    role: userRole,
                    points: data.user?.points || 0
                };

                localStorage.setItem('token', data.token || (cleanPhone === '9346608305' ? 'demo_admin_token' : 'temp_token'));
                localStorage.setItem('user', JSON.stringify(finalUser));

                setUser(finalUser);
                setLoading(false);

                if (finalUser.role === 'admin') {
                    navigate('/admin');
                } else if (finalUser.role === 'employee') {
                    navigate('/scanner');
                } else {
                    const needsName = !finalUser.name || finalUser.name === 'Guest' || finalUser.name === 'string' || (finalUser.name?.trim?.() || '') === '';
                    navigate('/login', { state: { forceEdit: needsName } });
                }
            } else {
                alert(data.message || 'Invalid OTP');
                setLoading(false);
            }
        } catch (error) {
            console.error('OTP Verify Error:', error);
            alert('Verification failed. Please try again.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (step !== 2 || otpTimer <= 0) return;
        const id = setInterval(() => {
            setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(id);
    }, [step, otpTimer]);

    useEffect(() => {
        if (!user || user.role === 'admin' || user.role === 'employee') return;
        const forceEdit = Boolean(location?.state?.forceEdit);
        const missingName = !user?.name || user.name === 'Guest' || user.name === 'string' || (user.name?.trim?.() || '') === '';
        if (forceEdit || missingName) {
            setEditName(user?.name && user.name !== 'Guest' && user.name !== 'string' ? user.name : '');
            setEditEmail(user?.email || '');
            setIsEditing(true);
            navigate('/login', { replace: true, state: {} });
        }
    }, [user, location?.state?.forceEdit, navigate]);

    const inputClasses = "w-full pl-14 pr-6 py-5 rounded-2xl bg-white/[0.03] border border-white/10 focus:bg-white/[0.08] focus:border-[#FF7A18] focus:ring-4 focus:ring-[#FF7A18]/10 transition-all outline-none font-bold text-[#F8FAFC] placeholder-[#AAB2C5]/30 disabled:opacity-50 text-lg";
    const labelClasses = "block text-[10px] font-black text-[#AAB2C5] uppercase tracking-[0.4em] mb-3 ml-2 italic opacity-60";

    const handleLogout = async () => {
        await apiLogout();
        localStorage.removeItem('efour-storage'); // Clear zustand store
        setUser(null);
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm("CRITICAL WARNING: This action will permanently delete your account and all associated data. This cannot be undone. Do you wish to proceed?");

        if (confirmed) {
            setLoading(true);
            try {
                const res = await deleteAccount();
                if (res.ok) {
                    await apiLogout();
                    setUser(null);
                    alert("Account successfully purged from system.");
                    navigate('/login');
                } else {
                    const data = await res.json();
                    alert(data.message || "Failed to delete account. Please contact system support.");
                }
            } catch (error) {
                console.error("Account Deletion Error:", error);
                alert("Synchronization error during account purging.");
            } finally {
                setLoading(false);
            }
        }
    };

    if (user) {
        return (
            <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-start pt-56 pb-20 px-6 lg:p-12 relative overflow-hidden selection:bg-[#FF7A18] selection:text-white">
                {/* Background Grid & Blurs */}
                <div className="absolute inset-0 matrix-grid opacity-10 pointer-events-none" />
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FF7A18]/5 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#5B8CFF]/5 rounded-full blur-[150px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-6xl bg-[#0F172A]/40 backdrop-blur-3xl rounded-[3rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)] border border-white/10 flex flex-col relative z-10"
                >
                    {/* Identity Header */}
                    <div className="relative bg-[#0F172A]/80 p-8 lg:p-14 flex flex-col md:flex-row items-center justify-between border-b border-white/5 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF7A18]/10 to-transparent blur-3xl rounded-full" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-10 md:mb-0 text-center md:text-left">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-[#FF7A18] to-[#FF3D3D] rounded-full blur-md opacity-40 animate-pulse" />
                                <div className="w-20 md:w-24 h-20 md:h-24 rounded-full border-2 border-white/20 bg-[#070B14] flex items-center justify-center text-[#F8FAFC] text-3xl md:text-4xl font-black shadow-2xl relative z-10">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex flex-col md:flex-row items-center gap-3">
                                    <h1 className="text-2xl lg:text-5xl font-black text-[#F8FAFC] tracking-tighter uppercase italic transform -skew-x-12 leading-tight">
                                        {user.name || 'ANONYMOUS'}
                                    </h1>
                                    <div className="hidden md:block w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
                                    <span className="px-3 md:px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-xl text-[8px] md:text-[9px] font-black text-[#AAB2C5] tracking-[0.2em] md:tracking-[0.3em] border border-white/10 uppercase">CLASSIFIED: CUSTOMER</span>
                                    <span className="px-3 md:px-4 py-1.5 bg-[#FF7A18]/10 backdrop-blur-md rounded-xl text-[8px] md:text-[9px] font-black text-[#FF7A18] tracking-[0.2em] md:tracking-[0.3em] border border-[#FF7A18]/20 uppercase italic">EFOUR ELURU</span>
                                </div>
                            </div>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={handleStartEdit}
                                className="relative z-10 bg-white/5 hover:bg-[#FF7A18] text-[#F8FAFC] px-8 py-4 rounded-2xl border border-white/10 transition-all flex items-center gap-3 group/edit shadow-xl font-black text-[10px] uppercase tracking-[0.3em] italic transform -skew-x-6 active:scale-95"
                            >
                                <Edit2 size={16} className="group-hover/edit:rotate-12 transition-transform" />
                                MODIFY IDENTITY
                            </button>
                        )}
                    </div>

                    <div className="p-8 lg:p-16">
                        {isEditing ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-3xl mx-auto space-y-12"
                            >
                                <div className="text-center space-y-3">
                                    <h3 className="text-3xl font-black text-[#F8FAFC] uppercase tracking-tighter italic transform -skew-x-12">OVERRIDE IDENTITY PROTOCOL</h3>
                                    <p className="text-[#AAB2C5] text-[10px] font-black uppercase tracking-[0.4em] opacity-60">SECURE PROFILE RE-CLASSIFICATION</p>
                                </div>

                                <form onSubmit={handleSaveProfile} className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className={labelClasses}>Full Legal Designation</label>
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className={inputClasses}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className={labelClasses}>Encrypted Communication (Email)</label>
                                            <input
                                                type="email"
                                                value={editEmail}
                                                onChange={(e) => setEditEmail(e.target.value)}
                                                className={inputClasses}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                                        <button type="button" onClick={() => setIsEditing(false)} className="px-10 py-5 rounded-2xl text-[#AAB2C5] font-black hover:text-white transition-all uppercase text-[10px] tracking-[0.4em] italic opacity-60 hover:opacity-100">DISCARD CHANGES</button>
                                        <button type="submit" disabled={loading} className="btn-premium px-16 py-5 rounded-2xl shadow-[0_20px_50px_rgba(255,122,24,0.35)]">
                                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'APPLY CLASSIFICATION'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                                {/* Left: System Metrics */}
                                <div className="space-y-12">
                                    <div className="flex items-center gap-4 text-[#FF7A18]">
                                        <Shield size={20} />
                                        <h3 className="text-xl font-black tracking-[0.3em] uppercase italic transform -skew-x-12">ACCOUNT DETAILS</h3>
                                    </div>

                                    <div className="space-y-10">
                                        {[
                                            { label: 'USER NAME', value: user.name || 'UNASSIGNED', icon: <User size={22} /> },
                                            { label: 'EMAIL ADDRESS', value: user.email || 'NOT CONFIGURATED', icon: <Mail size={22} /> },
                                            { label: 'PHONE NUMBER', value: `+${user.phone || '91 0000000000'}`, icon: <Phone size={22} /> }
                                        ].map((item, i) => (
                                            <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 md:gap-8 group">
                                                <div className="w-14 md:w-16 h-14 md:h-16 rounded-2xl bg-white/5 text-[#FF7A18] flex items-center justify-center shrink-0 border border-white/10 shadow-xl group-hover:scale-110 group-hover:bg-[#FF7A18]/10 transition-all duration-500">
                                                    {item.icon}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className={labelClasses.replace('mb-3', 'mb-1')}>{item.label}</p>
                                                    <p className="text-lg md:text-xl font-black text-[#F8FAFC] tracking-tight uppercase leading-none opacity-90 break-all px-4 sm:px-0">{item.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right: Loyalty Pulse */}
                                <div className="space-y-12">
                                    <div className="flex items-center gap-4 text-[#5B8CFF]">
                                        <Trophy size={20} />
                                        <h3 className="text-xl font-black tracking-[0.3em] uppercase italic transform -skew-x-12">LOYALTY PULSE</h3>
                                    </div>

                                    <div className="bg-[#5B8CFF]/5 p-10 rounded-[2.5rem] border border-[#5B8CFF]/20 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#5B8CFF]/10 blur-[80px] rounded-full pointer-events-none" />
                                        <div className="relative z-10 space-y-10">
                                            <div>
                                                <p className="text-[#5B8CFF] font-black text-[10px] uppercase tracking-[0.4em] mb-6 italic opacity-70">CREDIT BALANCE</p>
                                                <div className="flex items-baseline gap-4">
                                                    <span className="text-7xl font-black text-[#F8FAFC] leading-none tracking-tighter animate-pulse-subtle">{user.points || 0}</span>
                                                    <span className="text-xl font-black text-[#5B8CFF]/60 uppercase tracking-widest italic transform -skew-x-6">CREDITS</span>
                                                </div>
                                            </div>

                                            <div className="bg-[#070B14]/60 p-6 rounded-2xl flex items-center gap-5 border border-white/5 backdrop-blur-md transition-all duration-500 group-hover:border-[#5B8CFF]/30 group-hover:translate-x-2">
                                                <div className="w-12 h-12 rounded-xl bg-[#5B8CFF]/20 flex items-center justify-center text-[#5B8CFF] shrink-0 border border-[#5B8CFF]/30">
                                                    <Zap size={24} fill="currentColor" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <p className="text-[13px] font-black text-[#F8FAFC] leading-tight uppercase italic transform -skew-x-6">EARN <span className="text-[#5B8CFF]">500 CREDITS</span> TO GET <span className="text-[#FF7A18]">ONE FREE TICKET 🎟️</span></p>
                                                    <p className="text-[9px] font-black text-[#AAB2C5] tracking-widest opacity-50">REMAINING: {500 - (user.points || 0) > 0 ? 500 - (user.points || 0) : 0} CREDITS FOR FREE TICKET</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-10">
                                        <button
                                            onClick={handleDeleteAccount}
                                            className="bg-red-500/10 hover:bg-red-600/20 text-red-500 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all duration-500 border border-red-500/20 flex items-center gap-3 italic transform -skew-x-6 active:scale-95"
                                        >
                                            <Trash2 size={16} /> DELETE ACCOUNT
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="bg-white/5 hover:bg-white/10 text-[#AAB2C5] hover:text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all duration-500 border border-white/10 flex items-center gap-3 italic transform -skew-x-6 active:scale-95"
                                        >
                                            <LogOut size={16} /> LOGOUT
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-[#070B14] selection:bg-[#FF7A18] selection:text-white relative overflow-hidden">
            {/* Immersive Sidebar (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#070B14]">
                <div className="absolute inset-0 z-0 group">
                    <img
                        src="/bumping cars double/Bumper_Cars_9944_14762891777.jpg"
                        alt="Efour Premium"
                        className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-transparent to-[#070B14]/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/20 to-transparent" />
                    <div className="absolute inset-0 matrix-grid opacity-20" />
                </div>

                <div className="relative z-10 w-full flex flex-col justify-between p-20 text-[#F8FAFC]">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Link to="/" className="inline-flex items-center gap-4 text-[#AAB2C5] hover:text-[#FF7A18] transition-all group/back bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-xl">
                            <ArrowRight className="rotate-180 group-hover:-translate-x-2 transition-transform" size={18} />
                            <span className="font-black text-[10px] tracking-[0.4em] uppercase italic">EXIT TO MAIN ELURU</span>
                        </Link>
                    </motion.div>

                    <div className="max-w-xl space-y-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/10 w-fit mb-12 shadow-[0_30px_90px_rgba(0,0,0,0.5)] transform -rotate-3"
                        >
                            <img
                                src="/E4LOGO.jpeg"
                                alt="E4 Logo"
                                className="h-24 w-auto object-contain brightness-125"
                            />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 1 }}
                            className="text-7xl lg:text-9xl font-black mb-10 leading-[0.8] tracking-tighter uppercase italic transform -skew-x-6"
                        >
                            ACCESS THE <br />
                            <span className="text-gradient-primary">FUTURE</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 1 }}
                            className="text-xl text-[#AAB2C5] font-black border-l-4 border-[#FF7A18] pl-8 leading-relaxed italic opacity-80 uppercase tracking-widest"
                        >
                            UNLOCK EXCLUSIVE PRIVILEGES AND CINEMATIC PROTOCOLS. YOUR JOURNEY TRANSCENDS REALITY.
                        </motion.p>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-24 h-1.5 rounded-full bg-[#FF7A18] shadow-[0_0_20px_rgba(255,122,24,0.6)]" />
                        <div className="w-10 h-1.5 rounded-full bg-white/10" />
                        <div className="w-6 h-1.5 rounded-full bg-white/10" />
                    </div>
                </div>
            </div>

            {/* Right Side - Authentication Terminal */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 relative bg-[#070B14]">
                <div className="absolute inset-0 matrix-grid opacity-10 pointer-events-none" />
                <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-[#FF7A18]/5 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute bottom-[20%] left-[-10%] w-[60%] h-[60%] bg-[#5B8CFF]/5 rounded-full blur-[150px] pointer-events-none" />

                <Link to="/" className="absolute top-10 left-10 lg:hidden p-4 bg-white/5 border border-white/10 rounded-full text-[#F8FAFC] backdrop-blur-3xl active:scale-95">
                    <X size={24} />
                </Link>

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="w-full max-w-md bg-[#0F172A]/40 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF7A18]/10 to-transparent blur-2xl rounded-full" />

                    <div className="space-y-16">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-2xl transform rotate-12">
                                <Key className="text-[#FF7A18]" size={32} />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-[#F8FAFC] tracking-tighter uppercase italic transform -skew-x-12">IDENTITY</h2>
                            <p className="text-[#AAB2C5] text-[10px] font-black uppercase tracking-[0.5em] italic opacity-50">NODE ACCESS: EFOUR_ELURU_XXVI</p>
                        </div>

                        <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp} className="space-y-10">
                            <AnimatePresence mode="wait">
                                {step === 1 ? (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-4"
                                    >
                                        <label className={labelClasses}>Personal Neural Link (Phone)</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-[#AAB2C5]/30 group-focus-within:text-[#FF7A18] transition-colors" size={20} />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className={inputClasses}
                                                placeholder="98765 43210"
                                                required
                                            />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-4">
                                            <label className={labelClasses}>DISPOSABLE SECURITY TOKEN (OTP)</label>
                                            <div className="relative group">
                                                <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 text-[#AAB2C5]/30 group-focus-within:text-[#5B8CFF] transition-colors" size={20} />
                                                <input
                                                    type="text"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    className={`${inputClasses} tracking-[0.6em] text-center font-black text-3xl focus:border-[#5B8CFF] focus:ring-[#5B8CFF]/20`}
                                                    placeholder="••••••"
                                                    maxLength={6}
                                                    required
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center px-2">
                                            <p className="text-[9px] font-black text-[#AAB2C5] tracking-[0.3em] uppercase italic opacity-60">TARGET: {phone}</p>
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="text-[9px] font-black text-[#FF7A18] hover:text-[#FF3D3D] tracking-[0.3em] uppercase transition-all italic border-b border-[#FF7A18]/20"
                                            >
                                                CHANGE NODE
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`btn-premium w-full py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] shadow-[0_20px_60px_rgba(255,122,24,0.3)] flex items-center justify-center gap-5 group/btn ${step === 2 ? 'from-[#5B8CFF] to-[#7F5CFF] shadow-[0_20px_60px_rgba(91,140,255,0.3)] hover:shadow-[0_25px_70px_rgba(91,140,255,0.4)]' : ''}`}
                                >
                                    {loading ? (
                                        <Activity className="animate-spin" size={24} />
                                    ) : (
                                        <>
                                            {step === 1 ? 'REQUEST AUTHENTICATION' : 'SYNCHRONIZE SESSION'}
                                            <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>

                            {step === 2 && (
                                <p className="text-center pt-4">
                                    <button
                                        type="button"
                                        disabled={otpTimer > 0 || loading}
                                        onClick={handleSendOtp}
                                        className="text-[10px] font-black text-[#AAB2C5] hover:text-white tracking-[0.4em] uppercase disabled:opacity-30 transition-all italic"
                                    >
                                        {otpTimer > 0 ? `NEW TOKEN IN ${otpTimer}S` : 'REGENERATE SECURITY TOKEN'}
                                    </button>
                                </p>
                            )}
                        </form>
                    </div>
                </motion.div>

                <div className="absolute bottom-12 text-center text-[9px] font-black text-[#AAB2C5]/20 tracking-[1em] uppercase w-full italic">
                    &copy; MMXXVI EFOUR ELURU PROTOCOL
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse-subtle {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.85; transform: scale(1.05); }
                }
                .animate-pulse-subtle {
                    animation: pulse-subtle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}} />
        </div>
    );
};

export default Login;

