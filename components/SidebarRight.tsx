
import React from 'react';
import { ParticleConfig, SceneEffect } from '../types';

interface Props {
  config: ParticleConfig;
  onChange: (newConfig: ParticleConfig) => void;
  isOpen: boolean;
}

const EFFECTS = [
  { id: SceneEffect.NONE, label: 'Standard', icon: '✋' },
  { id: SceneEffect.SNOW, label: 'Snow', icon: '☝️' },
  { id: SceneEffect.FLOW, label: 'Flow', icon: '✌️' },
  { id: SceneEffect.EXPLOSION, label: 'Boom', icon: '✊' },
  { id: SceneEffect.INK, label: 'Ink', icon: '☁️' },
];

const SidebarRight: React.FC<Props> = ({ config, onChange, isOpen }) => {
  if (!isOpen) return null;

  const handleChange = (key: keyof ParticleConfig, value: number | string) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="absolute right-4 top-28 bottom-24 w-72 glass-panel rounded-2xl p-5 overflow-y-auto flex flex-col gap-6 z-20 transition-transform duration-300">
      <h2 className="text-xl font-bold text-white tracking-wide border-b border-gray-700 pb-2">
        Design Controls
      </h2>

      {/* Dynamic Scenes */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-blue-400 uppercase tracking-wider flex justify-between">
           <span>Dynamic Scene</span>
           <span className="text-[10px] text-gray-500 lowercase">use gestures</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {EFFECTS.map((effect) => (
             <button
                key={effect.id}
                onClick={() => handleChange('effect', effect.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                   config.effect === effect.id 
                   ? 'bg-blue-600 border-blue-400 text-white shadow-lg' 
                   : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700'
                }`}
             >
                <span className="text-xl">{effect.icon}</span>
                <span className="text-[10px] mt-1">{effect.label}</span>
             </button>
          ))}
        </div>
      </div>

      {/* Color Section */}
      <div className="space-y-3 pt-4 border-t border-gray-700">
        <label className="text-xs font-bold text-gray-400 uppercase">Color & Material</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={config.color}
            onChange={(e) => handleChange('color', e.target.value)}
            className="w-10 h-10 rounded-lg border-none cursor-pointer bg-transparent"
          />
          <input 
            type="text" 
            value={config.color}
            onChange={(e) => handleChange('color', e.target.value)}
            className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-3 text-sm text-gray-200 font-mono"
          />
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-300">
            <span>Particle Count</span>
            <span className="font-mono text-blue-400">{config.particleCount}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={config.particleCount}
            onChange={(e) => handleChange('particleCount', parseInt(e.target.value))}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-300">
            <span>Size</span>
            <span className="font-mono text-blue-400">{config.particleSize.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.2"
            step="0.005"
            value={config.particleSize}
            onChange={(e) => handleChange('particleSize', parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-300">
            <span>Speed (Physics)</span>
            <span className="font-mono text-blue-400">{config.speed.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={config.speed}
            onChange={(e) => handleChange('speed', parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-300">
            <span>Noise / Chaos</span>
            <span className="font-mono text-blue-400">{config.noise.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={config.noise}
            onChange={(e) => handleChange('noise', parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
        
         <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-300">
            <span>Opacity</span>
            <span className="font-mono text-blue-400">{config.opacity.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={config.opacity}
            onChange={(e) => handleChange('opacity', parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div className="pt-4 border-t border-gray-700 space-y-2">
          <label className="text-xs font-bold text-green-400 uppercase">Interaction</label>
           <div className="flex justify-between text-xs text-gray-300">
            <span>Hand Sensitivity</span>
            <span className="font-mono text-green-400">{config.interactionSensitivity}</span>
          </div>
           <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={config.interactionSensitivity}
            onChange={(e) => handleChange('interactionSensitivity', parseInt(e.target.value))}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;
