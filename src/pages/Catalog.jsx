import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, BookX } from 'lucide-react';
import Fuse from 'fuse.js';
import { getBooks } from '../services/library';
import BookGrid from '../components/BookGrid';

const Catalog = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [sortBy, setSortBy] = useState('newest');
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);

    const genres = ['All', 'Fiction', 'Sci-Fi', 'Fantasy', 'Romance', 'Mystery', 'Biography', 'History'];

    useEffect(() => {
        const storedBooks = getBooks();
        setBooks(storedBooks);
        setFilteredBooks(storedBooks);
    }, []);

    useEffect(() => {
        let result = [...books];

        // Search filter
        if (searchTerm) {
            const fuse = new Fuse(result, {
                keys: ['title', 'author', 'genre'],
                threshold: 0.3
            });
            result = fuse.search(searchTerm).map(r => r.item);
        }

        // Genre filter
        if (selectedGenres.length > 0 && !selectedGenres.includes('All')) {
            result = result.filter(book =>
                book.genre?.some(g => selectedGenres.includes(g))
            );
        }

        // Availability filter
        if (showAvailableOnly) {
            result = result.filter(book => book.availableCopies > 0);
        }

        // Sort
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'most-borrowed':
                result.sort((a, b) => b.borrowedCount - a.borrowedCount);
                break;
            case 'a-z':
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        setFilteredBooks(result);
    }, [searchTerm, selectedGenres, sortBy, showAvailableOnly, books]);

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-center mb-12 text-white"
            >
                Browse Our Collection
            </motion.h1>

            {/* Search and Filters */}
            <div className="mb-12 space-y-6">
                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search books by title, author, or genre..."
                        className="w-full px-6 py-4 pl-14 bg-gray-900/60 backdrop-blur-lg border-2 border-amber-500/30 
                     rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-amber-500 focus:border-transparent text-lg"
                    />
                    <Search className="absolute left-6 top-4 w-6 h-6 text-amber-400" />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-gray-900/40 
                       backdrop-blur-lg rounded-2xl border border-amber-500/20">
                    {/* Genre Filters */}
                    <div className="flex flex-wrap gap-2">
                        {genres.map((genre) => (
                            <button
                                key={genre}
                                onClick={() => {
                                    if (genre === 'All') {
                                        setSelectedGenres(['All']);
                                    } else {
                                        setSelectedGenres(prev =>
                                            prev.includes('All') ? [genre] :
                                                prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
                                        );
                                    }
                                }}
                                className={`px-4 py-2 rounded-full border transition-all ${selectedGenres.includes(genre)
                                    ? 'bg-amber-500 text-gray-900 border-amber-500'
                                    : 'bg-gray-800/60 text-gray-300 border-gray-700 hover:border-amber-500/50'}`}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>

                    {/* Other Filters */}
                    <div className="flex items-center space-x-6">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showAvailableOnly}
                                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                                className="w-5 h-5 text-amber-500 rounded focus:ring-amber-500 focus:ring-offset-gray-900"
                            />
                            <span className="text-gray-300">Available Only</span>
                        </label>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-800/60 border border-amber-500/30 text-white rounded-lg px-4 py-2 
                       focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="newest">Newest First</option>
                            <option value="most-borrowed">Most Borrowed</option>
                            <option value="a-z">A to Z</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-8">
                <p className="text-gray-400">
                    Showing <span className="text-amber-400 font-semibold">{filteredBooks.length}</span> books
                </p>
            </div>

            {/* Books Grid */}
            {filteredBooks.length > 0 ? (
                <BookGrid books={filteredBooks} />
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <BookX className="w-24 h-24 text-gray-600 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-400 mb-2">No books found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                </motion.div>
            )}

            {/* Pagination */}
            {filteredBooks.length > 0 && (
                <div className="flex justify-center items-center space-x-4 mt-12">
                    <button className="p-2 rounded-lg bg-gray-800/60 border border-amber-500/30 
                           hover:bg-amber-500/20 transition-all">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <button
                            key={num}
                            className={`w-10 h-10 rounded-lg ${num === 1
                                ? 'bg-amber-500 text-gray-900'
                                : 'bg-gray-800/60 hover:bg-amber-500/20'} transition-all`}
                        >
                            {num}
                        </button>
                    ))}
                    <button className="p-2 rounded-lg bg-gray-800/60 border border-amber-500/30 
                           hover:bg-amber-500/20 transition-all">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Catalog;
