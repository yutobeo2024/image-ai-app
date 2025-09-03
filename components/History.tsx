import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../services/authContext';
import Spinner from './Spinner';
import { getEditHistory, EditHistory } from '../services/historyService';
import { ClockIcon as HistoryIcon } from './icons';

const History: React.FC = () => {
  const [history, setHistory] = useState<EditHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const loadHistory = () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        // Sử dụng localStorage thay vì API
        const data = getEditHistory();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi đọc lịch sử');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [isAuthenticated]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('vi-VN');
  };

  const onSelectHistoryItem = (item: EditHistory) => {
    // Xử lý khi người dùng chọn một mục lịch sử
    console.log('Đã chọn mục lịch sử:', item);
    // Có thể thêm logic để hiển thị ảnh đã chọn
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <p>Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-4 p-4">
        <h2 className="text-xl font-bold text-gray-200">Lịch sử chỉnh sửa</h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner className="w-8 h-8 text-blue-500" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <HistoryIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Chưa có lịch sử chỉnh sửa</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 overflow-y-auto">
            {history.map((item, index) => (
              <button
                key={index}
                className="bg-blue-900/30 border border-blue-800/50 rounded-lg p-2 hover:border-blue-700 transition-colors"
                onClick={() => onSelectHistoryItem(item)}
              >
                <div className="aspect-square w-full overflow-hidden rounded-md mb-2">
                  <img
                    src={item.imageUrl}
                    alt={`Chỉnh sửa #${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-300 truncate">
                    {item.prompt}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;