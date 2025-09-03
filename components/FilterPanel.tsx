/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface FilterPanelProps {
  onApplyFilter: (prompt: string) => void;
  isLoading: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onApplyFilter, isLoading }) => {
  const [selectedPresetPrompt, setSelectedPresetPrompt] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const presets = [
    { name: 'Synthwave', prompt: 'Apply a vibrant 80s synthwave aesthetic with neon magenta and cyan glows, and subtle scan lines.' },
    { name: 'Anime', prompt: 'Give the image a vibrant Japanese anime style, with bold outlines, cel-shading, and saturated colors.' },
    { name: 'Lomo', prompt: 'Apply a Lomography-style cross-processing film effect with high-contrast, oversaturated colors, and dark vignetting.' },
    { name: 'Glitch', prompt: 'Transform the image into a futuristic holographic projection with digital glitch effects and chromatic aberration.' },
  ];
  
  const activePrompt = selectedPresetPrompt || customPrompt;

  const handlePresetClick = (prompt: string) => {
    setSelectedPresetPrompt(prompt);
    setCustomPrompt('');
  };
  
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomPrompt(e.target.value);
    setSelectedPresetPrompt(null);
  };

  const handleApply = () => {
    if (activePrompt) {
      onApplyFilter(activePrompt);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-4 p-4">
        <h2 className="text-xl font-bold text-gray-200">Bộ lọc</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {presets.map(preset => (
            <button
              key={preset.name}
              className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${
                selectedPresetPrompt === preset.prompt
                  ? 'bg-blue-900/50 border-blue-500'
                  : 'bg-blue-950/30 border-blue-800/50 hover:border-blue-700'
              }`}
              onClick={() => handlePresetClick(preset.prompt)}
              disabled={isLoading}
            >
              <div className="w-12 h-12 rounded-md overflow-hidden bg-blue-900 flex items-center justify-center">
                <span className="text-cyan-400">{preset.name.charAt(0)}</span>
              </div>
              <span className="text-sm text-gray-300">{preset.name}</span>
            </button>
          ))}
        </div>

        <input
          type="text"
          value={customPrompt}
          onChange={handleCustomChange}
          placeholder="Hoặc mô tả một bộ lọc tùy chỉnh (ví dụ: 'phong cách synthwave thập niên 80')"
          className="flex-grow bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base"
          disabled={isLoading}
        />
        
        {activePrompt && (
          <div className="mt-4">
            <button
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              onClick={handleApply}
              disabled={isLoading}
            >
              {isLoading ? (
                <>Đang áp dụng...</>
              ) : (
                <>Áp dụng bộ lọc</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;