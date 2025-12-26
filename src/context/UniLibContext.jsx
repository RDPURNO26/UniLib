import React, { createContext, useState, useEffect, useContext } from 'react';
import { initializeStorage } from '../utils/api';

const UniLibContext = createContext();

export const useUniLib = () => useContext(UniLibContext);

export const UniLibProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('unilib_theme') === 'dark');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        initializeStorage();
        const storedUser = JSON.parse(localStorage.getItem('unilib_user'));
        if (storedUser) setCurrentUser(storedUser);

        // Apply dark mode
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('unilib_theme', newMode ? 'dark' : 'light');
    };

    const login = (userData) => {
        const users = JSON.parse(localStorage.getItem('unilib_users') || '[]');
        const user = users.find(u => u.email === userData.email && u.password === userData.password);

        if (user) {
            setCurrentUser(user);
            localStorage.setItem('unilib_user', JSON.stringify(user));
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('unilib_user');
    };

    const addBook = (bookData) => {
        const books = JSON.parse(localStorage.getItem('unilib_books') || '[]');
        const newBook = {
            ...bookData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString().split('T')[0],
            borrowedCount: 0
        };
        books.unshift(newBook);
        localStorage.setItem('unilib_books', JSON.stringify(books));
        return newBook;
    };

    const requestBorrow = (bookId, userId, reason = '') => {
        const requests = JSON.parse(localStorage.getItem('unilib_borrow_requests') || '[]');
        const books = JSON.parse(localStorage.getItem('unilib_books') || '[]');
        const book = books.find(b => b.id === bookId);

        const newRequest = {
            id: Date.now().toString(),
            book_id: bookId,
            user_id: userId,
            status: 'pending',
            request_date: new Date().toISOString(),
            reason,
            // Add book details for display
            title: book ? book.title : 'Unknown Book',
            cover: book ? book.cover : '',
            author: book ? book.author : ''
        };
        requests.push(newRequest);
        localStorage.setItem('unilib_borrow_requests', JSON.stringify(requests));
        return newRequest;
    };

    const updateBookAvailability = (bookId, change) => {
        const books = JSON.parse(localStorage.getItem('unilib_books') || '[]');
        const bookIndex = books.findIndex(b => b.id === bookId);
        if (bookIndex !== -1) {
            books[bookIndex].availableCopies += change;
            localStorage.setItem('unilib_books', JSON.stringify(books));
        }
    };

    return (
        <UniLibContext.Provider value={{
            darkMode,
            toggleDarkMode,
            currentUser,
            login,
            logout,
            addBook,
            requestBorrow,
            updateBookAvailability
        }}>
            {children}
        </UniLibContext.Provider>
    );
};
