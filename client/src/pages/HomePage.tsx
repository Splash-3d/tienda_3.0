import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

interface Product {
  id: number;
  nombre: string;
  descripcion_corta: string;
  precio: number;
  imagen: string | null;
  categorias: string[];
}

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/productos');
      const data = await response.json();
      setProducts(data.slice(0, 8)); // Mostrar solo los primeros 8 productos
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Bienvenidos a Mi Tienda</h1>
            <p className="hero-subtitle">
              Descubre productos excepcionales con la calidad que mereces
            </p>
            <Link to="/productos" className="btn btn-primary btn-large">
              Ver Productos
            </Link>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Productos Destacados</h2>
            <p className="section-subtitle">Los más populares de nuestra colección</p>
          </div>
          
          <div className="grid grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="card product-card">
                <Link to={`/producto/${product.id}`} className="product-link">
                  <div className="product-image">
                    {product.imagen ? (
                      <img src={`/uploads/${product.imagen}`} alt={product.nombre} />
                    ) : (
                      <div className="product-placeholder">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21,15 16,10 5,21"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="product-info">
                    <h3 className="product-name">{product.nombre}</h3>
                    {product.descripcion_corta && (
                      <p className="product-description">{product.descripcion_corta}</p>
                    )}
                    <div className="product-footer">
                      <span className="product-price">${product.precio.toFixed(2)}</span>
                      <span className="product-action">Ver más →</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          <div className="section-footer">
            <Link to="/productos" className="btn btn-outline">
              Ver todos los productos
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="grid grid-cols-3">
            <div className="feature">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                  <path d="M2 17L12 22L22 17"/>
                  <path d="M2 12L12 17L22 12"/>
                </svg>
              </div>
              <h3 className="feature-title">Envío Rápido</h3>
              <p className="feature-description">
                Recibe tus pedidos en tiempo récord con nuestro servicio de entrega prioritaria
              </p>
            </div>
            
            <div className="feature">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 className="feature-title">Garantía de Calidad</h3>
              <p className="feature-description">
                Todos nuestros productos cuentan con garantía de satisfacción total
              </p>
            </div>
            
            <div className="feature">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              </div>
              <h3 className="feature-title">Soporte 24/7</h3>
              <p className="feature-description">
                Equipo de atención al cliente disponible para ayudarte en cualquier momento
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
