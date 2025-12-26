import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookmarkCheck, Heart, AlertCircle, CheckCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUniLib } from '../context/UniLibContext';
import { getBooks, getCurrentUserLoans } from '../services/library';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser, requestBorrow } = useUniLib();
    const [book, setBook] = useState(null);
    const [similarBooks, setSimilarBooks] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loanStatus, setLoanStatus] = useState(null); // 'pending', 'approved', 'returned', null

    useEffect(() => {
        const books = getBooks();
        const foundBook = books.find(b => b.id === id);

        if (foundBook) {
            setBook(foundBook);
            // Simple similar books logic: same genre or random
            const similar = books.filter(b => b.id !== id && b.genre?.some(g => foundBook.genre?.includes(g))).slice(0, 3);
            setSimilarBooks(similar.length ? similar : books.filter(b => b.id !== id).slice(0, 3));
        } else {
            // Handle book not found
            navigate('/catalog');
        }
    }, [id, navigate]);

    useEffect(() => {
        if (currentUser && book) {
            const loans = getCurrentUserLoans(currentUser.id);
            const activeLoan = loans.find(l => l.bookId === book.id && ['Pending', 'Approved', 'pending', 'approved'].includes(l.status));
            if (activeLoan) {
                setLoanStatus(activeLoan.status.toLowerCase());
            } else {
                setLoanStatus(null);
            }
        }
    }, [currentUser, book]);

    const handleBorrowRequest = () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        if (loanStatus) return; // Prevent if already has status

        if (book.availableCopies > 0 || book.available) {
            setShowConfirmModal(true);
        }
    };

    const confirmBorrow = () => {
        requestBorrow(book.id, currentUser.id, 'Borrow request');
        setLoanStatus('pending'); // Optimistic update
        setShowConfirmModal(false);
    };

    if (!book) return <div className="text-center text-white py-20">Loading...</div>;

    const getButtonContent = () => {
        if (!currentUser) return 'Login to Borrow';
        if (loanStatus === 'pending') return 'Request Pending';
        if (loanStatus === 'approved') return 'Currently Borrowed';
        if (book.availableCopies === 0) return 'Join Waitlist (Out of Stock)';
        return 'Borrow Now';
    };

    const isButtonDisabled = loanStatus !== null || (book.availableCopies === 0 && !loanStatus);

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
                {/* Left Column - Cover */}
                <div className="lg:col-span-1">
                    <motion.img
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-auto rounded-3xl shadow-2xl border-4 border-amber-500/30"
                    />

                    {/* Quick Actions */}
                    <div className="flex space-x-4 mt-8">
                        <button
                            className={`flex-1 py-3 font-semibold rounded-xl transition-all flex items-center justify-center space-x-2
                                ${isButtonDisabled
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-amber-500 hover:bg-amber-600 text-gray-900 hover:scale-105'}`}
                            onClick={handleBorrowRequest}
                            disabled={isButtonDisabled}
                        >
                            {loanStatus === 'approved' ? <CheckCircle className="w-5 h-5" /> :
                                loanStatus === 'pending' ? <AlertCircle className="w-5 h-5" /> :
                                    <BookmarkCheck className="w-5 h-5" />}
                            <span>{getButtonContent()}</span>
                        </button>
                        <button className="p-3 border border-amber-500/30 text-amber-400 
                             hover:bg-amber-500/10 rounded-xl transition-all">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>
                    {loanStatus === 'pending' && <p className="text-yellow-400 text-center mt-2 text-sm">Awaiting Admin Approval</p>}
                    {loanStatus === 'approved' && <p className="text-green-400 text-center mt-2 text-sm">Enjoy your reading!</p>}
                </div>

                {/* Right Column - Details */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-5xl font-bold text-white mb-2">{book.title}</h1>
                                <p className="text-2xl text-amber-400">{book.author}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-full ${book.availableCopies > 0
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'}`}>
                                {book.availableCopies > 0 ? `${book.availableCopies} Available` : 'Out of Stock'}
                            </div>
                        </div>

                        {/* Genre Tags */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {book.genre?.map((g) => (
                                <span key={g} className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full">
                                    {g}
                                </span>
                            ))}
                        </div>

                        {/* Book Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-gray-900/60 p-4 rounded-xl">
                                <p className="text-gray-400 text-sm">ISBN</p>
                                <p className="text-white font-mono">{book.isbn}</p>
                            </div>
                            <div className="bg-gray-900/60 p-4 rounded-xl">
                                <p className="text-gray-400 text-sm">Pages</p>
                                <p className="text-white">{book.pageCount}</p>
                            </div>
                            <div className="bg-gray-900/60 p-4 rounded-xl">
                                <p className="text-gray-400 text-sm">Year</p>
                                <p className="text-white">{book.publishYear}</p>
                            </div>
                            <div className="bg-gray-900/60 p-4 rounded-xl">
                                <p className="text-gray-400 text-sm">Borrowed</p>
                                <p className="text-amber-400">{book.borrowedCount} times</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
                            <p className="text-gray-300 leading-relaxed">{book.description}</p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Similar Books */}
            <div className="mt-20">
                <h2 className="text-3xl font-bold text-white mb-8">Similar Books</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {similarBooks.map((similarBook, idx) => (
                        <motion.div
                            key={similarBook.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.03 }}
                            onClick={() => navigate(`/book/${similarBook.id}`)}
                            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg 
                       border border-amber-500/30 rounded-2xl p-6 cursor-pointer"
                        >
                            <div className="flex items-center space-x-4">
                                <img
                                    src={similarBook.cover}
                                    alt={similarBook.title}
                                    className="w-16 h-24 object-cover rounded-lg"
                                />
                                <div>
                                    <h3 className="font-bold text-white">{similarBook.title}</h3>
                                    <p className="text-gray-300 text-sm">{similarBook.author}</p>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full">
                                            {similarBook.genre?.[0]}
                                        </span>
                                        <span className="text-xs text-gray-400">{similarBook.publishYear}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gray-900/95 border border-amber-500/30 rounded-3xl p-8 max-w-md w-full mx-4"
                    >
                        <h3 className="text-2xl font-bold text-white mb-4">Confirm Borrow Request</h3>
                        <p className="text-gray-300 mb-6">
                            You are about to borrow "{book.title}" by {book.author}.
                            The due date will be 14 days from approval.
                        </p>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmBorrow}
                                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 
                         font-semibold rounded-xl transition-all"
                            >
                                Confirm
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default BookDetails;
