
import React, { useState, useRef } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { UploadIcon, XCircleIcon } from './icons';
import { fileToBase64 } from '../services/geminiService';

interface PromptFormProps {
  onGenerate: (prompt: string, image?: { base64: string; mimeType: string }) => void;
  isGenerating: boolean;
}

export const PromptForm: React.FC<PromptFormProps> = ({ onGenerate, isGenerating }) => {
  const { t } = useLocalization();
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    let imageData: { base64: string; mimeType: string } | undefined = undefined;
    if (imageFile) {
      const base64 = await fileToBase64(imageFile);
      imageData = { base64, mimeType: imageFile.type };
    }
    onGenerate(prompt, imageData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">{t('promptLabel')}</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('promptPlaceholder')}
          rows={4}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          disabled={isGenerating}
        />
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          id="image-upload"
          disabled={isGenerating}
        />
        <label htmlFor="image-upload" className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${isGenerating ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>
          <UploadIcon className="w-5 h-5" />
          <span>{t('uploadImage')}</span>
        </label>
        {imagePreview && (
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-gray-800 rounded-full text-gray-300 hover:text-white"
              disabled={isGenerating}
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={isGenerating || !prompt.trim()}
        className="w-full flex justify-center items-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
      >
        {isGenerating ? t('generatingButton') : t('generateButton')}
      </button>
    </form>
  );
};
