import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import SellForm from './components/SellForm';
import Cart from './components/Cart';
import Games from './components/Games';
import Loading from './components/Loading';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loading onComplete={handleLoadingComplete} />;
  }

  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/producto/:id" element={<ProductDetail />} />
              <Route path="/vender" element={<SellForm />} />
              <Route path="/juegos" element={<Games />} />
              <Route path="/carrito" element={<Cart />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
