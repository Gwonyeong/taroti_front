// API Base URL for backend communication

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';



// 배너 이미지 업로드 (백엔드 API 사용)
export const uploadBannerImage = async (file, type = 'pc') => {
  try {
    console.log('Uploading banner image:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      type: type,
      url: `${API_BASE_URL}/api/upload/banner`
    });

    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    const response = await fetch(`${API_BASE_URL}/api/upload/banner`, {
      method: 'POST',
      body: formData,
    });

    console.log('Upload response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Upload error response:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Upload success:', result);
    return result;
  } catch (error) {
    console.error('Error uploading banner image:', error);
    throw error;
  }
};

// 콘텐츠 이미지 업로드 (백엔드 API 사용)
export const uploadContentImage = async (file) => {
  try {
    console.log('Uploading content image:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      url: `${API_BASE_URL}/api/upload/content`
    });

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/api/upload/content`, {
      method: 'POST',
      body: formData,
    });

    console.log('Upload response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Upload error response:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Upload success:', result);
    return result;
  } catch (error) {
    console.error('Error uploading content image:', error);
    throw error;
  }
};

// 파일 삭제 (백엔드 API 사용)
export const deleteFile = async (imageUrl) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/delete-file`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};