'use client';

import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ImageUploader({ 
  onFileSelect, 
  isProcessing = false, 
  disabled = false,
  className 
}: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isProcessing) {
      setIsDragOver(true);
    }
  }, [disabled, isProcessing]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled || isProcessing) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      setSelectedFile(imageFile);
      onFileSelect(imageFile);
    }
  }, [disabled, isProcessing, onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors',
          'hover:border-gray-400 hover:bg-gray-50',
          isDragOver && 'border-black bg-gray-50',
          disabled && 'opacity-50 cursor-not-allowed',
          isProcessing && 'pointer-events-none',
          selectedFile && 'border-black bg-gray-50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileInput}
            disabled={disabled || isProcessing}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          
        <div className="flex flex-col items-center space-y-4">
          {selectedFile ? (
            <>
              <div className="flex items-center space-x-2 text-black">
                <ImageIcon className="h-6 w-6" />
                <span className="text-lg font-medium">文件已选择</span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 w-full max-w-md border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>

                  {!isProcessing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFile}
                      className="ml-2 h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {!isProcessing && (
                <p className="text-sm text-gray-500">
                  点击或拖拽新文件来替换
                </p>
              )}
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400" />
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  上传图片
                </h3>
                <p className="text-sm text-gray-500">
                  拖拽图片到此处，或点击选择文件
                </p>
                <p className="text-xs text-gray-400">
                  支持 JPG、PNG、GIF、WebP 格式，最大 10MB
                </p>
              </div>
            </>
          )}
        </div>
          
        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
            <div className="flex items-center space-x-2 text-black">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
              <span className="text-sm font-medium">处理中...</span>
            </div>
          </div>
        )}
      </div>

      {!selectedFile && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            disabled={disabled || isProcessing}
            onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
            className="border-gray-300"
          >
            <Upload className="h-4 w-4 mr-2" />
            选择文件
          </Button>
        </div>
      )}
    </div>
  );
}
