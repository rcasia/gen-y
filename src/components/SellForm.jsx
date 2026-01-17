import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './SellForm.css';

const SellForm = () => {
  const navigate = useNavigate();
  const { addProduct } = useApp();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Otros',
    deliveryType: 'encuentro',
    location: ''
  });
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);

  const categories = ['CDs', 'Tocadiscos', 'Mangas', 'Juegos', 'Otros'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (error) {
      alert('No se pudo acceder a la cámara. Por favor, permite el acceso o sube una imagen.');
      console.error('Error accediendo a la cámara:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        setImage(file);
        setImagePreview(canvas.toDataURL());
        stopCamera();
      }, 'image/jpeg', 0.9);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.price) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    if (!imagePreview) {
      alert('Por favor, añade una imagen del producto');
      return;
    }

    const newProduct = {
      ...formData,
      price: parseFloat(formData.price),
      image: imagePreview,
      location: formData.deliveryType === 'encuentro' ? formData.location : undefined
    };

    addProduct(newProduct);
    alert('¡Producto publicado exitosamente!');
    navigate('/');
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      price: '',
      category: 'Otros',
      deliveryType: 'encuentro',
      location: ''
    });
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="sell-form-container">
      <h2>Vender Producto</h2>
      <form onSubmit={handleSubmit} className="sell-form">
        <div className="form-section">
          <h3>Información del Producto</h3>
          
          <div className="form-group">
            <label>Título *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ej: Tocadiscos Vintage"
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe tu producto..."
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio (€) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Categoría *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Imagen del Producto *</h3>
          
          <div className="image-options">
            <button type="button" onClick={startCamera} className="camera-btn">
              📷 Tomar Foto
            </button>
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              className="upload-btn"
            >
              📁 Subir Imagen
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {showCamera && (
            <div className="camera-modal">
              <div className="camera-container">
                <video ref={videoRef} autoPlay playsInline className="camera-video" />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <div className="camera-controls">
                  <button type="button" onClick={capturePhoto} className="capture-btn">
                    📸 Capturar
                  </button>
                  <button type="button" onClick={stopCamera} className="cancel-btn">
                    ✕ Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button 
                type="button" 
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="remove-image-btn"
              >
                ✕ Eliminar
              </button>
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Método de Entrega</h3>
          
          <div className="delivery-options">
            <label className="radio-option">
              <input
                type="radio"
                name="deliveryType"
                value="encuentro"
                checked={formData.deliveryType === 'encuentro'}
                onChange={handleInputChange}
              />
              <span>📍 Punto de Encuentro</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="deliveryType"
                value="envio"
                checked={formData.deliveryType === 'envio'}
                onChange={handleInputChange}
              />
              <span>📦 Envío a Domicilio</span>
            </label>
          </div>

          {formData.deliveryType === 'encuentro' && (
            <div className="form-group">
              <label>Ubicación del Encuentro</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ej: Madrid Centro, Plaza Mayor"
              />
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn">
          Publicar Producto
        </button>
      </form>
    </div>
  );
};

export default SellForm;
