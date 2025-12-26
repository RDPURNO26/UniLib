import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="mt-20 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center space-x-2 mb-4">
                            <BookOpen className="w-6 h-6 text-amber-500" />
                            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 
                             bg-clip-text text-transparent">
                                UniLib
                            </span>
                        </div>
                        <p className="text-gray-400">© 2025 UniLib. All rights reserved.</p>
                    </div>

                    <div className="flex space-x-8">
                        <Link to="/about" className="text-gray-400 hover:text-amber-400 transition-colors">
                            About
                        </Link>
                        <Link to="/help" className="text-gray-400 hover:text-amber-400 transition-colors">
                            Contact
                        </Link>
                        <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                    <p className="text-gray-500 text-sm">
                        Built with React, Tailwind CSS, and Framer Motion • Premium Dark Theme
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
