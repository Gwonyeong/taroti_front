const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';

// ========== 배너 관련 API ==========

// 배너 목록 조회
export const getBanners = async (activeOnly = false) => {
  try {
    const url = `${API_BASE_URL}/api/banners${activeOnly ? '?active=true' : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};

// 배너 생성
export const createBanner = async (bannerData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/banners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bannerData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
};

// 배너 업데이트
export const updateBanner = async (id, bannerData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/banners/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bannerData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
};

// 배너 삭제
export const deleteBanner = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/banners/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting banner:', error);
    throw error;
  }
};

// 배너 순서 업데이트
export const updateBannerOrder = async (bannerUpdates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/banners/reorder`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updates: bannerUpdates }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error updating banner order:', error);
    throw error;
  }
};

// ========== 콘텐츠 관련 API ==========

// 콘텐츠 목록 조회
export const getContents = async (activeOnly = false) => {
  try {
    const url = `${API_BASE_URL}/api/contents${activeOnly ? '?active=true' : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching contents:', error);
    throw error;
  }
};

// 콘텐츠 생성
export const createContent = async (contentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contentData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating content:', error);
    throw error;
  }
};

// 콘텐츠 업데이트
export const updateContent = async (id, contentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contentData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
};

// 콘텐츠 삭제
export const deleteContent = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contents/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
};

// 콘텐츠 순서 업데이트
export const updateContentOrder = async (contentUpdates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contents/reorder`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updates: contentUpdates }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error updating content order:', error);
    throw error;
  }
};