import React from 'react';

export const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full bg-gray-800 rounded-lg overflow-hidden">
        <img 
          src={imageUrl} 
          alt="Full size view" 
          className="w-full h-auto"
          onClick={e => e.stopPropagation()} 
        />
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-black/75 transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};