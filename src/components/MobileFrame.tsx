import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex justify-center selection:bg-orange-500 selection:text-white">
      {/* Clean responsive container without fake smartphone bezels or notch */}
      <div className="w-full max-w-lg min-h-screen bg-stone-50 flex flex-col shadow-xs border-x border-stone-200/70">
        {children}
      </div>
    </div>
  );
};
