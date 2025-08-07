import { OriginalImage, SplitImage, SupportedImageFormat, ImageProcessingConfig } from '@/types';

/**
 * 默认图片处理配置
 */
export const DEFAULT_CONFIG: ImageProcessingConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxWidth: 4000,
  maxHeight: 4000,
  quality: 0.9,
};

/**
 * 支持的图片格式列表
 */
export const SUPPORTED_FORMATS: SupportedImageFormat[] = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

/**
 * 验证文件是否为支持的图片格式
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: '请选择一个文件' };
  }

  if (!SUPPORTED_FORMATS.includes(file.type as SupportedImageFormat)) {
    return { 
      valid: false, 
      error: `不支持的文件格式。支持的格式：${SUPPORTED_FORMATS.join(', ')}` 
    };
  }

  if (file.size > DEFAULT_CONFIG.maxFileSize) {
    return { 
      valid: false, 
      error: `文件大小超过限制（${(DEFAULT_CONFIG.maxFileSize / 1024 / 1024).toFixed(1)}MB）` 
    };
  }

  return { valid: true };
}

/**
 * 从文件创建图片对象
 */
export function createImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('无法加载图片'));
    };
    
    img.src = url;
  });
}

/**
 * 获取原始图片信息
 */
export async function getOriginalImageInfo(file: File): Promise<OriginalImage> {
  const img = await createImageFromFile(file);
  
  return {
    file,
    url: URL.createObjectURL(file),
    width: img.naturalWidth,
    height: img.naturalHeight,
    format: file.type as SupportedImageFormat,
  };
}

/**
 * 将图片横向分割为三等分
 */
export async function splitImageHorizontally(originalImage: OriginalImage): Promise<SplitImage[]> {
  const img = await createImageFromFile(originalImage.file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('无法创建Canvas上下文');
  }

  const { width, height } = originalImage;
  const splitWidth = Math.floor(width / 3);
  const splits: SplitImage[] = [];

  // 创建三个分割图片
  for (let i = 0; i < 3; i++) {
    canvas.width = splitWidth;
    canvas.height = height;
    
    // 清除画布
    ctx.clearRect(0, 0, splitWidth, height);
    
    // 绘制对应部分的图片
    const sourceX = i * splitWidth;
    ctx.drawImage(
      img,
      sourceX, 0, splitWidth, height, // 源图片区域
      0, 0, splitWidth, height        // 目标区域
    );
    
    // 转换为Blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('无法创建图片Blob'));
        }
      }, originalImage.format, DEFAULT_CONFIG.quality);
    });
    
    // 创建分割图片对象
    const splitImage: SplitImage = {
      id: `split-${i + 1}`,
      blob,
      url: URL.createObjectURL(blob),
      width: splitWidth,
      height,
      filename: generateSplitFilename(originalImage.file.name, i + 1),
    };
    
    splits.push(splitImage);
  }

  return splits;
}

/**
 * 生成分割图片的文件名
 */
export function generateSplitFilename(originalFilename: string, index: number): string {
  const lastDotIndex = originalFilename.lastIndexOf('.');
  const name = lastDotIndex > 0 ? originalFilename.substring(0, lastDotIndex) : originalFilename;
  const extension = lastDotIndex > 0 ? originalFilename.substring(lastDotIndex) : '.png';
  
  return `${name}_part_${index}${extension}`;
}

/**
 * 清理图片URL
 */
export function cleanupImageUrls(images: (OriginalImage | SplitImage)[]): void {
  images.forEach(image => {
    if (image.url) {
      URL.revokeObjectURL(image.url);
    }
  });
}

/**
 * 压缩图片
 */
export async function compressImage(
  file: File, 
  maxWidth: number = DEFAULT_CONFIG.maxWidth,
  maxHeight: number = DEFAULT_CONFIG.maxHeight,
  quality: number = DEFAULT_CONFIG.quality
): Promise<File> {
  const img = await createImageFromFile(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('无法创建Canvas上下文');
  }

  // 计算新尺寸
  let { width, height } = img;
  
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width *= ratio;
    height *= ratio;
  }

  canvas.width = width;
  canvas.height = height;
  
  // 绘制压缩后的图片
  ctx.drawImage(img, 0, 0, width, height);
  
  // 转换为Blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('无法压缩图片'));
      }
    }, file.type, quality);
  });
  
  // 创建新的File对象
  return new File([blob], file.name, { type: file.type });
}
