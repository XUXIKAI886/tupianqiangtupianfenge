import { useState, useCallback, useRef } from 'react';
import { 
  AppState, 
  SplitResult, 
  UploadProgress, 
  DownloadOptions,
  SplitImage 
} from '@/types';
import { 
  validateImageFile, 
  getOriginalImageInfo, 
  splitImageHorizontally,
  cleanupImageUrls 
} from '@/utils/image-processing';
import { downloadSingleImage, downloadImagesAsZip } from '@/utils/download';

/**
 * 图片分割应用的主要Hook
 */
export function useImageSplitter() {
  const [state, setState] = useState<AppState>({
    uploadProgress: {
      status: 'idle',
      progress: 0,
    },
    splitResult: null,
    isProcessing: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * 更新上传进度
   */
  const updateProgress = useCallback((progress: Partial<UploadProgress>) => {
    setState(prev => ({
      ...prev,
      uploadProgress: { ...prev.uploadProgress, ...progress },
    }));
  }, []);

  /**
   * 设置错误状态
   */
  const setError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error,
      isProcessing: false,
      uploadProgress: {
        ...prev.uploadProgress,
        status: error ? 'error' : 'idle',
      },
    }));
  }, []);

  /**
   * 上传并处理图片
   */
  const uploadAndSplitImage = useCallback(async (file: File) => {
    // 取消之前的操作
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      // 重置状态
      setState(prev => ({
        ...prev,
        error: null,
        isProcessing: true,
        splitResult: null,
      }));

      // 验证文件
      updateProgress({ status: 'uploading', progress: 10, message: '验证文件...' });
      const validation = validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // 获取原始图片信息
      updateProgress({ status: 'processing', progress: 30, message: '加载图片...' });
      const originalImage = await getOriginalImageInfo(file);
      
      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      // 分割图片
      updateProgress({ status: 'processing', progress: 60, message: '分割图片...' });
      const splits = await splitImageHorizontally(originalImage);
      
      if (abortControllerRef.current.signal.aborted) {
        cleanupImageUrls([originalImage, ...splits]);
        return;
      }

      // 完成处理
      updateProgress({ status: 'completed', progress: 100, message: '处理完成！' });
      
      const result: SplitResult = {
        original: originalImage,
        splits,
        timestamp: Date.now(),
      };

      setState(prev => ({
        ...prev,
        splitResult: result,
        isProcessing: false,
      }));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '处理图片时发生未知错误';
      setError(errorMessage);
    }
  }, [updateProgress, setError]);

  /**
   * 下载单个分割图片
   */
  const downloadSplit = useCallback(async (
    image: SplitImage, 
    options?: DownloadOptions
  ) => {
    try {
      await downloadSingleImage(image, options);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '下载失败';
      setError(errorMessage);
    }
  }, [setError]);

  /**
   * 批量下载所有分割图片
   */
  const downloadAllSplits = useCallback(async (options?: DownloadOptions) => {
    if (!state.splitResult) {
      setError('没有可下载的图片');
      return;
    }

    try {
      await downloadImagesAsZip(state.splitResult.splits, options);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '批量下载失败';
      setError(errorMessage);
    }
  }, [state.splitResult, setError]);

  /**
   * 重置应用状态
   */
  const reset = useCallback(() => {
    // 取消正在进行的操作
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 清理图片URL
    if (state.splitResult) {
      cleanupImageUrls([state.splitResult.original, ...state.splitResult.splits]);
    }

    // 重置状态
    setState({
      uploadProgress: {
        status: 'idle',
        progress: 0,
      },
      splitResult: null,
      isProcessing: false,
      error: null,
    });
  }, [state.splitResult]);

  /**
   * 清除错误状态
   */
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    // 状态
    ...state,
    
    // 操作方法
    uploadAndSplitImage,
    downloadSplit,
    downloadAllSplits,
    reset,
    clearError,
    
    // 计算属性
    hasResult: !!state.splitResult,
    canDownload: !!state.splitResult && !state.isProcessing,
    isUploading: state.uploadProgress.status === 'uploading',
    isProcessingImage: state.uploadProgress.status === 'processing',
    isCompleted: state.uploadProgress.status === 'completed',
    hasError: !!state.error,
  };
}
