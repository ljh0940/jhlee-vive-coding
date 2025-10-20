const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  picture?: string;
  role: string;
  provider: string;
  lastLoginAt?: string;
}

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const userService = {
  // 프로필 조회
  async getProfile(): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('프로필 조회에 실패했습니다');
    }

    return response.json();
  },

  // 프로필 업데이트
  async updateProfile(name?: string, picture?: string): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ name, picture }),
    });

    if (!response.ok) {
      throw new Error('프로필 업데이트에 실패했습니다');
    }

    return response.json();
  },

  // 계정 삭제 (비활성화)
  async deleteAccount(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/user/account`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('계정 삭제에 실패했습니다');
    }
  },
};
