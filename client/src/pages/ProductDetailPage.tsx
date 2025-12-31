import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './ProductDetailPage.css';

interface Product {
  id: number;
  nombre: string;
  descripcion_corta: string;
  descripcion_larga: string;
  precio: number;
  imagen: string | null;
  categorias: string[];
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/productos/${productId}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error al cargar producto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          imagen: product.imagen
        });
      }
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="product-not-found">
            <h2>Producto no encontrado</h2>
            <p>El producto que buscas no existe o ha sido eliminado.</p>
            <Link to="/productos" className="btn btn-primary">
              Volver a productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span className="separator">/</span>
          <Link to="/productos">Productos</Link>
          <span className="separator">/</span>
          <span className="current">{product.nombre}</span>
        </nav>

        {/* Producto Detail */}
        <div className="product-detail">
          <div className="product-gallery">
            <div className="main-image">
              {product.imagen ? (
                <img src={`/uploads/${product.imagen}`} alt={product.nombre} />
              ) : (
                <div className="product-placeholder large">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="product-info">
            <div className="product-categories">
              {product.categorias.map((cat, index) => (
                <span key={index} className="chip">
                  {cat}
                </span>
              ))}
            </div>

            <h1 className="product-title">{product.nombre}</h1>

            {product.descripcion_corta && (
              <p className="product-short-description">{product.descripcion_corta}</p>
            )}

            <div className="product-price-section">
              <span className="product-price">${product.precio.toFixed(2)}</span>
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min="1"
                  max="99"
                  className="quantity-input"
                />
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 99}
                >
                  +
                </button>
              </div>

              <button
                className={`btn btn-primary btn-large ${addedToCart ? 'btn-success' : ''}`}
                onClick={handleAddToCart}
              >
                {addedToCart ? '✓ Añadido' : 'Añadir al carrito'}
              </button>
            </div>

            {product.descripcion_larga && (
              <div className="product-description">
                <h3>Descripción</h3>
                <div 
                  className="description-content"
                  dangerouslySetInnerHTML={{ __html: product.descripcion_larga }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Productos relacionados */}
        <div className="related-products">
          <h2>Productos que podrían gustarte</h2>
          <div className="related-products-grid">
            {/* Aquí podrías cargar productos relacionados */}
            <div className="no-related-products">
              <p>Explora más productos en nuestra tienda</p>
              <Link to="/productos" className="btn btn-outline">
                Ver todos los productos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
