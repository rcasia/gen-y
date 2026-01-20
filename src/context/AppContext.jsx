import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    let parsedProducts = saved ? JSON.parse(saved) : [];
    
    // Migrar productos existentes: agregar musicType a CDs que no lo tengan
    parsedProducts = parsedProducts.map(product => {
      if (product.category === 'CDs' && !product.musicType) {
        // Intentar inferir el tipo de música desde la descripción o título
        const titleDesc = `${product.title} ${product.description}`.toLowerCase();
        if (titleDesc.includes('jazz')) {
          return { ...product, musicType: 'Jazz' };
        } else if (titleDesc.includes('rock alternativo') || titleDesc.includes('nirvana') || titleDesc.includes('radiohead')) {
          return { ...product, musicType: 'Rock Alternativo' };
        } else if (titleDesc.includes('electrónica') || titleDesc.includes('electronic') || titleDesc.includes('daft punk') || titleDesc.includes('deadmau5')) {
          return { ...product, musicType: 'Electrónica' };
        } else if (titleDesc.includes('progressive') || titleDesc.includes('pink floyd')) {
          return { ...product, musicType: 'Progressive' };
        } else if (titleDesc.includes('pop') || titleDesc.includes('madonna') || titleDesc.includes('michael jackson')) {
          return { ...product, musicType: 'Pop' };
        } else if (titleDesc.includes('rock') || titleDesc.includes('beatles') || titleDesc.includes('led zeppelin') || titleDesc.includes('rolling stones')) {
          return { ...product, musicType: 'Rock' };
        }
        // Si no se puede inferir, dejarlo sin clasificar
      }
      return product;
    });
    
    // Si no hay productos o hay menos de 10, usar los productos de ejemplo
    if (parsedProducts.length < 10) {
      return [
      {
        id: 1,
        title: 'Tocadiscos Vintage Technics',
        description: 'Tocadiscos clásico en perfecto estado. Incluye aguja nueva y base antivibraciones.',
        price: 150,
        image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&h=600&fit=crop&q=80',
        category: 'Tocadiscos',
        seller: 'Juan Pérez',
        deliveryType: 'encuentro',
        location: 'Madrid Centro'
      },
      {
        id: 2,
        title: 'Colección de Mangas One Piece',
        description: 'Volúmenes 1-50 en excelente estado. Sin marcas ni dobleces. Edición original.',
        price: 200,
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop&q=80',
        category: 'Mangas',
        seller: 'María García',
        deliveryType: 'envio',
        location: 'Barcelona'
      },
      {
        id: 3,
        title: 'PlayStation 5',
        description: 'Consola PS5 con 2 mandos y 3 juegos incluidos. Casi nueva, solo 2 meses de uso.',
        price: 450,
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=600&fit=crop&q=80',
        category: 'Juegos',
        seller: 'Carlos López',
        deliveryType: 'encuentro',
        location: 'Valencia'
      },
      {
        id: 4,
        title: 'Vinilo The Dark Side of the Moon',
        description: 'Edición limitada de Pink Floyd en perfecto estado. Incluye póster original.',
        price: 45,
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop&q=80',
        category: 'CDs',
        musicType: 'Progressive',
        seller: 'Ana Martínez',
        deliveryType: 'envio',
        location: 'Sevilla'
      },
      {
        id: 5,
        title: 'Tocadiscos Audio-Technica AT-LP120',
        description: 'Tocadiscos profesional con USB. Perfecto para DJs. Incluye cápsula y aguja.',
        price: 280,
        image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&h=600&fit=crop',
        category: 'Tocadiscos',
        seller: 'David Ruiz',
        deliveryType: 'encuentro',
        location: 'Bilbao'
      },
      {
        id: 6,
        title: 'Manga Attack on Titan Completo',
        description: 'Colección completa de Attack on Titan (34 volúmenes). Estado impecable.',
        price: 180,
          image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop&q=80',
        category: 'Mangas',
        seller: 'Laura Sánchez',
        deliveryType: 'envio',
        location: 'Málaga'
      },
      {
        id: 7,
        title: 'Nintendo Switch OLED',
        description: 'Consola Switch OLED con 5 juegos. Incluye funda y protector de pantalla.',
        price: 320,
        image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop',
        category: 'Juegos',
        seller: 'Roberto Torres',
        deliveryType: 'encuentro',
        location: 'Zaragoza'
      },
      {
        id: 8,
        title: 'CDs Clásicos de los 80s',
        description: 'Lote de 20 CDs originales de los 80s: Queen, Michael Jackson, Madonna, etc.',
        price: 60,
          image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop&q=80',
        category: 'CDs',
        musicType: 'Pop',
        seller: 'Carmen López',
        deliveryType: 'envio',
        location: 'Murcia'
      },
      {
        id: 9,
        title: 'Tocadiscos Crosley Cruiser',
        description: 'Tocadiscos portátil vintage con altavoces integrados. Color rojo retro.',
        price: 95,
          image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&h=600&fit=crop&q=80',
        category: 'Tocadiscos',
        seller: 'Miguel Ángel',
        deliveryType: 'encuentro',
        location: 'Granada'
      },
      {
        id: 10,
        title: 'Manga Demon Slayer Completo',
        description: 'Serie completa de Demon Slayer (23 volúmenes). Edición española nueva.',
        price: 165,
          image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop&q=80',
        category: 'Mangas',
        seller: 'Sofía Ramírez',
        deliveryType: 'envio',
        location: 'Córdoba'
      },
      {
        id: 11,
        title: 'Xbox Series X',
        description: 'Consola Xbox Series X con Game Pass de 3 meses. Caja original incluida.',
        price: 420,
          image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=600&fit=crop&q=80',
        category: 'Juegos',
        seller: 'Javier Moreno',
        deliveryType: 'encuentro',
        location: 'Alicante'
      },
      {
        id: 12,
        title: 'Vinilos de Jazz Clásico',
        description: 'Colección de 15 vinilos de jazz: Miles Davis, John Coltrane, Billie Holiday.',
        price: 120,
          image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop&q=80',
        category: 'CDs',
        musicType: 'Jazz',
        seller: 'Elena Fernández',
        deliveryType: 'envio',
        location: 'Valladolid'
      },
      {
        id: 13,
        title: 'Tocadiscos Pro-Ject Debut Carbon',
        description: 'Tocadiscos de alta fidelidad. Incluye cápsula Ortofon 2M Red.',
        price: 350,
        image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&h=600&fit=crop',
        category: 'Tocadiscos',
        seller: 'Pablo Jiménez',
        deliveryType: 'encuentro',
        location: 'Santander'
      },
      {
        id: 14,
        title: 'Manga My Hero Academia',
        description: 'Volúmenes 1-30 de My Hero Academia. Algunos con sobrecubierta limitada.',
        price: 195,
          image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop&q=80',
        category: 'Mangas',
        seller: 'Isabel Díaz',
        deliveryType: 'envio',
        location: 'Pamplona'
      },
      {
        id: 15,
        title: 'Steam Deck 256GB',
        description: 'Steam Deck en perfecto estado. Incluye funda y cargador original.',
        price: 480,
        image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop',
        category: 'Juegos',
        seller: 'Fernando Castro',
        deliveryType: 'encuentro',
        location: 'Salamanca'
      },
      {
        id: 16,
        title: 'CDs de Rock Alternativo',
        description: 'Lote de 12 CDs: Nirvana, Radiohead, The Strokes, Arctic Monkeys.',
        price: 55,
          image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop&q=80',
        category: 'CDs',
        musicType: 'Rock Alternativo',
        seller: 'Marta Vega',
        deliveryType: 'envio',
        location: 'Oviedo'
      },
      {
        id: 17,
        title: 'Tocadiscos Rega Planar 1',
        description: 'Tocadiscos británico de alta calidad. Incluye brazo RB110 y cápsula.',
        price: 420,
        image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&h=600&fit=crop',
        category: 'Tocadiscos',
        seller: 'Álvaro Morales',
        deliveryType: 'encuentro',
        location: 'Toledo'
      },
      {
        id: 18,
        title: 'Manga Tokyo Ghoul',
        description: 'Serie completa de Tokyo Ghoul (14 volúmenes) + Tokyo Ghoul:re (16 volúmenes).',
        price: 220,
          image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop&q=80',
        category: 'Mangas',
        seller: 'Patricia Navarro',
        deliveryType: 'envio',
        location: 'Badajoz'
      },
      {
        id: 19,
        title: 'PC Gaming RTX 3060',
        description: 'PC gaming con RTX 3060, Ryzen 5 5600X, 16GB RAM. Lista para jugar.',
        price: 850,
          image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=600&fit=crop&q=80',
        category: 'Juegos',
        seller: 'Diego Herrera',
        deliveryType: 'encuentro',
        location: 'Vigo'
      },
      {
        id: 20,
        title: 'Vinilos de Rock Clásico',
        description: 'Colección de 10 vinilos: Led Zeppelin, The Beatles, Rolling Stones, AC/DC.',
        price: 85,
          image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop&q=80',
        category: 'CDs',
        musicType: 'Rock',
        seller: 'Cristina Ramos',
        deliveryType: 'envio',
        location: 'Logroño'
      },
      {
        id: 21,
        title: 'Tocadiscos Victrola Vintage',
        description: 'Tocadiscos vintage con diseño retro. Incluye radio AM/FM y Bluetooth.',
        price: 110,
          image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&h=600&fit=crop&q=80',
        category: 'Tocadiscos',
        seller: 'Raúl Delgado',
        deliveryType: 'encuentro',
        location: 'León'
      },
      {
        id: 22,
        title: 'Manga Jujutsu Kaisen',
        description: 'Volúmenes 1-20 de Jujutsu Kaisen. Edición española en perfecto estado.',
        price: 140,
          image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop&q=80',
        category: 'Mangas',
        seller: 'Natalia Ortega',
        deliveryType: 'envio',
        location: 'Cádiz'
      },
      {
        id: 23,
        title: 'Game Boy Advance SP',
        description: 'Game Boy Advance SP en perfecto estado. Incluye 8 juegos originales.',
        price: 75,
        image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop',
        category: 'Juegos',
        seller: 'Óscar Martín',
        deliveryType: 'encuentro',
        location: 'Huelva'
      },
      {
        id: 24,
        title: 'CDs de Música Electrónica',
        description: 'Lote de 15 CDs: Daft Punk, Deadmau5, Skrillex, Avicii, Swedish House Mafia.',
        price: 70,
          image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop&q=80',
        category: 'CDs',
        musicType: 'Electrónica',
        seller: 'Lucía Blanco',
        deliveryType: 'envio',
        location: 'Palma'
      },
      {
        id: 25,
        title: 'Altavoces Vintage para Vinilos',
        description: 'Par de altavoces vintage de los 70s. Sonido cálido y auténtico.',
        price: 180,
          image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&h=600&fit=crop&q=80',
        category: 'Otros',
        seller: 'Manuel Serrano',
        deliveryType: 'encuentro',
        location: 'Burgos'
      },
      {
        id: 26,
        title: 'Figura de Anime Coleccionable',
        description: 'Figura de One Piece, Luffy Gear 5. Edición limitada, nueva en caja.',
        price: 120,
          image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop&q=80',
        category: 'Otros',
        seller: 'Andrea Pardo',
        deliveryType: 'envio',
        location: 'Tarragona'
      },
      {
        id: 27,
        title: 'Auriculares Gaming RGB',
        description: 'Auriculares gaming con iluminación RGB, 7.1 surround. Casi nuevos.',
        price: 65,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=80',
        category: 'Otros',
        seller: 'Rubén Gutiérrez',
        deliveryType: 'encuentro',
        location: 'Lleida'
      },
      {
        id: 28,
        title: 'Manga Chainsaw Man',
        description: 'Volúmenes 1-15 de Chainsaw Man. Serie completa hasta la fecha.',
        price: 125,
          image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop&q=80',
        category: 'Mangas',
        seller: 'Sergio Marín',
        deliveryType: 'envio',
        location: 'Girona'
      },
      {
        id: 29,
        title: 'Vinilo Abbey Road - The Beatles',
        description: 'Vinilo original de Abbey Road en excelente estado. Edición de los 70s.',
        price: 95,
          image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop&q=80',
        category: 'CDs',
        musicType: 'Rock',
        seller: 'Eva Cortés',
        deliveryType: 'encuentro',
        location: 'Cuenca'
      },
      {
        id: 30,
        title: 'Tocadiscos Numark PT01',
        description: 'Tocadiscos portátil para DJs. Incluye pitch control y reverse play.',
        price: 130,
        image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&h=600&fit=crop',
        category: 'Tocadiscos',
        seller: 'Iván Campos',
        deliveryType: 'envio',
        location: 'Jaén'
      }
      ];
    }
    
    // Si ya hay 10 o más productos guardados, usar esos
    return parsedProducts;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });


  useEffect(() => {
    // Guardar productos y asegurar que los CDs tengan musicType
    const productsToSave = products.map(product => {
      if (product.category === 'CDs' && !product.musicType) {
        // Si es un CD sin musicType, intentar inferirlo
        const titleDesc = `${product.title} ${product.description}`.toLowerCase();
        if (titleDesc.includes('jazz')) {
          return { ...product, musicType: 'Jazz' };
        } else if (titleDesc.includes('rock alternativo') || titleDesc.includes('nirvana') || titleDesc.includes('radiohead')) {
          return { ...product, musicType: 'Rock Alternativo' };
        } else if (titleDesc.includes('electrónica') || titleDesc.includes('electronic') || titleDesc.includes('daft punk') || titleDesc.includes('deadmau5')) {
          return { ...product, musicType: 'Electrónica' };
        } else if (titleDesc.includes('progressive') || titleDesc.includes('pink floyd')) {
          return { ...product, musicType: 'Progressive' };
        } else if (titleDesc.includes('pop') || titleDesc.includes('madonna') || titleDesc.includes('michael jackson')) {
          return { ...product, musicType: 'Pop' };
        } else if (titleDesc.includes('rock') || titleDesc.includes('beatles') || titleDesc.includes('led zeppelin') || titleDesc.includes('rolling stones')) {
          return { ...product, musicType: 'Rock' };
        }
      }
      return product;
    });
    localStorage.setItem('products', JSON.stringify(productsToSave));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      seller: 'Tú',
      date: new Date().toISOString()
    };
    setProducts([newProduct, ...products]);
  };

  const addToCart = (product) => {
    setCart([...cart, { ...product, cartId: Date.now() }]);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = {
    products,
    cart,
    addProduct,
    addToCart,
    removeFromCart,
    clearCart
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
