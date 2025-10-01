interface LotteryApiResponse {
  returnValue: string;
  drwNoDate: string;
  totSellamnt: number;
  firstWinamnt: number;
  drwtNo1: number;
  drwtNo2: number;
  drwtNo3: number;
  drwtNo4: number;
  drwtNo5: number;
  drwtNo6: number;
  bnusNo: number;
  drwNo: number;
}

export interface LotteryNumber {
  round: number;
  date: string;
  numbers: number[];
  bonus: number;
}

// 최신 회차 번호를 추정하는 함수
function getCurrentEstimatedRound(): number {
  // 로또는 2002년 12월 7일부터 시작 (1회차)
  // 매주 토요일 추첨
  const firstDrawDate = new Date('2002-12-07');
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - firstDrawDate.getTime()) / (1000 * 60 * 60 * 24));
  const weeksDiff = Math.floor(daysDiff / 7);
  return weeksDiff + 1;
}

async function fetchLotteryNumber(round: number): Promise<LotteryNumber | null> {
  try {
    const response = await fetch(
      `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Referer': 'https://dhlottery.co.kr/',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LotteryApiResponse = await response.json();

    // API 응답이 성공적인지 확인
    if (data.returnValue !== 'success') {
      return null;
    }

    return {
      round: data.drwNo,
      date: formatDate(data.drwNoDate),
      numbers: [
        data.drwtNo1,
        data.drwtNo2,
        data.drwtNo3,
        data.drwtNo4,
        data.drwtNo5,
        data.drwtNo6,
      ].sort((a, b) => a - b),
      bonus: data.bnusNo,
    };
  } catch (error) {
    console.error(`Failed to fetch lottery number for round ${round}:`, error);
    return null;
  }
}

function formatDate(dateStr: string): string {
  // YYYY-MM-DD 형식을 YYYY.MM.DD 형식으로 변환
  return dateStr.replace(/-/g, '.');
}

export async function getRecentLotteryNumbers() {
  try {
    const estimatedCurrentRound = getCurrentEstimatedRound();
    const results: LotteryNumber[] = [];

    // 최대 10회까지 역순으로 시도해서 최근 5개 당첨번호 찾기
    let foundCount = 0;
    for (let i = 0; i < 10 && foundCount < 5; i++) {
      const round = estimatedCurrentRound - i;
      const lotteryData = await fetchLotteryNumber(round);

      if (lotteryData) {
        results.push(lotteryData);
        foundCount++;
      }
    }

    // 데이터를 찾지 못한 경우 fallback 데이터 사용
    if (results.length === 0) {
      return {
        success: false,
        data: [],
        message: 'API 데이터를 가져올 수 없어 fallback 데이터를 사용합니다.',
        fallback: [
          { round: 1154, date: '2024.03.23', numbers: [1, 5, 11, 16, 20, 27], bonus: 31 },
          { round: 1153, date: '2024.03.16', numbers: [2, 6, 12, 15, 30, 44], bonus: 9 },
          { round: 1152, date: '2024.03.09', numbers: [3, 8, 13, 19, 28, 42], bonus: 25 },
          { round: 1151, date: '2024.03.02', numbers: [7, 11, 17, 22, 35, 40], bonus: 14 },
          { round: 1150, date: '2024.02.24', numbers: [4, 9, 18, 24, 32, 45], bonus: 21 },
        ],
      };
    }

    return {
      success: true,
      data: results,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Lottery API error:', error);

    // 에러 발생 시 fallback 데이터 반환
    return {
      success: false,
      data: [],
      message: '서버 오류로 인해 fallback 데이터를 사용합니다.',
      fallback: [
        { round: 1154, date: '2024.03.23', numbers: [1, 5, 11, 16, 20, 27], bonus: 31 },
        { round: 1153, date: '2024.03.16', numbers: [2, 6, 12, 15, 30, 44], bonus: 9 },
        { round: 1152, date: '2024.03.09', numbers: [3, 8, 13, 19, 28, 42], bonus: 25 },
        { round: 1151, date: '2024.03.02', numbers: [7, 11, 17, 22, 35, 40], bonus: 14 },
        { round: 1150, date: '2024.02.24', numbers: [4, 9, 18, 24, 32, 45], bonus: 21 },
      ],
    };
  }
}