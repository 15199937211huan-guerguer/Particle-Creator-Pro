import React from 'react';

interface Props {
  onReset: () => void;
  onScreenshot: () => void;
  onExportJSON: () => void;
  onToggleUI: () => void;
  onToggleCam: () => void;
  camEnabled: boolean;
  uiVisible: boolean;
}

const ControlBar: React.FC<Props> = ({ 
  onReset, 
  onScreenshot, 
  onExportJSON, 
  onToggleUI,
  onToggleCam,
  camEnabled,
  uiVisible 
}) => {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 glass-panel px-6 py-3 rounded-full flex items-center gap-6 z-30 shadow-2xl">
      <button 
        onClick={onToggleCam} 
        title={camEnabled ? "Disable Camera" : "Enable Camera"}
        className={`flex flex-col items-center gap-1 group transition-colors ${camEnabled ? 'text-green-400' : 'text-gray-400'}`}
      >
        <div className={`p-2 rounded-full ${camEnabled ? 'bg-green-500/20' : 'bg-gray-700/30'} group-hover:bg-green-500/40`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wider">AI Vision</span>
      </button>

      <div className="w-px h-8 bg-gray-700"></div>

      <button onClick={onReset} className="flex flex-col items-center gap-1 group text-gray-400 hover:text-white transition-colors">
        <div className="p-2 rounded-full bg-gray-700/30 group-hover:bg-blue-500/40">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wider">Reset</span>
      </button>

      <button onClick={onScreenshot} className="flex flex-col items-center gap-1 group text-gray-400 hover:text-white transition-colors">
        <div className="p-2 rounded-full bg-gray-700/30 group-hover:bg-purple-500/40">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wider">Save IMG</span>
      </button>

      <button onClick={onExportJSON} className="flex flex-col items-center gap-1 group text-gray-400 hover:text-white transition-colors">
        <div className="p-2 rounded-full bg-gray-700/30 group-hover:bg-yellow-500/40">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wider">JSON</span>
      </button>

      <div className="w-px h-8 bg-gray-700"></div>

       <button onClick={onToggleUI} className="flex flex-col items-center gap-1 group text-gray-400 hover:text-white transition-colors">
        <div className="p-2 rounded-full bg-gray-700/30 group-hover:bg-gray-500/40">
           {uiVisible ? (
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
           ) : (
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
           )}
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wider">{uiVisible ? 'Hide UI' : 'Show UI'}</span>
      </button>
    </div>
  );
};

export default ControlBar;
