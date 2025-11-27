
import React from 'react';

interface Props {
  onClose: () => void;
}

const GestureTutorial: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="glass-panel p-8 rounded-3xl max-w-4xl w-full border border-gray-600 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-wide text-center">
          Help Center & <span className="text-blue-500">Tutorials</span>
        </h2>
        <p className="text-gray-400 text-center mb-8">Master the elements with your hands</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Controls */}
          <div className="col-span-1 md:col-span-3 text-sm font-bold text-blue-400 uppercase border-b border-gray-700 pb-2 mb-2">
             Basic Navigation
          </div>

          <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700 flex flex-col items-center text-center">
            <div className="text-5xl mb-3">👋</div>
            <h3 className="text-lg font-bold text-white mb-1">Rotate 3D</h3>
            <p className="text-xs text-gray-400">
              Move your open hand <b>Left/Right</b> or <b>Up/Down</b>.
            </p>
          </div>

          <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700 flex flex-col items-center text-center">
            <div className="text-5xl mb-3">🤏</div>
            <h3 className="text-lg font-bold text-white mb-1">Scale / Zoom</h3>
            <p className="text-xs text-gray-400">
              <b>Pinch</b> thumb and index finger together to shrink. Release to grow.
            </p>
          </div>

           <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700 flex flex-col items-center text-center">
            <div className="text-5xl mb-3">✋</div>
            <h3 className="text-lg font-bold text-white mb-1">Reset</h3>
            <p className="text-xs text-gray-400">
              Show an <b>Open Palm</b> to return to the standard calm state.
            </p>
          </div>

          {/* Advanced Physics */}
          <div className="col-span-1 md:col-span-3 text-sm font-bold text-green-400 uppercase border-b border-gray-700 pb-2 mb-2 mt-4">
             Gesture Magic (Physics Control)
          </div>

          <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700 flex flex-col items-center text-center border-b-4 border-b-red-500">
            <div className="text-5xl mb-3">✊</div>
            <h3 className="text-lg font-bold text-white mb-1">Explosion</h3>
            <p className="text-xs text-gray-400">
              Make a <b>Fist</b> to trigger the "Boom" effect. Particles will blast outward.
            </p>
          </div>

          <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700 flex flex-col items-center text-center border-b-4 border-b-blue-500">
            <div className="text-5xl mb-3">☝️</div>
            <h3 className="text-lg font-bold text-white mb-1">Snow Fall</h3>
            <p className="text-xs text-gray-400">
              Point your <b>Index Finger</b> up. Particles will fall like gravity.
            </p>
          </div>

          <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700 flex flex-col items-center text-center border-b-4 border-b-purple-500">
            <div className="text-5xl mb-3">✌️</div>
            <h3 className="text-lg font-bold text-white mb-1">Time Flow</h3>
            <p className="text-xs text-gray-400">
              Show a <b>Victory/Peace Sign</b>. Particles will enter a vortex flow.
            </p>
          </div>

        </div>

        <button 
          onClick={onClose}
          className="mt-8 w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl uppercase tracking-widest shadow-lg transform transition-transform active:scale-95"
        >
          Got it, Let's Design
        </button>
      </div>
    </div>
  );
};

export default GestureTutorial;
