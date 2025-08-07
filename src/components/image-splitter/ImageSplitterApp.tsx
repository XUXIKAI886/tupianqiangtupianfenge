'use client';

import React from 'react';
import { RefreshCw, Download, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useImageSplitter } from '@/hooks/useImageSplitter';
import { ImageUploader } from './ImageUploader';
import { ImagePreview } from './ImagePreview';
import { ProgressIndicator } from './ProgressIndicator';
import { toast } from 'sonner';

export function ImageSplitterApp() {
  const {
    uploadProgress,
    splitResult,
    isProcessing,
    error,
    hasResult,
    canDownload,
    uploadAndSplitImage,
    downloadSplit,
    downloadAllSplits,
    reset,
    clearError,
  } = useImageSplitter();

  const handleFileSelect = async (file: File) => {
    try {
      await uploadAndSplitImage(file);
      toast.success('图片分割完成！');
    } catch {
      toast.error('图片处理失败');
    }
  };

  const handleDownloadSingle = async (image: { id: string; blob: Blob; url: string; width: number; height: number; filename: string }) => {
    try {
      await downloadSplit(image);
      toast.success('下载成功！');
    } catch {
      toast.error('下载失败');
    }
  };

  const handleDownloadAll = async () => {
    try {
      await downloadAllSplits();
      toast.success('批量下载成功！');
    } catch {
      toast.error('批量下载失败');
    }
  };

  const handleReset = () => {
    reset();
    clearError();
    toast.info('已重置，可以上传新图片');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 简洁头部 */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-black rounded flex items-center justify-center">
                <Scissors className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-black">图片墙图片分割工具</h1>
            </div>
            <div className="text-sm text-gray-500">呈尚策划运营部</div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 简洁标题 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">
            图片横向三等分
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            上传图片，自动分割为三个相等部分，支持多种格式下载
          </p>
        </div>

        {/* 主要内容区域 */}
        <div className="space-y-8">
          {/* 上传区域 */}
          <Card className="border border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">上传图片</CardTitle>
                {hasResult && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    disabled={isProcessing}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    重新开始
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ImageUploader
                onFileSelect={handleFileSelect}
                isProcessing={isProcessing}
                disabled={isProcessing}
              />
            </CardContent>
          </Card>

          {/* 进度指示器 */}
          <ProgressIndicator progress={uploadProgress} />

          {/* 错误提示 */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-red-700">
                    <span className="font-medium">错误: </span>
                    <span>{error}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearError}
                    className="text-red-600 hover:text-red-700"
                  >
                    关闭
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 图片预览和下载 */}
          {hasResult && (
            <div className="space-y-6">
              <ImagePreview
                originalImage={splitResult?.original}
                splitImages={splitResult?.splits}
                onDownloadSingle={handleDownloadSingle}
                onDownloadAll={handleDownloadAll}
              />

              {/* 下载操作区域 */}
              {canDownload && splitResult && (
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">下载选项</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={handleDownloadAll}
                      size="lg"
                      className="w-full bg-black hover:bg-gray-800"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      下载所有分割图片 (ZIP)
                    </Button>

                    <Separator />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {splitResult.splits.map((image, index) => (
                        <Button
                          key={image.id}
                          variant="outline"
                          onClick={() => handleDownloadSingle(image)}
                          className="border-gray-300"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          第 {index + 1} 部分
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* 使用说明 */}
          {!hasResult && !isProcessing && (
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">使用说明</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">支持的格式</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• JPEG (.jpg, .jpeg)</li>
                      <li>• PNG (.png)</li>
                      <li>• GIF (.gif)</li>
                      <li>• WebP (.webp)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">功能特点</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• 自动横向三等分</li>
                      <li>• 保持原图质量</li>
                      <li>• 支持批量下载</li>
                      <li>• 响应式设计</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 简洁底部 */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © 2025 图片墙图片分割工具 - 简单、快速
          </p>
        </footer>
      </div>
    </div>
  );
}
