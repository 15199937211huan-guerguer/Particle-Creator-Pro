
import React, { useState, useRef, useCallback } from 'react';
import ParticleCanvas from './components/ParticleCanvas';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import ControlBar from './components/ControlBar';
import WebcamHandTracker from './components/WebcamHandTracker';
import GestureTutorial from './components/GestureTutorial';
import { ParticleConfig, ModelType, HandData, GestureType, SceneEffect } from './types';

const INITIAL_CONFIG: ParticleConfig = {
  model: ModelType.HEART,
  effect: SceneEffect.NONE,
  color: '#0099ff',
  particleCount: 15000,
  particleSize: 0.05,
  speed: 1.0,
  noise: 0.5,
  opacity: 0.8,
  interactionSensitivity: 5
};

function App() {
  const [config, setConfig] = useState<ParticleConfig>(INITIAL_CONFIG);
  const [uiVisible, setUiVisible] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  
  const handDataRef = useRef<HandData>({
    isDetected: false,
    pinchDistance: 0,
    centerX: 0,
    centerY: 0,
    gesture: GestureType.NONE
  });

  const handleHandUpdate = useCallback((data: HandData) => {
    handDataRef.current = data;
  }, []);

  const handleReset = () => {
    setConfig(INITIAL_CONFIG);
  };

  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `particle-creation-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      link.click();
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = "particle_config.json";
    link.click();
  };

  return (
    <div className="relative w-screen h-screen bg-gray-900 overflow-hidden select-none">
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <ParticleCanvas config={config} handData={handDataRef} />
      </div>

      {/* Hand Tracker */}
      <WebcamHandTracker 
        onHandUpdate={handleHandUpdate} 
        enabled={camEnabled}
      />

      {/* Tutorial Overlay */}
      {showTutorial && (
        <GestureTutorial onClose={() => setShowTutorial(false)} />
      )}

      {/* User Interface */}
      <div className={`transition-opacity duration-500 ${uiVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 text-center pointer-events-none">
           <h1 className="text-2xl font-black text-white tracking-widest uppercase drop-shadow-lg">
             Particle Creator <span className="text-blue-500">Pro</span>
           </h1>
           <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-1">Interactive Design System</p>
        </div>

        <SidebarLeft 
          selectedModel={config.model} 
          onSelect={(model) => setConfig({ ...config, model })} 
          isOpen={true}
        />

        <SidebarRight 
          config={config} 
          onChange={setConfig} 
          isOpen={true}
        />
      </div>

      <ControlBar 
        onReset={handleReset}
        onScreenshot={handleScreenshot}
        onExportJSON={handleExportJSON}
        onToggleUI={() => setUiVisible(!uiVisible)}
        onToggleCam={() => setCamEnabled(!camEnabled)}
        camEnabled={camEnabled}
        uiVisible={uiVisible}
      />
      
      {!uiVisible && camEnabled && (
         <div className="absolute top-4 right-4 z-40">
            <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-green-400 border border-green-500/30">
               Gesture Control Active
            </div>
         </div>
      )}
      
      {/* Always Visible Help Button */}
      {uiVisible && (
        <button 
          onClick={() => setShowTutorial(true)}
          className="absolute top-4 right-4 z-20 bg-gray-800/80 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded-full border border-gray-600 transition-all shadow-lg flex items-center gap-2"
        >
          <span className="text-lg">?</span> Help Center
        </button>
      )}

    </div>
  );
}

export default App;
