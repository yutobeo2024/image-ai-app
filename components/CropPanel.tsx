/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface CropPanelProps {
  onApplyCrop: () => void;
  onSetAspect: (aspect: number | undefined) => void;
  isLoading: boolean;
  isCropping: boolean;
}

type AspectRatio = 'free' | '1:1' | '16:9';

const CropPanel: React.FC<CropPanelProps> = ({ onApplyCrop, onSetAspect, isLoading, isCropping }) => {
  const [activeAspect, setActiveAspect] = useState<AspectRatio>('free');
  
  const handleAspectChange = (aspect: AspectRatio, value: number | undefined) => {
    setActiveAspect(aspect);
    onSetAspect(value);
  }

  const aspects: { name: AspectRatio, value: number | undefined, displayName: string }[] = [
    { name: 'free', value: undefined, displayName: 'Tự do' },
    { name: '1:1', value: 1 / 1, displayName: '1:1' },
    { name: '16:9', value: 16 / 9, displayName: '16:9' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-4 p-4">
        <h2 className="text-xl font-bold text-gray-200">Cắt ảnh</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${
                aspectRatio === 'free'
                  ? 'bg-blue-900/50 border-blue-500'
                  : 'bg-blue-950/30 border-blue-800/50 hover:border-blue-700'
              }`}
              onClick={() => setAspectRatio('free')}
            >
              <div className="w-12 h-12 rounded-md overflow-hidden bg-blue-900 flex items-center justify-center">
                <CropIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-sm text-gray-300">Tự do</span>
            </button>
            
            <button
              className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${
                aspectRatio === '1:1'
                  ? 'bg-blue-900/50 border-blue-500'
                  : 'bg-blue-950/30 border-blue-800/50 hover:border-blue-700'
              }`}
              onClick={() => setAspectRatio('1:1')}
            >
              <div className="w-12 h-12 rounded-md overflow-hidden bg-blue-900 flex items-center justify-center">
                <SquareIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-sm text-gray-300">Vuông (1:1)</span>
            </button>
            
            <button
              className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${
                aspectRatio === '4:3'
                  ? 'bg-blue-900/50 border-blue-500'
                  : 'bg-blue-950/30 border-blue-800/50 hover:border-blue-700'
              }`}
              onClick={() => setAspectRatio('4:3')}
            >
              <div className="w-12 h-12 rounded-md overflow-hidden bg-blue-900 flex items-center justify-center">
                <RectangleHorizontalIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-sm text-gray-300">4:3</span>
            </button>
            
            <button
              className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${
                aspectRatio === '16:9'
                  ? 'bg-blue-900/50 border-blue-500'
                  : 'bg-blue-950/30 border-blue-800/50 hover:border-blue-700'
              }`}
              onClick={() => setAspectRatio('16:9')}
            >
              <div className="w-12 h-12 rounded-md overflow-hidden bg-blue-900 flex items-center justify-center">
                <RectangleWideIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-sm text-gray-300">16:9</span>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <button
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            onClick={handleApplyCrop}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner className="w-5 h-5" />
                Đang áp dụng...
              </>
            ) : (
              <>
                <CheckIcon className="w-5 h-5" />
                Áp dụng cắt ảnh
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropPanel;