/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// Helper to convert File to a base64 string
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // result is "data:mime/type;base64,the-base64-string"
            // we only want "the-base64-string"
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};

const callEditApi = async (payload: object): Promise<string> => {
    const response = await fetch('/api/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
        // Use the error message from the backend, or provide a default
        const message = result.error || `Yêu cầu thất bại với mã trạng thái ${response.status}`;
        throw new Error(message);
    }

    if (!result.dataUrl) {
        throw new Error("Phản hồi của API không chứa URL dữ liệu hình ảnh.");
    }

    return result.dataUrl;
};


/**
 * Generates an edited image using generative AI based on a text prompt and a specific point.
 * @param originalImage The original image file.
 * @param userPrompt The text prompt describing the desired edit.
 * @param hotspot The {x, y} coordinates on the image to focus the edit.
 * @returns A promise that resolves to the data URL of the edited image.
 */
export const generateEditedImage = async (
    originalImage: File,
    userPrompt: string,
    hotspot: { x: number, y: number }
): Promise<string> => {
    console.log('Đang gửi yêu cầu chỉnh sửa đến proxy API tại:', hotspot);
    const imageBase64 = await fileToBase64(originalImage);
    
    return callEditApi({
        image: imageBase64,
        mimeType: originalImage.type,
        prompt: userPrompt,
        hotspot,
        mode: 'edit'
    });
};

/**
 * Generates an image with a filter applied using generative AI.
 * @param originalImage The original image file.
 * @param filterPrompt The text prompt describing the desired filter.
 * @returns A promise that resolves to the data URL of the filtered image.
 */
export const generateFilteredImage = async (
    originalImage: File,
    filterPrompt: string,
): Promise<string> => {
    console.log(`Đang gửi yêu cầu bộ lọc đến proxy API: ${filterPrompt}`);
    const imageBase64 = await fileToBase64(originalImage);

    return callEditApi({
        image: imageBase64,
        mimeType: originalImage.type,
        prompt: filterPrompt,
        mode: 'filter'
    });
};

/**
 * Generates an image with a global adjustment applied using generative AI.
 * @param originalImage The original image file.
 * @param adjustmentPrompt The text prompt describing the desired adjustment.
 * @returns A promise that resolves to the data URL of the adjusted image.
 */
export const generateAdjustedImage = async (
    originalImage: File,
    adjustmentPrompt: string,
): Promise<string> => {
    console.log(`Đang gửi yêu cầu tùy chỉnh đến proxy API: ${adjustmentPrompt}`);
    const imageBase64 = await fileToBase64(originalImage);

    return callEditApi({
        image: imageBase64,
        mimeType: originalImage.type,
        prompt: adjustmentPrompt,
        mode: 'adjust'
    });
};