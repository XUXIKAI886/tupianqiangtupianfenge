'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UploadProgress } from '@/types';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  progress: UploadProgress;
  className?: string;
}

export function ProgressIndicator({ progress, className }: ProgressIndicatorProps) {
  const { status, progress: percentage, message, error } = progress;

  // 如果是空闲状态，不显示进度指示器
  if (status === 'idle') {
    return null;
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };



  const getStatusText = () => {
    if (error) return error;
    if (message) return message;
    
    switch (status) {
      case 'uploading':
        return '上传中...';
      case 'processing':
        return '处理中...';
      case 'completed':
        return '处理完成！';
      case 'error':
        return '处理失败';
      default:
        return '';
    }
  };

  return (
    <Card className={cn('w-full border border-gray-200', className)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* 状态标题 */}
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={cn('font-medium', getStatusColor())}>
              {getStatusText()}
            </span>
          </div>

          {/* 进度条 */}
          {status !== 'error' && (
            <div className="space-y-2">
              <Progress
                value={percentage}
                className="w-full h-2"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{percentage}%</span>
                {status === 'completed' && (
                  <span className="text-green-600 font-medium">✓ 完成</span>
                )}
              </div>
            </div>
          )}

          {/* 错误信息 */}
          {status === 'error' && error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <p className="font-medium">处理失败</p>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* 成功信息 */}
          {status === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-700 font-medium">
                  图片分割完成，可以预览和下载结果
                </span>
              </div>
            </div>
          )}

          {/* 处理中的提示 */}
          {(status === 'uploading' || status === 'processing') && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                <span className="text-sm text-blue-700">
                  {status === 'uploading' ? '正在上传图片...' : '正在分割图片，请稍候...'}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// 简化版本的进度指示器，用于内联显示
export function InlineProgressIndicator({ progress, className }: ProgressIndicatorProps) {
  const { status, progress: percentage, message } = progress;

  if (status === 'idle') {
    return null;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {(status === 'uploading' || status === 'processing') && (
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      )}
      {status === 'completed' && (
        <CheckCircle className="h-4 w-4 text-green-500" />
      )}
      {status === 'error' && (
        <AlertCircle className="h-4 w-4 text-red-500" />
      )}
      
      <span className="text-sm font-medium">
        {message || `${percentage}%`}
      </span>
      
      {(status === 'uploading' || status === 'processing') && (
        <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
