import { useState, useEffect } from 'react';
import './Loading.css';

const Loading = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 300);

    return () => clearInterval(dotInterval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-character">
          <div className="character-body">
            <div className="character-head">
              <div className="eye left-eye"></div>
              <div className="eye right-eye"></div>
              <div className="mouth"></div>
            </div>
            <div className="character-torso">
              <div className="shopping-bag">
                <div className="bag-handle"></div>
                <div className="bag-items">
                  <div className="item item-1">💿</div>
                  <div className="item item-2">📀</div>
                  <div className="item item-3">🎮</div>
                </div>
              </div>
            </div>
            <div className="character-legs">
              <div className="leg left-leg"></div>
              <div className="leg right-leg"></div>
            </div>
          </div>
        </div>
        
        <h1 className="loading-title">🛍️ GenY Market</h1>
        <p className="loading-subtitle">Cargando productos increíbles{dots}</p>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            >
              <div className="progress-shine"></div>
            </div>
          </div>
          <div className="progress-text">{progress}%</div>
        </div>

        <div className="loading-items">
          <div className="floating-item item-cd">💿</div>
          <div className="floating-item item-vinyl">📀</div>
          <div className="floating-item item-game">🎮</div>
          <div className="floating-item item-manga">📚</div>
          <div className="floating-item item-turntable">🎧</div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
