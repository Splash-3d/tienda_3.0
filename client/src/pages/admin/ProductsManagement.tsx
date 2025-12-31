import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './ProductsManagement.css';

interface Product {
  id: number;
  nombre: string;
  descripcion_corta: string;
  descripcion_larga: string;
  precio: number;
  imagen: string | null;
  activo: boolean;
  categorias: string[];
}

interface Category {
  id: number;
  nombre: string;
  slug: string;
}

const ProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion_corta: '',
    descripcion_larga: '',
    precio: '',
    categorias: [] as number[],
    activo: true,
    imagen: null as File | null
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/productos');
      setProducts(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categorias');
      setCategories(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = new FormData();
      data.append('nombre', formData.nombre);
      data.append('descripcion_corta', formData.descripcion_corta);
      data.append('descripcion_larga', formData.descripcion_larga);
      data.append('precio', formData.precio);
      data.append('activo', formData.activo ? '1' : '0');
      
      formData.categorias.forEach(catId => {
        data.append('categorias', catId.toString());
      });
      
      if (formData.imagen) {
        data.append('imagen', formData.imagen);
      } else if (editingProduct) {
        data.append('imagen_actual', editingProduct.imagen || '');
      }

      if (editingProduct) {
        await api.put(`/api/productos/${editingProduct.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/api/productos', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      fetchProducts();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      descripcion_corta: product.descripcion_corta || '',
      descripcion_larga: product.descripcion_larga || '',
      precio: product.precio.toString(),
      categorias: [],
      activo: product.activo,
      imagen: null
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await api.delete(`/api/productos/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion_corta: '',
      descripcion_larga: '',
      precio: '',
      categorias: [],
      activo: true,
      imagen: null
    });
    setEditingProduct(null);
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="products-management">
      <div className="page-header">
        <h1 className="page-title">Productos</h1>
        <button className="btn btn-primary" onClick={openModal}>
          Agregar Producto
        </button>
      </div>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categorías</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="product-image">
                    {product.imagen ? (
                      <img src={`/uploads/${product.imagen}`} alt={product.nombre} />
                    ) : (
                      <div className="no-image">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21,15 16,10 5,21"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="product-name">{product.nombre}</div>
                  {product.descripcion_corta && (
                    <div className="product-description">{product.descripcion_corta}</div>
                  )}
                </td>
                <td>${product.precio.toFixed(2)}</td>
                <td>
                  <div className="categories-list">
                    {product.categorias.map((cat, index) => (
                      <span key={index} className="chip">{cat}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`status ${product.activo ? 'active' : 'inactive'}`}>
                    {product.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button className="btn btn-secondary btn-small" onClick={() => handleEdit(product)}>
                      Editar
                    </button>
                    <button className="btn btn-outline btn-small" onClick={() => handleDelete(product.id)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nombre *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Precio *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={formData.precio}
                    onChange={(e) => setFormData({...formData, precio: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descripción Corta</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.descripcion_corta}
                  onChange={(e) => setFormData({...formData, descripcion_corta: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descripción Larga</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.descripcion_larga}
                  onChange={(e) => setFormData({...formData, descripcion_larga: e.target.value})}
                  rows={5}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Categorías</label>
                <div className="checkbox-group">
                  {categories.map((category) => (
                    <label key={category.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.categorias.includes(category.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, categorias: [...formData.categorias, category.id]});
                          } else {
                            setFormData({...formData, categorias: formData.categorias.filter(id => id !== category.id)});
                          }
                        }}
                      />
                      {category.nombre}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({...formData, imagen: e.target.files?.[0] || null})}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.activo}
                    onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                  />
                  Producto activo
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
