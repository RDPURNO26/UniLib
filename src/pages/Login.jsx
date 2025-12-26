import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, BookOpen, ArrowRight, User, Lock, Sparkles } from 'lucide-react';
import { useUniLib } from '../context/UniLibContext';

const Login = () => {
    const { login } = useUniLib();
    const navigate = useNavigate();
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate network delay for premium feel
        setTimeout(() => {
            if (login({ email, password })) {
                navigate('/');
            } else {
                alert('Invalid credentials');
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen w-full flex bg-[#030712] relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[150px]" />

            {/* Left Side - Image/Brand */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
            >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/login-bg.png"
                        alt="Library"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
                </div>

                {/* Brand Content */}
                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-3 text-amber-500 mb-6"
                    >
                        <BookOpen className="w-8 h-8" />
                        <span className="text-2xl font-bold tracking-wider font-outfit text-white">UniLib</span>
                    </motion.div>
                </div>

                <div className="relative z-10 max-w-xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-5xl font-bold text-white mb-6 leading-tight"
                    >
                        Access the Future of <br />
                        <span className="text-gradient-gold">Digital Learning</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-gray-300 text-lg leading-relaxed"
                    >
                        Experience a seamless, AI-powered library application designed for the modern scholar.
                        Manage resources, track borrowing, and explore knowledge with ease.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="relative z-10 flex gap-4 text-sm text-gray-400"
                >
                    <span>© 2024 UniLib Systems</span>
                    <span>•</span>
                    <span>Privacy Policy</span>
                </motion.div>
            </motion.div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-10 lg:hidden">
                        <div className="flex items-center justify-center gap-3 text-amber-500 mb-4">
                            <BookOpen className="w-8 h-8" />
                            <span className="text-2xl font-bold tracking-wider text-white">UniLib</span>
                        </div>
                    </div>

                    <div className="glass-card p-1 rounded-2xl mb-8 flex bg-gray-900/50">
                        <button
                            onClick={() => setIsAdminMode(false)}
                            className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative ${!isAdminMode ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            {!isAdminMode && (
                                <motion.div
                                    layoutId="tab-bg"
                                    className="absolute inset-0 bg-gray-800 rounded-xl shadow-lg border border-gray-700"
                                />
                            )}
                            <span className="relative z-10">Student</span>
                        </button>
                        <button
                            onClick={() => setIsAdminMode(true)}
                            className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative ${isAdminMode ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            {isAdminMode && (
                                <motion.div
                                    layoutId="tab-bg"
                                    className="absolute inset-0 bg-amber-600 rounded-xl shadow-lg shadow-amber-900/20"
                                />
                            )}
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Admin <Shield className="w-3 h-3" />
                            </span>
                        </button>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {isAdminMode ? 'Admin Portal' : 'Welcome Back'}
                        </h2>
                        <p className="text-gray-400">
                            {isAdminMode
                                ? 'Secure access for library administrators'
                                : 'Enter your details to access your account'}
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={isAdminMode ? "admin@unilib.edu" : "student@unilib.edu"}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                                             text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                                             focus:ring-amber-500/50 focus:border-amber-500/50 transition-all font-sans"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                                             text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                                             focus:ring-amber-500/50 focus:border-amber-500/50 transition-all font-sans"
                                    required
                                />
                            </div>
                        </div>

                        {isAdminMode && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3"
                            >
                                <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-200/80 leading-relaxed">
                                    Secure admin environment. All actions are logged and monitored for security purposes.
                                </p>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 bg-gradient-to-r ${isAdminMode
                                ? 'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-900/20'
                                : 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-900/20'
                                } text-white font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg
                            disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group`}
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Quick Login Demo - Preserved functionality but restyled */}
                    <div className="mt-8 pt-6 border-t border-gray-800">
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-4 text-center">Quick Demo Access</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => {
                                    setEmail('alex@student.edu');
                                    setPassword('alex');
                                    setIsAdminMode(false);
                                }}
                                className="py-2.5 bg-gray-800/40 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg 
                                         transition-all text-xs font-medium border border-gray-700/50 hover:border-gray-600"
                            >
                                Demo Student
                            </button>
                            <button
                                onClick={() => {
                                    setEmail('admin@unilib.edu');
                                    setPassword('admin');
                                    setIsAdminMode(true);
                                }}
                                className="py-2.5 bg-gray-800/40 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg 
                                         transition-all text-xs font-medium border border-gray-700/50 hover:border-gray-600"
                            >
                                Demo Admin
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
