import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import FeaturedCarousel from '../components/FeaturedCarousel';
import BookGrid from '../components/BookGrid';

import { useNavigate } from 'react-router-dom';
import { getBooks } from '../services/library';

const Home = () => {
    const navigate = useNavigate();
    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [mostBorrowed, setMostBorrowed] = useState([]);

    useEffect(() => {
        const books = getBooks();
        setFeaturedBooks(books.slice(0, 5));
        setNewArrivals([...books].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6));
        setMostBorrowed([...books].sort((a, b) => (b.borrowedCount || 0) - (a.borrowedCount || 0)).slice(0, 6));
    }, []);

    const particlesInit = async (engine) => {
        await loadSlim(engine);
    };

    return (
        <div className="relative min-h-screen bg-[#030712] overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-24 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-8">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-sm font-medium tracking-wide uppercase">Next Gen Library System</span>
                    </div>

                    <h1 className="text-7xl font-bold mb-8 leading-tight tracking-tight">
                        <span className="text-white">Knowledge </span>
                        <span className="bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700 bg-clip-text text-transparent">
                            Reimagined
                        </span>
                    </h1>
                    <p className="text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                        Experience the future of digital archiving with AI-powered discovery and seamless management.
                    </p>

                    {/* Hero Search */}
                    <div className="max-w-3xl mx-auto relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-blue-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all opacity-50" />
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search books, journals, or topics..."
                                className="w-full px-8 py-5 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-full 
                                         text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 
                                         text-lg shadow-2xl transition-all"
                            />
                            <div className="absolute right-3 top-2.5 p-2.5 bg-amber-500 rounded-full text-black hover:bg-amber-400 cursor-pointer transition-colors">
                                <Search className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Featured Carousel */}
            <section className="relative z-10 px-6 pb-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-4">
                        <h2 className="text-3xl font-bold text-white">Curated Bestsellers</h2>
                        <p className="text-gray-400 text-sm hidden md:block">Handpicked for your intellect</p>
                    </div>
                    <FeaturedCarousel books={featuredBooks} />
                </div>
            </section>

            {/* New Arrivals */}
            <section className="relative z-10 px-6 pb-24 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto py-16">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-2">Fresh Arrivals</h2>
                            <p className="text-gray-400">Just added to our digital shelves</p>
                        </div>
                        <Link to="/catalog" className="px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 text-white flex items-center gap-2 transition-all group">
                            <span>Explore Catalog</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <BookGrid books={newArrivals} />
                </div>
            </section>

            {/* Most Borrowed */}
            <section className="relative z-10 px-6 pb-32">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16 text-white pb-4">
                        <span className="border-b-2 border-amber-500 pb-2">Trending Now</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mostBorrowed.map((book, index) => (
                            <motion.div
                                key={book.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                onClick={() => navigate(`/book/${book.id}`)}
                                className="group relative bg-[#0a0a0a] border border-white/5 hover:border-amber-500/30 rounded-3xl p-6 cursor-pointer overflow-hidden transition-all"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />

                                <div className="flex items-start gap-6 relative z-10">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-amber-500/20 blur-lg rounded-lg group-hover:bg-amber-500/30 transition-all" />
                                        <img
                                            src={book.cover}
                                            alt={book.title}
                                            className="w-24 h-36 object-cover rounded-lg shadow-2xl relative z-10"
                                        />
                                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-500 text-black font-bold rounded-full flex items-center justify-center text-sm shadow-lg">
                                            #{index + 1}
                                        </div>
                                    </div>

                                    <div className="flex-1 pt-2">
                                        <h3 className="text-xl font-bold text-white leading-tight mb-2 group-hover:text-amber-400 transition-colors">
                                            {book.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-4">{book.author}</p>

                                        <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 bg-white/5 rounded-full w-fit text-amber-500/90">
                                            <span>🔥 {book.borrowedCount || 0} borrows</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
