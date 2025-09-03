export interface EditHistory {
  id: string;
  timestamp: number;
  prompt: string;
  imageUrl: string;
}

const HISTORY_KEY = 'image_edit_history';

// Lấy lịch sử chỉnh sửa từ localStorage
export const getEditHistory = (): EditHistory[] => {
  try {
    const historyData = localStorage.getItem(HISTORY_KEY);
    return historyData ? JSON.parse(historyData) : [];
  } catch (error) {
    console.error('Lỗi khi đọc lịch sử từ localStorage:', error);
    return [];
  }
};

// Lưu một mục mới vào lịch sử chỉnh sửa
export const saveEditHistory = (prompt: string, imageUrl: string): EditHistory => {
  try {
    const history = getEditHistory();
    
    const newEntry: EditHistory = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      prompt,
      imageUrl
    };
    
    // Thêm vào đầu mảng để hiển thị mục mới nhất trước
    const updatedHistory = [newEntry, ...history];
    
    // Giới hạn số lượng mục lịch sử (tùy chọn)
    const limitedHistory = updatedHistory.slice(0, 50);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
    return newEntry;
  } catch (error) {
    console.error('Lỗi khi lưu lịch sử vào localStorage:', error);
    throw error;
  }
};

// Xóa toàn bộ lịch sử
export const clearEditHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};

// Xóa một mục lịch sử cụ thể
export const deleteHistoryItem = (id: string): void => {
  try {
    const history = getEditHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Lỗi khi xóa mục lịch sử:', error);
    throw error;
  }
};