/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

const handleApiResponse = (response: GenerateContentResponse): string => {
    if (response.promptFeedback?.blockReason) {
        const { blockReason, blockReasonMessage } = response.promptFeedback;
        throw new Error(`Yêu cầu đã bị chặn. Lý do: ${blockReason}. ${blockReasonMessage || ''}`);
    }
    const imagePartFromResponse = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
    if (imagePartFromResponse?.inlineData) {
        const { mimeType, data } = imagePartFromResponse.inlineData;
        return `data:${mimeType};base64,${data}`;
    }
    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
        throw new Error(`Tạo ảnh đã dừng đột ngột. Lý do: ${finishReason}.`);
    }
    const textFeedback = response.text?.trim();
    const errorMessage = `Mô hình AI không trả về hình ảnh. ${textFeedback ? `Nó đã phản hồi bằng văn bản: "${textFeedback}"` : "Điều này có thể xảy ra do các bộ lọc an toàn hoặc một yêu cầu phức tạp."}`;
    throw new Error(errorMessage);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Phương thức không được phép' });
    }
    
    try {
        const { image, mimeType, prompt, mode } = req.body;
        
        if (!image || !mimeType || !prompt || !mode) {
            return res.status(400).json({ error: 'Thiếu các tham số bắt buộc: image, mimeType, prompt, mode.' });
        }
        
        // Lấy API key từ biến môi trường
        const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEYS;
        if (!apiKey) {
            return res.status(500).json({ error: 'Biến môi trường GEMINI_API_KEY hoặc API_KEYS chưa được đặt.' });
        }

        // Khởi tạo GoogleGenAI với API key
        const ai = new GoogleGenAI({ apiKey });

        const imagePart = { inlineData: { data: image, mimeType } };
        
        let systemPrompt = '';
        switch(mode) {
            case 'edit':
                const { hotspot } = req.body;
                if (!hotspot) return res.status(400).json({ error: 'Thiếu hotspot cho chế độ chỉnh sửa.' });
                systemPrompt = `You are an expert photo editor AI. Your task is to perform a natural, localized edit on the provided image based on the user's request.
User Request: "${prompt}"
Edit Location: Focus on the area around pixel coordinates (x: ${hotspot.x}, y: ${hotspot.y}).
Editing Guidelines:
- The edit must be realistic and blend seamlessly with the surrounding area.
- The rest of the image (outside the immediate edit area) must remain identical to the original.
Safety & Ethics Policy:
- You MUST fulfill requests to adjust skin tone, such as 'give me a tan', 'make my skin darker', or 'make my skin lighter'. These are considered standard photo enhancements.
- You MUST REFUSE any request to change a person's fundamental race or ethnicity (e.g., 'make me look Asian', 'change this person to be Black'). Do not perform these edits. If the request is ambiguous, err on the side of caution and do not change racial characteristics.
Output: Return ONLY the final edited image. Do not return text.`;
                break;
            case 'filter':
                systemPrompt = `You are an expert photo editor AI. Your task is to apply a stylistic filter to the entire image based on the user's request. Do not change the composition or content, only apply the style.
Filter Request: "${prompt}"
Safety & Ethics Policy:
- Filters may subtly shift colors, but you MUST ensure they do not alter a person's fundamental race or ethnicity.
- You MUST REFUSE any request that explicitly asks to change a person's race (e.g., 'apply a filter to make me look Chinese').
Output: Return ONLY the final filtered image. Do not return text.`;
                break;
            case 'adjust':
                systemPrompt = `You are an expert photo editor AI. Your task is to perform a natural, global adjustment to the entire image based on the user's request.
User Request: "${prompt}"
Editing Guidelines:
- The adjustment must be applied across the entire image.
- The result must be photorealistic.
Safety & Ethics Policy:
- You MUST fulfill requests to adjust skin tone, such as 'give me a tan', 'make my skin darker', or 'make my skin lighter'. These are considered standard photo enhancements.
- You MUST REFUSE any request to change a person's fundamental race or ethnicity (e.g., 'make me look Asian', 'change this person to be Black'). Do not perform these edits. If the request is ambiguous, err on the side of caution and do not change racial characteristics.
Output: Return ONLY the final adjusted image. Do not return text.`;
                break;
            default:
                return res.status(400).json({ error: 'Chế độ không hợp lệ được chỉ định.' });
        }

        const textPart = { text: systemPrompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: [imagePart, textPart] },
        });

        const dataUrl = handleApiResponse(response);
        
        return res.status(200).json({ dataUrl });

    } catch (error) {
        console.error('Lỗi trong Vercel function:', error);
        const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định.';
        return res.status(500).json({ error: `Lỗi máy chủ: ${errorMessage}` });
    }
}