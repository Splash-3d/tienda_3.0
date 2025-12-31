import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './CartPage.css';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();

  const handleQuantityChange = (id: number, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: number) => {
    removeItem(id);
  };

  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M9 2L6 9H3L5 21H19L21 9H18L15 2H9Z"/>
                <path d="M9 9V2"/>
                <path d="M15 9V2"/>
              </svg>
            </div>
            <h2>Tu carrito está vacío</h2>
            <p>Parece que aún no has añadido productos a tu carrito.</p>
            <Link to="/productos" className="btn btn-primary">
              Ver productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">Carrito de Compras</h1>
          <p className="cart-subtitle">
            {items.length} {items.length === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        <div className="cart-content">
          {/* Lista de productos */}
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  {item.imagen ? (
                    <img src={`/uploads/${item.imagen}`} alt={item.nombre} />
                  ) : (
                    <div className="item-placeholder">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                      </svg>
                    </div>
                  )}
                </div>

                <div className="item-details">
                  <Link to={`/producto/${item.id}`} className="item-name">
                    {item.nombre}
                  </Link>
                  <div className="item-price">${item.precio.toFixed(2)}</div>
                </div>

                <div className="item-quantity">
                  <div className="quantity-selector">
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.cantidad - 1)}
                      disabled={item.cantidad <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.cantidad}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                      min="1"
                      max="99"
                      className="quantity-input"
                    />
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.cantidad + 1)}
                      disabled={item.cantidad >= 99}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  <div className="item-total-price">${(item.precio * item.cantidad).toFixed(2)}</div>
                  <button
                    className="item-remove"
                    onClick={() => handleRemoveItem(item.id)}
                    title="Eliminar producto"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18"/>
                      <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="cart-summary">
            <div className="summary-card">
              <h3 className="summary-title">Resumen del Pedido</h3>
              
              <div className="summary-line">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="summary-line">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-line summary-total">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <button className="btn btn-primary btn-large btn-block">
                Finalizar compra
              </button>

              <div className="summary-note">
                <p>
                  Al finalizar la compra, aceptas nuestros términos y condiciones.
                  El envío es gratuito en pedidos superiores a $50.
                </p>
              </div>

              <Link to="/productos" className="btn btn-outline btn-block">
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
