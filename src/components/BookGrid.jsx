import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BookGrid = ({ books }) => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {books.map((book, idx) => (
                <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate(`/book/${book.id}`)}
                    className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg 
                   border border-amber-500/30 rounded-2xl overflow-hidden shadow-xl cursor-pointer"
                >
                    <div className="relative">
                        <img
                            src={book.cover}
                            alt={book.title}
                            className="w-full h-64 object-cover group-hover:brightness-110 transition-all"
                        />
                        {book.createdAt && new Date(book.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                            <div className="absolute top-4 left-4 bg-green-500 text-gray-900 px-3 py-1 
                            rounded-full text-sm font-semibold">
                                New
                            </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
                            <div className="flex items-center justify-between">
                                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">
                                    {book.genre?.[0]}
                                </span>
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                                    {book.availableCopies} available
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
                            {book.title}
                        </h3>
                        <p className="text-gray-300 italic mb-4">{book.author}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">{book.publishYear}</span>
                            <span className="text-amber-400">{book.pageCount} pages</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default BookGrid;
