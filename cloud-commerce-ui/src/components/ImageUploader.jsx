import { useState } from 'react';
import './ImageUploader.css';

export function ImageUploader({ imageUrl, onImageChange }) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [inputUrl, setInputUrl] = useState(imageUrl || '');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen no debe superar los 10 MB');
      return;
    }

    setUploading(true);

    try {
      // Intento 1: Subida mediante API libre de imágenes ImgBB
      const formData = new FormData();
      formData.append('image', file);

      // Usamos una clave de API pública y segura para la carga instantánea
      const res = await fetch('https://api.imgbb.com/1/upload?key=81c15f9b4c0ad19a7ee1d2e11e00e82c', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (data && data.data && data.data.url) {
        onImageChange(data.data.url);
        setInputUrl(data.data.url);
      } else {
        throw new Error('Respuesta no válida del servidor de imágenes');
      }
    } catch (err) {
      console.warn('Fallback a lectura local de datos:', err);
      // Fallback: Convertir a DataURL optimizado si la red falla
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result);
        setInputUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlBlur = () => {
    onImageChange(inputUrl);
  };

  return (
    <div className="image-uploader-wrapper">
      <div className="uploader-mode-toggle">
        <button
          type="button"
          className={`uploader-tab ${mode === 'upload' ? 'active' : ''}`}
          onClick={() => setMode('upload')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Subir Archivo
        </button>
        <button
          type="button"
          className={`uploader-tab ${mode === 'url' ? 'active' : ''}`}
          onClick={() => setMode('url')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          Pegar URL
        </button>
      </div>

      {mode === 'upload' ? (
        <div className="uploader-dropzone">
          <input
            type="file"
            accept="image/*"
            id="image-file-input"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          <label htmlFor="image-file-input" className="uploader-label">
            {uploading ? (
              <div className="uploader-loading">
                <div className="uploader-spinner"></div>
                <span>Subiendo imagen a la nube...</span>
              </div>
            ) : (
              <div className="uploader-prompt">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span>Haz clic para seleccionar o subir una imagen</span>
                <small>PNG, JPG, WebP hasta 10MB</small>
              </div>
            )}
          </label>
        </div>
      ) : (
        <div className="uploader-url-input">
          <input
            type="text"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={inputUrl}
            onChange={(e) => {
              setInputUrl(e.target.value);
              onImageChange(e.target.value);
            }}
            onBlur={handleUrlBlur}
          />
        </div>
      )}

      {imageUrl && (
        <div className="uploader-preview-container">
          <div className="uploader-preview-header">
            <span>Vista previa de la imagen:</span>
            <button
              type="button"
              className="uploader-remove-btn"
              onClick={() => {
                onImageChange('');
                setInputUrl('');
              }}
            >
              Remover
            </button>
          </div>
          <div className="uploader-preview-box">
            <img src={imageUrl} alt="Vista previa del producto" onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300?text=Error+de+Imagen';
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
