'use client';

import React from 'react';
import { Download, Eye, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OriginalImage, SplitImage } from '@/types';
import { cn } from '@/lib/utils';

interface ImagePreviewProps {
  originalImage?: OriginalImage;
  splitImages?: SplitImage[];
  onDownloadSingle?: (image: SplitImage) => void;
  onDownloadAll?: () => void;
  className?: string;
}

export function ImagePreview({
  originalImage,
  splitImages = [],
  onDownloadSingle,
  onDownloadAll,
  className
}: ImagePreviewProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!originalImage && splitImages.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-8 text-center">
          <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">暂无图片预览</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* 原图预览 */}
      {originalImage && (
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>原图预览</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative bg-gray-50 rounded-lg overflow-hidden border">
                <img
                  src={originalImage.url}
                  alt="原图"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">文件名:</span>
                  <p className="font-medium truncate">{originalImage.file.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">尺寸:</span>
                  <p className="font-medium">{originalImage.width} × {originalImage.height}</p>
                </div>
                <div>
                  <span className="text-gray-500">大小:</span>
                  <p className="font-medium">{formatFileSize(originalImage.file.size)}</p>
                </div>
                <div>
                  <span className="text-gray-500">格式:</span>
                  <p className="font-medium">{originalImage.format.split('/')[1].toUpperCase()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 分割结果预览 */}
      {splitImages.length > 0 && (
        <Card className="border border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5" />
                <span>分割结果</span>
                <span className="text-sm text-gray-500">({splitImages.length} 张)</span>
              </CardTitle>

              {onDownloadAll && (
                <Button onClick={onDownloadAll} size="sm" className="bg-black hover:bg-gray-800">
                  <Download className="h-4 w-4 mr-2" />
                  批量下载
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {splitImages.map((image, index) => (
                <div key={image.id} className="space-y-3">
                  <div className="relative bg-gray-50 rounded-lg overflow-hidden group border">
                    <img
                      src={image.url}
                      alt={`分割图片 ${index + 1}`}
                      className="w-full h-auto object-contain"
                    />

                    {/* 悬浮下载按钮 */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {onDownloadSingle && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onDownloadSingle(image)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          下载
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">部分 {index + 1}</span>
                      {onDownloadSingle && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDownloadSingle(image)}
                          className="h-8 px-2"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">尺寸:</span>
                        <p className="font-medium">{image.width} × {image.height}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">大小:</span>
                        <p className="font-medium">{formatFileSize(image.blob.size)}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500 text-xs">文件名:</span>
                      <p className="font-medium text-xs truncate">{image.filename}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
