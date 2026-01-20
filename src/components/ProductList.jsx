import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = () => {
  const { products } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedMusicType, setSelectedMusicType] = useState('todos');

  const categories = ['todos', 'CDs', 'Tocadiscos', 'Mangas', 'Juegos', 'Otros'];
  const musicTypes = ['todos', 'Rock', 'Pop', 'Jazz', 'Rock Alternativo', 'Electrónica', 'Progressive', 'Sin clasificar'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    
    // Lógica mejorada para el filtro de tipo de música
    let matchesMusicType = true;
    if (selectedCategory === 'CDs') {
      if (selectedMusicType === 'todos') {
        // Mostrar todos los CDs
        matchesMusicType = true;
      } else if (selectedMusicType === 'Sin clasificar') {
        // Mostrar solo CDs sin musicType
        matchesMusicType = !product.musicType || product.musicType === '';
      } else {
        // Mostrar solo CDs con el tipo de música seleccionado
        matchesMusicType = product.musicType === selectedMusicType;
      }
    }
    
    return matchesSearch && matchesCategory && matchesMusicType;
  });

  return (
    <div className="product-list-container">
      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Buscar productos..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(category);
                if (category !== 'CDs') {
                  setSelectedMusicType('todos');
                }
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        {selectedCategory === 'CDs' && (
          <div className="music-type-filters">
            <label className="music-filter-label">🎵 Tipo de Música:</label>
            <div className="category-filters">
              {musicTypes.map(musicType => (
                <button
                  key={musicType}
                  className={`category-btn music-type-btn ${selectedMusicType === musicType ? 'active' : ''}`}
                  onClick={() => setSelectedMusicType(musicType)}
                >
                  {musicType.charAt(0).toUpperCase() + musicType.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No se encontraron productos</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
