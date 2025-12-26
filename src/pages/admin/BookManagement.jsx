import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Book, X, Image as ImageIcon } from 'lucide-react';
import { getBooks, addBook, updateBook, deleteBook } from '../../services/library';
import toast from 'react-hot-toast';

const BookManagement = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        description: '',
        cover: '',
        total_copies: 5
    });

    const fetchBooks = () => {
        setBooks(getBooks());
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (book = null) => {
        if (book) {
            setEditingBook(book);
            setFormData({
                title: book.title,
                author: book.author,
                genre: book.genre,
                description: book.description || '',
                cover: book.cover,
                total_copies: book.total_copies
            });
        } else {
            setEditingBook(null);
            setFormData({
                title: '',
                author: '',
                genre: '',
                description: '',
                cover: '',
                total_copies: 5
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            if (editingBook) {
                updateBook(editingBook.id, formData);
                toast.success("Book updated successfully");
            } else {
                addBook(formData);
                toast.success("Book added successfully");
            }
            setIsModalOpen(false);
            fetchBooks();
        } catch (error) {
            toast.error("Failed to save book");
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            deleteBook(id);
            toast.success("Book deleted successfully");
            fetchBooks();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Book Management</h1>
                    <p className="text-gray-400 mt-1">Add, edit, and remove books from the library</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-amber-500 text-gray-900 px-4 py-2.5 rounded-xl font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                >
                    <Plus size={20} />
                    Add New Book
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    placeholder="Search books by title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
            </div>

            {/* Books Table */}
            <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-gray-200 uppercase">
                            <tr>
                                <th className="px-6 py-3">Book Details</th>
                                <th className="px-6 py-3">Genre</th>
                                <th className="px-6 py-3 text-center">Copies</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredBooks.map((book) => (
                                <tr key={book.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={book.cover}
                                                alt={book.title}
                                                className="h-16 w-12 object-cover rounded shadow-md bg-gray-800"
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                                            />
                                            <div>
                                                <p className="text-white font-bold text-base">{book.title}</p>
                                                <p className="text-gray-500">{book.author}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-white/10 text-white px-2 py-1 rounded text-xs">
                                            {book.genre}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-white font-bold">{book.available_copies} / {book.total_copies}</span>
                                            <span className="text-xs text-gray-500">Available</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(book)}
                                                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(book.id)}
                                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div
                        className="glass-card w-full max-w-lg rounded-2xl border border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {editingBook ? 'Edit Book' : 'Add New Book'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Author</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Genre</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.genre}
                                        onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Cover Image URL</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="url"
                                            value={formData.cover}
                                            onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-primary"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <textarea
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Total Copies</label>
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    value={formData.total_copies}
                                    onChange={(e) => setFormData({ ...formData, total_copies: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Updating this will adjust available copies automatically.
                                </p>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full py-3 rounded-xl bg-amber-500 text-gray-900 font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                                >
                                    {editingBook ? 'Save Changes' : 'Add Book'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookManagement;
