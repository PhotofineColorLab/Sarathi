import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  imageUrl: string;
  alt?: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, alt = 'Image', isOpen, onClose }) => {
  const [animateIn, setAnimateIn] = useState(false);
  
  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
      setTimeout(() => setAnimateIn(true), 10); // Trigger animation after mount
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = ''; // Restore scrolling
      setAnimateIn(false);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300"
      style={{ opacity: animateIn ? 1 : 0 }}
      onClick={onClose}
    >
      <div className="relative max-w-7xl max-h-screen p-4">
        <button 
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X size={24} />
        </button>
        
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl transform transition-transform duration-300"
          style={{ transform: animateIn ? 'scale(1)' : 'scale(0.9)' }}
          onClick={(e) => e.stopPropagation()}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
          }}
        />
      </div>
    </div>
  );
};

export default ImageModal; 