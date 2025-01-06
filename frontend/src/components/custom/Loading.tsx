import React from "react";

const LoadingSpinner = ({ showText }: { showText?: boolean }) => {
  return (
    <div className="flex items-center justify-center w-full bg-[#1B1B1B] text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
        {showText ? (
          <p className="text-lg font-medium">Loading, please wait...</p>
        ) : null}
      </div>
    </div>
  );
};

export default LoadingSpinner;
