import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { SplitImage, DownloadOptions } from '@/types';

/**
 * 下载单个图片
 */
export async function downloadSingleImage(
  image: SplitImage, 
  options: DownloadOptions = {}
): Promise<void> {
  try {
    const filename = options.filename || image.filename;
    
    // 如果需要转换格式或调整质量
    if (options.format && options.format !== 'original') {
      const convertedBlob = await convertImageFormat(image.blob, options.format, options.quality);
      saveAs(convertedBlob, updateFilenameExtension(filename, options.format));
    } else {
      saveAs(image.blob, filename);
    }
  } catch (error) {
    console.error('下载图片失败:', error);
    throw new Error('下载图片失败');
  }
}

/**
 * 批量下载图片（ZIP格式）
 */
export async function downloadImagesAsZip(
  images: SplitImage[], 
  options: DownloadOptions = {}
): Promise<void> {
  try {
    const zip = new JSZip();
    const zipFilename = options.filename || `split_images_${Date.now()}.zip`;
    
    // 添加每个图片到ZIP
    for (const image of images) {
      let blob = image.blob;
      let filename = image.filename;
      
      // 如果需要转换格式
      if (options.format && options.format !== 'original') {
        blob = await convertImageFormat(blob, options.format, options.quality);
        filename = updateFilenameExtension(filename, options.format);
      }
      
      zip.file(filename, blob);
    }
    
    // 生成ZIP文件并下载
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, zipFilename);
  } catch (error) {
    console.error('批量下载失败:', error);
    throw new Error('批量下载失败');
  }
}

/**
 * 转换图片格式
 */
async function convertImageFormat(
  blob: Blob, 
  format: 'png' | 'jpeg', 
  quality: number = 0.9
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('无法创建Canvas上下文'));
      return;
    }
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // 如果转换为JPEG，先填充白色背景
      if (format === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((convertedBlob) => {
        if (convertedBlob) {
          resolve(convertedBlob);
        } else {
          reject(new Error('图片格式转换失败'));
        }
      }, `image/${format}`, quality);
    };
    
    img.onerror = () => {
      reject(new Error('无法加载图片'));
    };
    
    img.src = URL.createObjectURL(blob);
  });
}

/**
 * 更新文件名扩展名
 */
function updateFilenameExtension(filename: string, format: 'png' | 'jpeg'): string {
  const lastDotIndex = filename.lastIndexOf('.');
  const name = lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
  const extension = format === 'jpeg' ? '.jpg' : '.png';
  
  return `${name}${extension}`;
}

/**
 * 获取文件大小的可读格式
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 生成下载文件名建议
 */
export function generateDownloadFilename(originalFilename: string, suffix: string = ''): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
  const lastDotIndex = originalFilename.lastIndexOf('.');
  const name = lastDotIndex > 0 ? originalFilename.substring(0, lastDotIndex) : originalFilename;
  const extension = lastDotIndex > 0 ? originalFilename.substring(lastDotIndex) : '';
  
  return `${name}${suffix}_${timestamp}${extension}`;
}

/**
 * 检查浏览器是否支持下载功能
 */
export function isDownloadSupported(): boolean {
  return typeof window !== 'undefined' && 'URL' in window && 'createObjectURL' in URL;
}

/**
 * 预估ZIP文件大小
 */
export function estimateZipSize(images: SplitImage[]): number {
  // ZIP压缩率大约70-80%，这里使用75%作为估算
  const totalSize = images.reduce((sum, image) => sum + image.blob.size, 0);
  return Math.floor(totalSize * 0.75);
}
