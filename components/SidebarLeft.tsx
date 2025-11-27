
import React from 'react';
import { ModelType } from '../types';

interface Props {
  selectedModel: ModelType;
  onSelect: (model: ModelType) => void;
  isOpen: boolean;
}

const MODELS = [
  { id: ModelType.HEART, label: 'Heart', icon: '❤️', desc: 'Emotional branding' },
  { id: ModelType.FLOWER, label: 'Flower', icon: '🌸', desc: 'Beauty & Nature' },
  { id: ModelType.FIREWORKS, label: 'Fireworks', icon: '🎆', desc: 'Celebration' },
  { id: ModelType.SATURN, label: 'Saturn', icon: '🪐', desc: 'Tech & Space' },
  { id: ModelType.GALAXY, label: 'Galaxy', icon: '🌌', desc: 'Mystery & Depth' },
  { id: ModelType.PYRAMID, label: 'Pyramid', icon: '⚠️', desc: 'Structure' },
  { id: ModelType.SKULL, label: 'Skull', icon: '💀', desc: 'Edgy / Art' },
  { id: ModelType.DNA, label: 'Helix', icon: '🧬', desc: 'Medical & Science' },
  { id: ModelType.SPHERE, label: 'Sphere', icon: '🔮', desc: 'Minimalist Base' },
];

const SidebarLeft: React.FC<Props> = ({ selectedModel, onSelect, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute left-4 top-4 bottom-24 w-64 glass-panel rounded-2xl p-4 overflow-y-auto flex flex-col gap-4 z-20 transition-transform duration-300">
      <h2 className="text-xl font-bold text-white mb-2 tracking-wide border-b border-gray-700 pb-2">
        Models
      </h2>
      
      <div className="flex flex-col gap-3">
        {MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelect(model.id)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border ${
              selectedModel === model.id
                ? 'bg-blue-600/30 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                : 'bg-gray-800/40 border-transparent text-gray-400 hover:bg-gray-700/50 hover:text-white hover:border-gray-600'
            }`}
          >
            <span className="text-2xl">{model.icon}</span>
            <div className="text-left">
              <div className="font-semibold text-sm">{model.label}</div>
              <div className="text-xs text-gray-500">{model.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
        <h3 className="text-xs font-bold text-blue-400 mb-1">PRO TIP</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          Try the "Fist" gesture to explode the current model!
        </p>
      </div>
    </div>
  );
};

export default SidebarLeft;
