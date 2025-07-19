import React from "react";

const GridBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    // <div className="w-full bg-black text-white bg-grid-white/[0.2] relative">
    <div className="w-full bg-[#E6F1EC] text-[#0D3F32] relative">
      {/* <div className="absolute pointer-events-none inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div> */}
      {/* <div className="absolute pointer-events-none inset-0 "></div> */}
      {children}
    </div>
  );
};
export default GridBackground;
