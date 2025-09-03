import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../services/authContext';
import Spinner from './Spinner';

interface EditHistory {
  id: string;
  timestamp: number;
  prompt: string;
  imageUrl: string;
}

const History: React.FC = () => {
  const [history, setHistory] = useState<EditHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const response = await fetch('/api/history', {
          headers: {
            'Authorization': 'Bearer admin_token'
          }
        });

        if (!response.ok) {
          throw new Error('Không thể tải lịch sử chỉnh sửa');
        }

        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isAuthenticated]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('vi-VN');
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Lịch sử chỉnh sửa ảnh</h1>
      
      {history.length === 0 ? (
        <p className="text-gray-500">Chưa có lịch sử chỉnh sửa nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden shadow-md">
              <div className="relative h-48">
                <img 
                  src={item.imageUrl} 
                  alt={`Ảnh chỉnh sửa ${item.id}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-2">{formatDate(item.timestamp)}</p>
                <p className="font-medium">Prompt: {item.prompt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;