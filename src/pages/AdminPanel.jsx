import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Clock, FileText, LogOut, LayoutDashboard, List, Book, UserCog, BarChart3, Settings, Library, AlertTriangle, IndianRupee, Sparkles } from 'lucide-react';
import { getDashboardStats, getRecentActivity, getTopBorrowed } from '../services/library';
import { useUniLib } from '../context/UniLibContext';
import { useNavigate } from 'react-router-dom';
import BorrowRequests from './admin/BorrowRequests';
import BookManagement from './admin/BookManagement';
import UserManagement from './admin/UserManagement';
import Reports from './admin/Reports';
import { Toaster } from 'react-hot-toast';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        totalBooks: 0,
        activeLoans: 0,
        activeMembers: 0,
        overdue: 0,
        pending: 0,
        totalUsers: 0,
        revenueToday: 0
    });
    const [activity, setActivity] = useState([]);
    const [topBooks, setTopBooks] = useState([]);
    const { logout } = useUniLib();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dashStats = await getDashboardStats();
                setStats(dashStats);
                const recentActivity = await getRecentActivity();
                setActivity(recentActivity);
                const top = await getTopBorrowed();
                setTopBooks(top);
            } catch (e) {
                console.error("Dashboard fetch error:", e);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [activeTab]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { tab: 'overview', icon: LayoutDashboard, label: 'Dashboard', badge: null },
        { tab: 'requests', icon: List, label: 'Borrow Requests', badge: stats.pending },
        { tab: 'books', icon: Book, label: 'Book Management', badge: null },
        { tab: 'users', icon: UserCog, label: 'User Management', badge: null },
        { tab: 'reports', icon: BarChart3, label: 'Analytics & Reports', badge: null },
        { tab: 'settings', icon: Settings, label: 'System Settings', badge: null }
    ];

    const renderOverview = () => (
        <div className="space-y-8">
            {/* Epic Welcome Banner */}
            <div
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 via-cyan-500/20 to-purple-600/20 border border-primary/30 p-8"
            >
                <div className="relative z-10">
                    <h2 className="text-4xl font-bold text-white">
                        Welcome to <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">UniLib</span> Command Center
                    </h2>
                    <p className="text-gray-300 mt-2 text-lg">
                        Enterprise-grade library management system • v2.0
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            </div>

            {/* 6 Premium Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {[
                    { label: "Total Books", value: stats.totalBooks, icon: Library, color: "from-amber-500/30 to-yellow-500/30" },
                    { label: "Active Loans", value: stats.activeLoans, icon: Clock, color: "from-amber-600/30 to-orange-500/30" },
                    { label: "Pending Requests", value: stats.pending, icon: FileText, color: "from-red-500/30 to-orange-500/30", pulse: stats.pending > 0 },
                    { label: "Overdue", value: stats.overdue, icon: AlertTriangle, color: "from-red-600/30 to-red-500/30" },
                    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "from-gray-600/30 to-gray-500/30" },
                    { label: "Revenue Today", value: `₹${stats.revenueToday || 0}`, icon: IndianRupee, color: "from-green-600/30 to-emerald-500/30" }
                ].map((stat, i) => (
                    <div
                        key={i}
                        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${stat.color} p-1`}
                    >
                        <div className="bg-black/90 backdrop-blur-xl rounded-3xl p-6 h-full relative">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">{stat.label}</p>
                                    <p className="text-4xl font-bold text-white mt-2">{stat.value}</p>
                                </div>
                                <div className="p-4 bg-white/10 rounded-2xl">
                                    <stat.icon size={32} className="text-white" />
                                </div>
                            </div>
                            {stat.pulse && <div className="absolute inset-0 bg-red-500/10 animate-ping rounded-3xl pointer-events-none" />}
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Insights Card */}
            <div
                className="glass-card rounded-3xl p-8 border border-primary/20 shadow-xl shadow-primary/10"
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl">
                        <Sparkles size={32} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">System Insights</h3>
                        <p className="text-sm text-gray-400">Live analytics & trends</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/10 to-cyan-500/10 border border-primary/20">
                        <p className="text-lg font-semibold text-white">📚 Fantasy genre borrowing predicted to increase 42% next month</p>
                        <p className="text-sm text-gray-400 mt-1">Based on current trends in "The Hobbit", "Dune", and "1984"</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-lg font-semibold text-white">⏰ Peak borrowing hours: 6–9 PM</p>
                        <p className="text-sm text-gray-400 mt-1">Recommend extending library staff during these hours</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-lg font-semibold text-white">💡 {stats.overdue > 0 ? `${stats.overdue} overdue books generating ₹${stats.revenueToday} in fines` : 'No overdue books - excellent!'}</p>
                        <p className="text-sm text-gray-400 mt-1">{stats.overdue > 0 ? 'Send automated reminders to improve returns' : 'Keep up the great work!'}</p>
                    </div>
                </div>
            </div>

            {/* Live Activity Chart + Top 5 Borrowed Books */}
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass-card rounded-3xl p-8 border border-white/10">
                    <h3 className="text-2xl font-bold text-white mb-6">Borrowing Trend (Last 7 Days)</h3>
                    <div className="h-64 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl flex items-end justify-around p-6 gap-4">
                        {[7, 12, 18, 15, 22, 28, 25].map((h, i) => (
                            <div
                                key={i}
                                style={{ height: `${h * 3}px` }}
                                className="w-12 bg-primary rounded-t-xl shadow-lg"
                            />
                        ))}
                    </div>
                    <div className="flex justify-around mt-4 text-xs text-gray-500">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <span key={day}>{day}</span>
                        ))}
                    </div>
                </div>

                <div className="glass-card rounded-3xl p-8 border border-white/10">
                    <h3 className="text-2xl font-bold text-white mb-6">Most Popular This Month</h3>
                    <div className="space-y-4">
                        {topBooks.map((book, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                            >
                                <span className="text-3xl font-bold text-primary">
                                    #{i + 1}
                                </span>
                                <img src={book.cover} className="w-12 h-16 object-cover rounded-lg shadow-lg group-hover:scale-110 transition-transform" alt={book.title} />
                                <div className="flex-1">
                                    <p className="font-bold text-white group-hover:text-primary transition-colors">{book.title}</p>
                                    <p className="text-sm text-gray-400">{book.author} • {book.borrowCount || 0} borrows</p>
                                </div>
                            </div>
                        ))}
                        {topBooks.length === 0 && (
                            <p className="text-center text-gray-500 py-8">No borrowing data yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card rounded-3xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
                <div className="space-y-4">
                    {activity.map((item, i) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all"
                        >
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${item.type === 'borrow' ? 'bg-primary/20 text-primary' :
                                item.type === 'return' ? 'bg-green-500/20 text-green-400' :
                                    item.type === 'request' ? 'bg-pink-500/20 text-pink-400' : 'bg-gray-500/20 text-gray-400'
                                }`}>
                                {item.type === 'borrow' ? <BookOpen size={18} /> :
                                    item.type === 'return' ? <Clock size={18} /> :
                                        item.type === 'request' ? <FileText size={18} /> : <Users size={18} />}
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium">{item.action}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>{item.user}</span>
                                    <span>•</span>
                                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {activity.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No recent activity</p>
                    )}
                </div>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">System Settings</h1>
                <p className="text-gray-400 mt-1">Configure library parameters</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="glass-card rounded-3xl p-8 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-6">Library Configuration</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Library Name</label>
                            <input type="text" defaultValue="UniLib" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Default Loan Duration (days)</label>
                            <input type="number" defaultValue="14" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Fine Amount per Day (₹)</label>
                            <input type="number" defaultValue="5" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary" />
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-3xl p-8 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-6">Appearance</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500/20 rounded-xl">
                                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-white">Ultra Dark Mode</p>
                                    <p className="text-sm text-gray-400">Enhanced dark theme with 300% more void</p>
                                </div>
                            </div>
                            <div className="w-16 h-8 bg-primary rounded-full relative cursor-pointer hover:shadow-lg hover:shadow-primary/30 transition-all">
                                <div className="absolute right-1 top-1 w-6 h-6 bg-black rounded-full shadow-lg transition-all"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                            <div>
                                <p className="font-medium text-white">Email Notifications</p>
                                <p className="text-sm text-gray-400">Send reminders to users</p>
                            </div>
                            <div className="w-12 h-6 bg-gray-700 rounded-full relative">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button className="bg-gradient-to-r from-primary to-amber-400 text-black px-8 py-4 rounded-2xl font-bold shadow-2xl shadow-primary/50 hover:shadow-primary/70 transition-all hover:scale-105">
                💾 Save All Settings
            </button>
        </div>
    );

    return (
        <div
            className="flex h-screen bg-black text-white overflow-hidden relative"
        >
            <Toaster position="top-right" toastOptions={{
                style: {
                    background: '#18181b',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)'
                }
            }} />

            {/* Cyberpunk Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />

            {/* PREMIUM GLASS SIDEBAR */}
            <div className="fixed inset-y-0 left-0 w-72 bg-black/40 backdrop-blur-2xl border-r border-white/10 shadow-2xl z-50 hidden lg:block">
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-primary">
                        UniLib Admin
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Enterprise Edition</p>
                </div>

                <nav className="px-6 space-y-2">
                    {navItems.map(item => (
                        <button
                            key={item.tab}
                            onClick={() => setActiveTab(item.tab)}
                            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300
                  ${activeTab === item.tab
                                    ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-500/20 font-bold'
                                    : 'hover:bg-white/10 text-gray-300 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon size={22} />
                                <span className="font-medium">{item.label}</span>
                            </div>
                            {item.badge > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 space-y-3">
                    <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/5 text-gray-300 hover:bg-white/10 transition-all border border-white/10">
                        <BookOpen size={22} />
                        <span className="font-medium">Go to Website</span>
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20">
                        <LogOut size={22} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 lg:ml-72 p-8 overflow-y-auto min-h-screen">
                <div className="lg:hidden flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-primary">UniLib Admin</h1>
                    <button onClick={handleLogout} className="text-red-400">
                        <LogOut size={24} />
                    </button>
                </div>

                <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-8">
                    {navItems.map(item => (
                        <button
                            key={item.tab}
                            onClick={() => setActiveTab(item.tab)}
                            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${activeTab === item.tab
                                ? 'bg-primary text-black font-bold shadow-lg'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div
                    key={activeTab}
                >
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'requests' && <BorrowRequests />}
                    {activeTab === 'books' && <BookManagement />}
                    {activeTab === 'users' && <UserManagement />}
                    {activeTab === 'reports' && <Reports />}
                    {activeTab === 'settings' && renderSettings()}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
