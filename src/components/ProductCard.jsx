import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/producto/${product.id}`} className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.title}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=Sin+Imagen';
          }}
        />
        <div className="product-category">{product.category}</div>
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <div className="product-price">€{product.price}</div>
          <div className="product-delivery">
            {product.deliveryType === 'envio' ? '📦 Envío' : '📍 Encuentro'}
          </div>
        </div>
        <div className="product-seller">Vendedor: {product.seller}</div>
      </div>
    </Link>
  );
};

export default ProductCard;
