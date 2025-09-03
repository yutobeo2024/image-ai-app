import { VercelRequest, VercelResponse } from '@vercel/node';

interface EditHistory {
  id: string;
  timestamp: number;
  prompt: string;
  imageUrl: string;
}

// Giả lập cơ sở dữ liệu bằng biến toàn cục (trong thực tế nên sử dụng DB thực)
let editHistory: EditHistory[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Kiểm tra xác thực
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer admin_token') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    // Trả về lịch sử chỉnh sửa
    return res.status(200).json(editHistory);
  } 
  else if (req.method === 'POST') {
    try {
      const { prompt, imageUrl } = req.body;
      
      if (!prompt || !imageUrl) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newEntry: EditHistory = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        prompt,
        imageUrl
      };

      editHistory.push(newEntry);
      return res.status(201).json(newEntry);
    } catch (error) {
      console.error('Error saving edit history:', error);
      return res.status(500).json({ error: 'Failed to save edit history' });
    }
  } 
  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}