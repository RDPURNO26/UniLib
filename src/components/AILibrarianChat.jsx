import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, X, Mic, Send } from 'lucide-react';
import { getBooks } from '../services/library';
import { simulateGeminiAPI } from '../utils/api';

// ...

const AILibrarianChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);

        // Simulate AI response
        const response = await simulateGeminiAPI(input);

        // Get real books for recommendation
        const allBooks = getBooks();
        // Simple random recommendation for mock
        const recommendations = allBooks.sort(() => 0.5 - Math.random()).slice(0, 3).map(b => ({
            id: b.id,
            title: b.title || 'Unknown Title',
            author: b.author || 'Unknown Author',
            cover: b.cover || 'https://via.placeholder.com/150'
        }));

        const aiResponse = {
            text: "Here are some book recommendations based on your query:",
            sender: 'ai',
            books: recommendations
        };

        setMessages(prev => [...prev, aiResponse]);
        setInput('');
    };

    const toggleVoiceInput = () => {
        if (!isListening) {
            // Start voice recognition
            setIsListening(true);
            setTimeout(() => {
                setInput("I'm looking for sci-fi books");
                setIsListening(false);
            }, 2000);
        } else {
            setIsListening(false);
        }
    };

    return (
        <>
            {/* Chat Bubble */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 
                 rounded-full shadow-2xl flex items-center justify-center z-40"
            >
                <Bot className="w-8 h-8 text-gray-900" />
            </motion.button>

            {/* Chat Panel */}
            {isOpen && (
                <motion.div
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="fixed bottom-0 right-6 w-96 h-[420px] bg-gray-900/95 backdrop-blur-xl 
                   border border-amber-500/30 rounded-t-3xl shadow-2xl z-50 overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Bot className="w-6 h-6 text-amber-400" />
                                <div>
                                    <h3 className="font-bold text-white">LibrarianBot</h3>
                                    <p className="text-xs text-green-400 flex items-center">
                                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-all"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="h-[calc(100%-140px)] overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'user'
                                        ? 'bg-amber-500 text-gray-900 rounded-br-none'
                                        : 'bg-gray-800 text-white rounded-bl-none'}`}
                                >
                                    <p>{msg.text}</p>
                                    {msg.books && (
                                        <div className="mt-3 space-y-2">
                                            {msg.books.map((book) => (
                                                <div
                                                    key={book.id}
                                                    className="flex items-center space-x-3 p-2 bg-gray-900/50 rounded-lg"
                                                >
                                                    <img
                                                        src={book.cover}
                                                        alt={book.title}
                                                        className="w-10 h-14 object-cover rounded"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-sm">{book.title}</p>
                                                        <p className="text-xs text-gray-400">{book.author}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-900">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={toggleVoiceInput}
                                className={`p-3 rounded-full ${isListening
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-gray-800 text-gray-400 hover:text-amber-400'}`}
                            >
                                <Mic className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Ask about books, genres, recommendations..."
                                className="flex-1 px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-full 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-amber-500 focus:border-transparent"
                            />
                            <button
                                onClick={sendMessage}
                                className="p-3 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-full 
                         transition-all hover:scale-105"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default AILibrarianChat;
