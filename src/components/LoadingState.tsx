interface LoadingStateProps {
  current: number;
  total: number;
}

export function LoadingState({ current, total }: LoadingStateProps) {
  const progress = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-950 text-white">
      <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
      <p className="text-sm text-white/70">Loading PDF...</p>
      {total > 1 && (
        <p className="text-xs text-white/40 mt-1">
          Rendering page {current} of {total} ({progress}%)
        </p>
      )}
    </div>
  );
}
