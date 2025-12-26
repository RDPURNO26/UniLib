import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedCarousel = ({ books }) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    // ... (keep nextSlide, prevSlide, useEffect)

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % books.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + books.length) % books.length);
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [books.length]);

    return (
        <div className="relative max-w-6xl mx-auto">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex items-center justify-center"
                >
                    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl 
                        border-2 border-amber-500/40 rounded-3xl p-8 shadow-2xl w-full">
                        <div className="flex items-center space-x-8">
                            <img
                                src={books[currentIndex]?.cover}
                                alt={books[currentIndex]?.title}
                                className="w-64 h-80 object-cover rounded-2xl shadow-2xl"
                            />
                            <div className="flex-1">
                                <h3 className="text-4xl font-bold text-white mb-4">{books[currentIndex]?.title}</h3>
                                <p className="text-xl text-amber-400 mb-6">{books[currentIndex]?.author}</p>
                                <p className="text-gray-300 mb-6 line-clamp-3">{books[currentIndex]?.description}</p>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => navigate(`/book/${books[currentIndex]?.id}`)}
                                        className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 
                                   font-semibold rounded-full transition-all hover:scale-105">
                                        Borrow Now
                                    </button>
                                    <button
                                        onClick={() => navigate(`/book/${books[currentIndex]?.id}`)}
                                        className="px-6 py-3 border border-amber-500 text-amber-400 
                                   hover:bg-amber-500/10 rounded-full transition-all">
                                        Learn More
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-900/80 backdrop-blur-sm 
                 border border-amber-500/30 rounded-full flex items-center justify-center 
                 hover:bg-amber-500/20 transition-all"
            >
                <ChevronLeft className="w-6 h-6 text-amber-400" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-900/80 backdrop-blur-sm 
                 border border-amber-500/30 rounded-full flex items-center justify-center 
                 hover:bg-amber-500/20 transition-all"
            >
                <ChevronRight className="w-6 h-6 text-amber-400" />
            </button>

            <div className="flex justify-center space-x-2 mt-8">
                {books.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-amber-500 w-8' : 'bg-gray-600'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeaturedCarousel;
