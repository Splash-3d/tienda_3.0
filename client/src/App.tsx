import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import PageDetail from './pages/PageDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Rutas de la tienda */}
              <Route path="/" element={<><Navbar /><HomePage /></>} />
              <Route path="/productos" element={<><Navbar /><ProductsPage /></>} />
              <Route path="/producto/:id" element={<><Navbar /><ProductDetailPage /></>} />
              <Route path="/carrito" element={<><Navbar /><CartPage /></>} />
              <Route path="/paginas/:slug" element={<><Navbar /><PageDetail /></>} />
              
              {/* Rutas del admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              
              {/* Redirección por defecto */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
