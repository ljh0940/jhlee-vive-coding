const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface LottoNumbers {
  numbers: number[];
  bonusNumber: number;
}

export interface LottoHistoryItem extends LottoNumbers {
  id: number;
  createdAt: string;
}

export interface LottoHistoryPage {
  content: LottoHistoryItem[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface RecommendationSet {
  numbers: number[];
  bonusNumber: number;
}

export interface WeeklyRecommendation {
  id: string;
  weekKey: string;
  generatedAt: string;
  recommendations: RecommendationSet[];
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

export const lottoService = {
  // 로또 이력 저장
  async saveLottoHistory(data: LottoNumbers): Promise<LottoHistoryItem> {
    const response = await fetch(`${API_BASE_URL}/api/lotto/history`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('로또 이력 저장에 실패했습니다');
    }

    return response.json();
  },

  // 로또 이력 조회 (페이지네이션)
  async getLottoHistories(page: number = 0, size: number = 5): Promise<LottoHistoryPage> {
    const response = await fetch(
      `${API_BASE_URL}/api/lotto/history?page=${page}&size=${size}`,
      {
        headers: getAuthHeader(),
      }
    );

    if (!response.ok) {
      throw new Error('로또 이력 조회에 실패했습니다');
    }

    return response.json();
  },

  // 모든 로또 이력 조회
  async getAllLottoHistories(): Promise<LottoHistoryItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/lotto/history/all`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('로또 이력 조회에 실패했습니다');
    }

    return response.json();
  },

  // 로또 이력 삭제
  async deleteLottoHistory(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/lotto/history/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('로또 이력 삭제에 실패했습니다');
    }
  },

  // 모든 로또 이력 삭제
  async deleteAllLottoHistories(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/lotto/history`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('로또 이력 전체 삭제에 실패했습니다');
    }
  },

  // 로또 이력 개수 조회
  async countLottoHistories(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/api/lotto/history/count`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('로또 이력 개수 조회에 실패했습니다');
    }

    return response.json();
  },

  // 이번 주 추천 로또 번호 조회
  async getWeeklyRecommendations(): Promise<WeeklyRecommendation> {
    const response = await fetch(`${API_BASE_URL}/api/lottery/weekly-recommendations`);

    if (!response.ok) {
      throw new Error('주간 추천 번호 조회에 실패했습니다');
    }

    return response.json();
  },
};
