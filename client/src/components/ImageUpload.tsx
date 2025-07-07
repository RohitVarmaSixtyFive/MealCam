import React from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  selectedImage?: string;
  isLoading?: boolean;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  onImageRemove,
  selectedImage,
  isLoading = false,
  className = ''
}) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {selectedImage ? (
        <div className="relative">
          <img
            src={selectedImage}
            alt="Selected meal"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={onImageRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
          </button>
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="loading-spinner w-8 h-8 border-white"></div>
            </div>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Camera className="w-8 h-8 mb-4 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isLoading}
          />
        </label>
      )}
    </div>
  );
};

export default ImageUpload;

// Example usage:
// <ImageUpload
//   onImageSelect={(file) => console.log('Selected:', file)}
//   onImageRemove={() => console.log('Removed')}
//   selectedImage={previewUrl}
//   isLoading={isAnalyzing}
// />
