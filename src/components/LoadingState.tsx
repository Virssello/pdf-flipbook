import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  current: number;
  total: number;
  message?: string;
}

export function LoadingState({ current, total, message }: LoadingStateProps) {
  const progress = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-950 text-white">
      <Loader2 className="w-12 h-12 animate-spin text-emerald-400 mb-6" />
      <p className="text-lg font-medium mb-2">
        {message || 'Loading PDF...'}
      </p>
      <p className="text-sm text-gray-400 mb-4">
        Rendering page {current} of {total}
      </p>
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-400 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">{progress}%</p>
    </div>
  );
}
