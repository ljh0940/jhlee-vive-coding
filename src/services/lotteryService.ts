export interface LotteryNumber {
  round: number;
  date: string;
  numbers: number[];
  bonus: number;
}

interface LotteryApiResponse {
  success: boolean;
  data: LotteryNumber[];
  message?: string;
  lastUpdated?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function getRecentLotteryNumbers(): Promise<LotteryApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lottery/recent`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LotteryApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch lottery numbers from backend:', error);

    // 백엔드 연결 실패 시 fallback 데이터 반환
    return {
      success: false,
      data: [
        { round: 1154, date: '2024.03.23', numbers: [1, 5, 11, 16, 20, 27], bonus: 31 },
        { round: 1153, date: '2024.03.16', numbers: [2, 6, 12, 15, 30, 44], bonus: 9 },
        { round: 1152, date: '2024.03.09', numbers: [3, 8, 13, 19, 28, 42], bonus: 25 },
        { round: 1151, date: '2024.03.02', numbers: [7, 11, 17, 22, 35, 40], bonus: 14 },
        { round: 1150, date: '2024.02.24', numbers: [4, 9, 18, 24, 32, 45], bonus: 21 },
      ],
      message: '백엔드 서버 연결 실패로 인해 fallback 데이터를 사용합니다.',
    };
  }
}