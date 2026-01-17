import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const { cart } = useApp();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="black-hole-logo">
            <div className="black-hole-core"></div>
            <div className="black-hole-ring ring-1"></div>
            <div className="black-hole-ring ring-2"></div>
            <div className="black-hole-ring ring-3"></div>
          </div>
          <h1>GenY Market</h1>
        </Link>
        <nav className="nav">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Inicio
          </Link>
          <Link 
            to="/vender" 
            className={location.pathname === '/vender' ? 'nav-link active' : 'nav-link'}
          >
            Vender
          </Link>
          <Link 
            to="/juegos" 
            className={location.pathname === '/juegos' ? 'nav-link active' : 'nav-link'}
          >
            🎮 Juegos
          </Link>
          <Link 
            to="/carrito" 
            className={location.pathname === '/carrito' ? 'nav-link active' : 'nav-link'}
          >
            Carrito {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
