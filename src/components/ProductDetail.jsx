import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useApp();
  
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="product-detail-container">
        <p>Producto no encontrado</p>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert('Producto añadido al carrito');
  };

  return (
    <div className="product-detail-container">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Volver
      </button>
      <div className="product-detail">
        <div className="product-detail-image">
          <img 
            src={product.image} 
            alt={product.title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x500?text=Sin+Imagen';
            }}
          />
        </div>
        <div className="product-detail-info">
          <div className="product-detail-category">{product.category}</div>
          <h1>{product.title}</h1>
          <div className="product-detail-price">€{product.price}</div>
          <div className="product-detail-description">
            <h3>Descripción</h3>
            <p>{product.description}</p>
          </div>
          <div className="product-detail-seller">
            <strong>Vendedor:</strong> {product.seller}
          </div>
          <div className="product-detail-delivery">
            <strong>Entrega:</strong> {product.deliveryType === 'envio' ? '📦 Envío a domicilio' : '📍 Punto de encuentro'}
            {product.location && <span> - {product.location}</span>}
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
