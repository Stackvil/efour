import React, { useEffect, useState } from 'react'; // Redundant comment to trigger rebuild
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { User, Edit2, Save, X, Phone, ArrowRight, Mail, Check, ChevronRight, Zap, Trophy, LogOut } from 'lucide-react';

const Login = () => {
    const { user, setUser } = useStore();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Phone Entry, 2: OTP Entry
    const [loading, setLoading] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0); // seconds remaining for resend
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
            const token = localStorage.getItem('token');
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile: phone, location: 'E4' })
            });

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
            // Admin Bypass logic for testing if needed, or remove completely
            const cleanPhone = phone.replace(/\D/g, '');
            if (cleanPhone === '9999999999' && otp === '123456') {
                const adminUser = { id: 'admin', name: 'Admin', phone: phone, role: 'admin' };
                localStorage.setItem('token', 'demo_admin_token');
                localStorage.setItem('user', JSON.stringify(adminUser));
                setUser(adminUser);
                navigate('/admin');
                return;
            }

            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mobile: phone,
                    otp: otp,
                    location: "E4"
                })
            });

            const data = await res.json();

            if (res.ok) {
                const finalUser = {
                    id: data.user?.id || data.user?._id || data.userId || 'user_id',
                    name: data.user?.name || '',
                    email: data.user?.email || '',
                    phone: data.user?.mobile || phone,
                    role: data.user?.role || 'customer'
                };

                localStorage.setItem('token', data.token || 'temp_token');
                localStorage.setItem('user', JSON.stringify(finalUser));

                setUser(finalUser);
                setLoading(false);

                if (finalUser.role === 'admin') {
                    navigate('/admin');
                } else {
                    // Only force edit if name is missing or Guest
                    const needsName = !finalUser.name || finalUser.name === 'Guest' || finalUser.name === 'string' || finalUser.name.trim() === '';
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

    // Countdown for resend OTP
    useEffect(() => {
        if (step !== 2 || otpTimer <= 0) return;
        const id = setInterval(() => {
            setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(id);
    }, [step, otpTimer]);

    // After login, redirect user to fill profile (name only - email is optional)
    useEffect(() => {
        if (!user) return;
        const forceEdit = Boolean(location?.state?.forceEdit);
        // Only force edit if name is missing or Guest - email is optional
        const missingName = !user?.name || user.name === 'Guest' || user.name === 'string' || user.name.trim() === '';
        if (forceEdit || missingName) {
            setEditName(user?.name && user.name !== 'Guest' && user.name !== 'string' ? user.name : '');
            setEditEmail(user?.email || '');
            setIsEditing(true);
            // Clear route state so it doesn't keep forcing edit
            navigate('/login', { replace: true, state: {} });
        }
    }, [user, location?.state?.forceEdit, navigate]);

    // Common styles for input fields
    const inputClasses = "w-full pl-12 pr-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-sunset-orange focus:ring-4 focus:ring-sunset-orange/10 transition-all outline-none font-bold text-charcoal-grey disabled:bg-gray-100 disabled:text-gray-400";
    const labelClasses = "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1";

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    if (user) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
                {/* Ambient background blur for premium feel */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#007b6e]/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#6e68e4]/5 rounded-full blur-[120px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-5xl bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col relative z-10 mx-auto"
                >
                    {/* Header Section: Exact Landscape Replica */}
                    <div className="relative bg-[#007b6e] p-8 flex items-center justify-between shrink-0 overflow-hidden">
                        {/* Background Patterns */}
                        <div className="absolute top-[-10%] left-[-5%] w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                        <div className="absolute bottom-[-20%] right-[15%] w-64 h-64 bg-white/5 rounded-full blur-3xl opacity-50" />

                        <div className="relative z-10 flex items-center gap-5">
                            {/* Circular Avatar */}
                            <div className="w-20 h-20 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center text-white text-3xl font-bold shadow-lg backdrop-blur-sm">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>

                            {/* Name and Badges */}
                            <div className="flex flex-col gap-2">
                                <h1 className="text-3xl font-bold text-white tracking-tight leading-none uppercase">
                                    {user.name || 'User'}
                                </h1>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white tracking-widest border border-white/20 uppercase">CUSTOMER</span>
                                    <span className="px-4 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white tracking-widest border border-white/20 uppercase">E4</span>
                                </div>
                            </div>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={handleStartEdit}
                                className="relative z-10 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl border border-white/20 transition-all flex items-center gap-2 group/edit shadow-sm"
                            >
                                <Edit2 size={16} />
                                <span className="text-sm font-bold">Edit Profile</span>
                            </button>
                        )}
                    </div>

                    {/* Content Section: Landscape Dashboard */}
                    <div className="p-10 lg:p-12 bg-white">
                        {isEditing ? (
                            /* MODIFY PROFILE FORM */
                            <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="text-center space-y-1">
                                    <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Modify Identity</h3>
                                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Secure Profile Management</p>
                                </div>

                                <form onSubmit={handleSaveProfile} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="w-full h-14 px-6 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#007b6e] focus:bg-white transition-all outline-none font-bold text-gray-800"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                value={editEmail}
                                                onChange={(e) => setEditEmail(e.target.value)}
                                                className="w-full h-14 px-6 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#007b6e] focus:bg-white transition-all outline-none font-bold text-gray-800"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center gap-6">
                                        <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 rounded-xl text-gray-400 font-bold hover:text-gray-900 transition-colors uppercase text-xs tracking-widest">Discard</button>
                                        <button type="submit" disabled={loading} className="bg-[#007b6e] hover:bg-[#006a5e] px-12 py-3.5 rounded-xl text-white font-bold shadow-xl transition-all hover:-translate-y-1 flex items-center gap-3 uppercase text-xs tracking-widest">
                                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Apply Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            /* DISPLAY MODE: LANDSCAPE DASHBOARD */
                            <div className="space-y-12">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    {/* Left: Personal Information */}
                                    <div className="space-y-8">
                                        <h3 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                                            Personal Information
                                        </h3>

                                        <div className="space-y-8">
                                            {[
                                                { label: 'FULL NAME', value: user.name || 'User', icon: <User size={18} /> },
                                                { label: 'EMAIL', value: user.email || '—', icon: <Mail size={18} /> },
                                                { label: 'MOBILE', value: `+${user.phone || '91 9346608305'}`, icon: <Phone size={18} /> }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-full bg-[#f0f9f8] text-[#007b6e] flex items-center justify-center shrink-0 shadow-sm border border-[#e2eff0]">
                                                        {item.icon}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-1.5 uppercase">{item.label}</p>
                                                        <p className="text-lg font-bold text-gray-800 tracking-tight transition-colors leading-none uppercase">{item.value}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            <button
                                                onClick={handleStartEdit}
                                                className="text-[#007b6e] font-bold text-[13px] hover:text-[#006a5e] transition-all mt-4 w-fit flex items-center gap-2 group/edit-link"
                                            >
                                                <Edit2 size={14} className="group-hover/edit-link:rotate-12 transition-transform" /> Edit name or email
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right: Rewards & Points */}
                                    <div className="space-y-8">
                                        <h3 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                                            <div className="text-yellow-500"><Trophy size={20} fill="currentColor" /></div> Rewards & Points
                                        </h3>

                                        <div className="space-y-6">
                                            {/* Purple Reward Card */}
                                            <div className="bg-[#f4f3ff] p-8 rounded-[2rem] border border-[#e8eaff] relative overflow-hidden group/reward-card">
                                                <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/50 rounded-full blur-3xl opacity-60" />
                                                <div className="relative z-10 space-y-8">
                                                    <div>
                                                        <p className="text-[#6e68e4] font-bold text-[11px] uppercase tracking-[0.2em] mb-4">CURRENT BALANCE</p>
                                                        <div className="flex items-baseline gap-3">
                                                            <span className="text-6xl font-black text-[#5e57d1] leading-none drop-shadow-sm">{user.points || 0}</span>
                                                            <span className="text-xl font-bold text-[#6e68e4]/50 tracking-tight">Points</span>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white p-5 rounded-2xl flex items-center gap-4 border border-[#eef0ff] shadow-sm transform transition-transform group-hover/reward-card:scale-[1.02] duration-500">
                                                        <div className="w-10 h-10 rounded-xl bg-[#6e68e4]/5 flex items-center justify-center text-[#6e68e4] shrink-0 border border-[#eef0ff]">
                                                            <Zap size={20} fill="currentColor" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[13px] font-bold text-gray-800 leading-tight">Earn <span className="text-[#6e68e4]">500 Points</span> to unlock a <br /><span className="text-[#007b6e]">Free Ride Ticket 🎟️</span></p>
                                                            <p className="text-[10px] font-bold text-gray-400">({500 - (user.points || 0) > 0 ? 500 - (user.points || 0) : 0} more points needed)</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Incentive Tip */}
                                            <div className="bg-[#fff9f3] p-5 rounded-2xl flex items-center gap-4 border border-[#ffecd9] shadow-sm">
                                                <div className="text-[#f97316] drop-shadow-sm"><Trophy size={20} fill="currentColor" /></div>
                                                <p className="text-[12px] font-bold text-[#9a3412] leading-snug">Earn <span className="text-orange-950 font-black">10 Points</span> for every transaction above ₹500.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Logout Button */}
                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={handleLogout}
                                        className="bg-[#fff1f2] hover:bg-red-500 hover:text-white text-[#e11d48] px-8 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all duration-300 shadow-sm border border-[#fecdd3] flex items-center gap-3 active:scale-95 group/logout"
                                    >
                                        <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Hero Image (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-charcoal-grey">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/bumping cars double/Bumper_Cars_9944_14762891777.jpg"
                        alt="Efour Fun"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-grey via-charcoal-grey/40 to-transparent" />
                    <div className="absolute inset-0 bg-riverside-teal/20 mix-blend-overlay" />
                </div>

                <div className="relative z-10 w-full flex flex-col justify-between p-16 text-white">
                    <div>
                        <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8">
                            <ArrowRight className="rotate-180" size={20} />
                            <span className="font-bold text-sm tracking-widest uppercase">Back to Home</span>
                        </Link>
                    </div>

                    <div className="max-w-md">
                        <motion.img
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            src="/E4LOGO.jpeg"
                            alt="E4 Logo"
                            className="w-20 h-20 rounded-2xl shadow-2xl mb-8 border-4 border-white/20 backdrop-blur-sm"
                        />
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl font-black mb-6 leading-tight"
                        >
                            Unlock Your <br />
                            <span className="text-sunset-orange">Ultimate Fun</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg text-gray-300 font-medium leading-relaxed"
                        >
                            Join thousands of happy families! Access exclusive rides, book tickets instantly, and manage your Efour experience.
                        </motion.p>
                    </div>

                    <div className="flex gap-2">
                        <div className="w-12 h-1.5 rounded-full bg-sunset-orange" />
                        <div className="w-2 h-1.5 rounded-full bg-white/30" />
                        <div className="w-2 h-1.5 rounded-full bg-white/30" />
                    </div>
                </div>
            </div>

            {/* Right Side - Form Container */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                {/* Mobile Back Button */}
                <Link to="/" className="absolute top-6 left-6 lg:hidden p-2 bg-gray-100 rounded-full text-charcoal-grey">
                    <X size={20} />
                </Link>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* LOGIN FORM */}
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-4xl font-heading font-black text-charcoal-grey mb-3">Sign in</h2>
                            <p className="text-gray-500 font-medium">Please enter your details to continue.</p>
                        </div>

                        <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp} className="space-y-6">
                            <div>
                                <label className={labelClasses}>Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sunset-orange transition-colors" size={20} />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className={inputClasses}
                                        placeholder="98765 43210"
                                        required
                                        disabled={step === 2}
                                    />
                                    {step === 1 && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="overflow-hidden"
                                >
                                    <label className={labelClasses}>Verification Code</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-riverside-teal/10 text-riverside-teal font-bold text-xs">
                                            #
                                        </div>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className={`${inputClasses} tracking-[0.5em] text-center font-black text-2xl focus:border-riverside-teal focus:ring-riverside-teal/10`}
                                            placeholder="•• •• ••"
                                            maxLength={6}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-3 px-1">
                                        <p className="text-xs font-bold text-gray-400">Sent to {phone}</p>
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="text-xs font-bold text-sunset-orange hover:underline"
                                        >
                                            Change Number
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl shadow-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 ${step === 1
                                        ? 'bg-gradient-to-r from-sunset-orange to-red-500 text-white'
                                        : 'bg-gradient-to-r from-riverside-teal to-emerald-600 text-white'
                                        }`}
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        step === 1 ? (
                                            <>Get OTP <ArrowRight size={20} /></>
                                        ) : (
                                            <>Verify & Login <Check size={20} /></>
                                        )
                                    )}
                                </button>
                            </div>

                            {step === 2 && (
                                <p className="text-center">
                                    <button
                                        type="button"
                                        disabled={otpTimer > 0 || loading}
                                        onClick={handleSendOtp}
                                        className="text-sm font-bold text-gray-400 hover:text-charcoal-grey disabled:opacity-50 transition-colors"
                                    >
                                        {otpTimer > 0 ? `Resend code in ${otpTimer}s` : 'Resend Verification Code'}
                                    </button>
                                </p>
                            )}
                        </form>
                    </div>
                </motion.div>

                {/* Footer Copyright */}
                <div className="absolute bottom-6 text-center text-xs text-gray-300 w-full">
                    &copy; 2026 Efour. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Login;
