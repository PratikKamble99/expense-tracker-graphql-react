interface LoadingSpinnerProps {
  showText?: boolean;
  className?: string;
}

const LoadingSpinner = ({ showText, className = '' }: LoadingSpinnerProps) => {
  return (
    <div className={`flex items-center justify-center w-full ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-7 h-7 border-[3px] border-t-transparent border-[#0D3F32] rounded-full animate-spin"></div>
        {showText ? (
          <p className="text-sm font-medium text-[#7A7A7A]">Loading, please wait...</p>
        ) : null}
      </div>
    </div>
  );
};

export default LoadingSpinner;
