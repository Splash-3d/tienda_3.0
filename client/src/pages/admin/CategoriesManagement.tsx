import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './CategoriesManagement.css';

interface Category {
  id: number;
  nombre: string;
  slug: string;
}

const CategoriesManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    slug: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categorias');
      setCategories(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await api.put(`/api/categorias/${editingCategory.id}`, formData);
      } else {
        await api.post('/api/categorias', formData);
      }

      fetchCategories();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error al guardar categoría:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      nombre: category.nombre,
      slug: category.slug
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await api.delete(`/api/categorias/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      slug: ''
    });
    setEditingCategory(null);
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
    <div className="categories-management">
      <div className="page-header">
        <h1 className="page-title">Categorías</h1>
        <button className="btn btn-primary" onClick={openModal}>
          Agregar Categoría
        </button>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <div className="category-header">
              <h3 className="category-name">{category.nombre}</h3>
              <span className="category-slug">/{category.slug}</span>
            </div>
            
            <div className="category-actions">
              <button className="btn btn-secondary btn-small" onClick={() => handleEdit(category)}>
                Editar
              </button>
              <button className="btn btn-outline btn-small" onClick={() => handleDelete(category.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
        
        {categories.length === 0 && (
          <div className="no-categories">
            <div className="no-categories-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
              </svg>
            </div>
            <h3>No hay categorías</h3>
            <p>Crea tu primera categoría para organizar tus productos</p>
            <button className="btn btn-primary" onClick={openModal}>
              Crear Categoría
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'Editar Categoría' : 'Agregar Categoría'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.nombre}
                  onChange={(e) => {
                    const nombre = e.target.value;
                    setFormData({
                      nombre,
                      slug: editingCategory ? formData.slug : generateSlug(nombre)
                    });
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Slug *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  required
                  pattern="[a-z0-9-]+"
                  title="Solo letras minúsculas, números y guiones"
                />
                <small className="form-help">
                  El slug se usa en las URLs. Solo letras minúsculas, números y guiones.
                </small>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;
