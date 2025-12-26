import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Search, User, LogOut, BookOpen, UserCircle, Shield, ChevronDown, ChevronRight
} from 'lucide-react';
import { useUniLib } from '../context/UniLibContext';
import { simulateGoogleBooksAPI } from '../utils/api';

const Navbar = () => {
    const navigate = useNavigate();
    const { currentUser, logout } = useUniLib();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length > 2) {
            const results = await simulateGoogleBooksAPI(query, 5);
            setSuggestions(results.items || []);
        } else {
            setSuggestions([]);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setShowUserMenu(false);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800"
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <BookOpen className="w-8 h-8 text-amber-500" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                            UniLib
                        </span>
                    </motion.div>

                    {/* Search Bar */}
                    <div className="relative w-96">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search books, authors, genres..."
                                className="w-full px-6 py-3 pl-12 bg-gray-800/60 backdrop-blur-lg border border-amber-500/30 rounded-full 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                            <Search className="absolute left-4 top-3.5 w-5 h-5 text-amber-400" />
                        </div>

                        {/* Suggestions Dropdown */}
                        {suggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-full mt-2 w-full bg-gray-900/90 backdrop-blur-xl border border-amber-500/20 
                         rounded-xl shadow-2xl max-h-80 overflow-y-auto"
                            >
                                {suggestions.map((book, idx) => (
                                    <motion.div
                                        key={book.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="p-3 hover:bg-amber-500/10 cursor-pointer border-b border-gray-800 last:border-b-0"
                                        onClick={() => navigate(`/book/${book.id}`)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/40x60'}
                                                alt={book.volumeInfo.title}
                                                className="w-10 h-14 object-cover rounded"
                                            />
                                            <div>
                                                <p className="font-medium text-white">{book.volumeInfo.title}</p>
                                                <p className="text-sm text-gray-300">{book.volumeInfo.authors?.[0]}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800/60 hover:bg-gray-700/60 
                       border border-amber-500/30 transition-all"
                        >
                            <User className="w-5 h-5 text-amber-400" />
                            <span className="text-white">
                                {currentUser ? currentUser.name.split(' ')[0] : 'Guest'}
                            </span>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </motion.button>

                        {showUserMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-amber-500/20 
                         rounded-xl shadow-2xl overflow-hidden"
                            >
                                {currentUser ? (
                                    <>
                                        <div className="p-4 border-b border-gray-800">
                                            <p className="font-medium text-white">{currentUser.name}</p>
                                            <p className="text-sm text-gray-400">{currentUser.email}</p>
                                        </div>
                                        <Link
                                            to="/account"
                                            className="flex items-center space-x-2 p-3 hover:bg-amber-500/10 text-white"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <UserCircle className="w-4 h-4" />
                                            <span>Profile</span>
                                        </Link>
                                        {currentUser.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="flex items-center space-x-2 p-3 hover:bg-amber-500/10 text-white"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <Shield className="w-4 h-4" />
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-2 p-3 hover:bg-red-500/10 text-red-400 w-full"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="flex items-center space-x-2 p-3 hover:bg-amber-500/10 text-white"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Login</span>
                                    </Link>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="flex justify-center space-x-8 mt-4">
                    {['Home', 'Catalog', 'My Account', 'About', 'Help'].map((item, idx) => (
                        <motion.div
                            key={item}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link
                                to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                                className="text-gray-300 hover:text-amber-400 transition-colors flex items-center space-x-1 group"
                            >
                                <span>{item}</span>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
