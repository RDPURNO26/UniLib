import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { UniLibProvider } from './context/UniLibContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AILibrarianChat from './components/AILibrarianChat';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import BookDetails from './pages/BookDetails';
import MyAccount from './pages/MyAccount';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import About from './pages/About';
import Help from './pages/Help';

const App = () => {
  return (
    <UniLibProvider>
      <Router>
        <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans">
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/book/:id" element={<BookDetails />} />
              <Route path="/account" element={<MyAccount />} />
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<Help />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </AnimatePresence>
          <Footer />
          <AILibrarianChat />
        </div>
      </Router>
    </UniLibProvider>
  );
};

export default App;
