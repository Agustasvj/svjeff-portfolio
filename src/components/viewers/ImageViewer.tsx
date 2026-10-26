/* ============================================================
   IMAGE / SCHEMATIC LIGHTBOX VIEWER
   Inspection tool with zoom, pan, and caption overlay
   ============================================================ */

import { useState } from 'react';
import type { ProjectImage } from '../../types';
import './ImageViewer.css';

interface ImageViewerProps {
  images: ProjectImage[];
  initialIndex?: number;
  onClose: () => void;
}

export default function ImageViewer({ images, initialIndex = 0, onClose }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  const currentImage = images[currentIndex] || images[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setZoomLevel(1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setZoomLevel(1);
  };

  const zoomIn = () => setZoomLevel((z) => Math.min(z + 0.5, 3));
  const zoomOut = () => setZoomLevel((z) => Math.max(z - 0.5, 1));
  const resetZoom = () => setZoomLevel(1);

  return (
    <div className="image-viewer-overlay" onClick={onClose}>
      <div className="image-viewer" onClick={(e) => e.stopPropagation()}>
        {/* Top Controls Bar */}
        <div className="image-viewer__bar">
          <span className="mono image-viewer__counter">
            {currentIndex + 1} / {images.length}
          </span>

          <div className="image-viewer__zoom-controls">
            <button className="image-viewer__btn" onClick={zoomOut} title="Zoom Out">-</button>
            <span className="mono zoom-text">{Math.round(zoomLevel * 100)}%</span>
            <button className="image-viewer__btn" onClick={zoomIn} title="Zoom In">+</button>
            <button className="image-viewer__btn mono" onClick={resetZoom}>Reset</button>
          </div>

          <button className="image-viewer__close" onClick={onClose} aria-label="Close image viewer">
            ✕
          </button>
        </div>

        {/* Main Stage */}
        <div className="image-viewer__stage">
          {images.length > 1 && (
            <button className="image-viewer__nav-btn prev" onClick={handlePrev} aria-label="Previous image">
              ‹
            </button>
          )}

          <div className="image-viewer__img-container">
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              style={{ transform: `scale(${zoomLevel})` }}
              className="image-viewer__img"
            />
          </div>

          {images.length > 1 && (
            <button className="image-viewer__nav-btn next" onClick={handleNext} aria-label="Next image">
              ›
            </button>
          )}
        </div>

        {/* Caption Bar */}
        <div className="image-viewer__caption-bar">
          <p className="image-viewer__caption">{currentImage.caption}</p>
        </div>
      </div>
    </div>
  );
}
