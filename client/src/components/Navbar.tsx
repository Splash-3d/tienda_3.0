import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const { getTotalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/paginas');
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error('Error al cargar páginas:', error);
    }
  };

  const totalItems = getTotalItems();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            Mi Tienda
          </Link>

          {/* Navegación Desktop */}
          <div className="navbar-menu">
            <Link to="/productos" className={`navbar-link ${location.pathname === '/productos' ? 'active' : ''}`}>
              Productos
            </Link>
            
            {/* Menú de páginas */}
            {pages.length > 0 && (
              <div className="navbar-dropdown">
                <button 
                  className="navbar-link dropdown-toggle"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  Más
                  <span className={`dropdown-arrow ${isMenuOpen ? 'open' : ''}`}>▼</span>
                </button>
                
                {isMenuOpen && (
                  <div className="dropdown-menu">
                    {pages.map((page) => (
                      <Link
                        key={page.id}
                        to={`/paginas/${page.slug}`}
                        className="dropdown-item"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {page.titulo}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Carrito */}
          <Link to="/carrito" className="navbar-cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 2L6 9H3L5 21H19L21 9H18L15 2H9Z"/>
              <path d="M9 9V2"/>
              <path d="M15 9V2"/>
            </svg>
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
