import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useApp();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <h2>Tu Carrito</h2>
        <div className="empty-cart">
          <p>Tu carrito está vacío</p>
          <Link to="/" className="shop-link">
            Ir a Comprar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Tu Carrito ({cart.length} {cart.length === 1 ? 'producto' : 'productos'})</h2>
      
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.cartId} className="cart-item">
            <img 
              src={item.image} 
              alt={item.title}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/100x100?text=Sin+Imagen';
              }}
            />
            <div className="cart-item-info">
              <h3>{item.title}</h3>
              <p className="cart-item-category">{item.category}</p>
              <p className="cart-item-seller">Vendedor: {item.seller}</p>
            </div>
            <div className="cart-item-price">€{item.price}</div>
            <button 
              onClick={() => removeFromCart(item.cartId)}
              className="remove-item-btn"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span className="total-amount">€{total.toFixed(2)}</span>
        </div>
        <div className="cart-actions">
          <button onClick={clearCart} className="clear-cart-btn">
            Vaciar Carrito
          </button>
          <button className="checkout-btn">
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
