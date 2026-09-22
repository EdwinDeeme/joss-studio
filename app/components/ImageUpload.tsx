'use client';

import React, { useRef, useState } from 'react';

interface ImageUploadProps {
  value: File | null;
  preview: string;
  onChange: (file: File | null, preview: string) => void;
  maxSize?: number; // in bytes
  label?: string;
  helperText?: string;
}

export const ImageUpload = React.forwardRef<HTMLDivElement, ImageUploadProps>(
  ({ value, preview, onChange, maxSize = 5 * 1024 * 1024, label = 'Foto de inspiración', helperText }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragActive, setIsDragActive] = useState(false);

    const handleFile = (file: File | null) => {
      if (file && file.size > maxSize) {
        alert(`El archivo es demasiado grande. Máximo ${maxSize / 1024 / 1024}MB`);
        return;
      }

      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          onChange(file, e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setIsDragActive(true);
      } else if (e.type === 'dragleave') {
        setIsDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const file = e.dataTransfer.files[0];
      handleFile(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      handleFile(file || null);
    };

    return (
      <div ref={ref} className="space-y-2">
        {label && <label className="block text-sm font-semibold text-dark">{label}</label>}

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center w-full p-8
            border-2 border-dashed rounded-lg cursor-pointer
            transition-all duration-200
            ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : value
                  ? 'border-primary-300 bg-primary-50'
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
            aria-label="Upload image"
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full text-center"
          >
            <div className="space-y-2">
              <p className="text-4xl">📸</p>
              <p className="font-semibold text-dark">
                {value ? 'Cambiar foto' : 'Subir foto de inspiración'}
              </p>
              <p className="text-sm text-gray-500">JPG, PNG (máx. {maxSize / 1024 / 1024}MB)</p>
            </div>
          </button>
        </div>

        {preview && (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full rounded-lg shadow-md" />
            <button
              type="button"
              onClick={() => onChange(null, '')}
              className="
                absolute top-2 right-2 p-2
                bg-red-500 hover:bg-red-600 text-white rounded-full
                shadow-lg transition-colors
              "
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        )}

        {helperText && <p className="text-xs text-gray-500 mt-2">{helperText}</p>}
      </div>
    );
  },
);

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;
