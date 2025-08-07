/**
 * 图片分割应用的类型定义
 */

// 支持的图片格式
export type SupportedImageFormat = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

// 上传状态
export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

// 原始图片信息
export interface OriginalImage {
  file: File;
  url: string;
  width: number;
  height: number;
  format: SupportedImageFormat;
}

// 分割后的图片信息
export interface SplitImage {
  id: string;
  blob: Blob;
  url: string;
  width: number;
  height: number;
  filename: string;
}

// 图片分割结果
export interface SplitResult {
  original: OriginalImage;
  splits: SplitImage[];
  timestamp: number;
}

// 上传进度信息
export interface UploadProgress {
  status: UploadStatus;
  progress: number;
  message?: string;
  error?: string;
}

// 下载选项
export interface DownloadOptions {
  filename?: string;
  format?: 'original' | 'png' | 'jpeg';
  quality?: number;
}

// 应用状态
export interface AppState {
  uploadProgress: UploadProgress;
  splitResult: SplitResult | null;
  isProcessing: boolean;
  error: string | null;
}

// 图片处理配置
export interface ImageProcessingConfig {
  maxFileSize: number; // 最大文件大小（字节）
  maxWidth: number; // 最大宽度
  maxHeight: number; // 最大高度
  quality: number; // 压缩质量 (0-1)
}

// 事件处理器类型
export interface ImageSplitterEvents {
  onUpload: (file: File) => void;
  onSplit: (result: SplitResult) => void;
  onDownload: (image: SplitImage, options?: DownloadOptions) => void;
  onDownloadAll: (images: SplitImage[], options?: DownloadOptions) => void;
  onError: (error: string) => void;
  onReset: () => void;
}
