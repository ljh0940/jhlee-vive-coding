export interface ComparisonResult {
  matchCount: number;        // 맞춘 개수 (0-6)
  bonusMatch: boolean;        // 보너스 번호 일치 여부
  rank: number | null;        // 등수 (1-5, null=낙첨)
  matchedNumbers: number[];   // 맞춘 번호들
  prize: string;              // 등수 이름 (1등, 2등, ...)
  color: string;              // 표시 색상
  icon: string;               // 아이콘
}

/**
 * 로또 번호 비교 함수
 */
export function compareNumbers(
  myNumbers: number[],
  myBonus: number,
  winningNumbers: number[],
  winningBonus: number
): ComparisonResult {
  // 맞춘 번호 찾기
  const matchedNumbers = myNumbers.filter(num => winningNumbers.includes(num));
  const matchCount = matchedNumbers.length;

  // 보너스 번호 확인 (메인 번호 6개에는 없고, 보너스 번호만 일치)
  const bonusMatch = !winningNumbers.includes(myBonus) && myBonus === winningBonus;

  // 등수 계산
  const rank = calculateRank(matchCount, bonusMatch);

  // 등수 정보
  const rankInfo = getRankInfo(rank);

  return {
    matchCount,
    bonusMatch,
    rank,
    matchedNumbers: matchedNumbers.sort((a, b) => a - b),
    prize: rankInfo.prize,
    color: rankInfo.color,
    icon: rankInfo.icon,
  };
}

/**
 * 등수 계산
 * 1등: 6개 일치
 * 2등: 5개 + 보너스
 * 3등: 5개
 * 4등: 4개
 * 5등: 3개
 * 낙첨: 2개 이하
 */
function calculateRank(matchCount: number, bonusMatch: boolean): number | null {
  if (matchCount === 6) return 1;
  if (matchCount === 5 && bonusMatch) return 2;
  if (matchCount === 5) return 3;
  if (matchCount === 4) return 4;
  if (matchCount === 3) return 5;
  return null; // 낙첨
}

/**
 * 등수별 정보 반환
 */
function getRankInfo(rank: number | null): { prize: string; color: string; icon: string } {
  switch (rank) {
    case 1:
      return {
        prize: '1등 🎉',
        color: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
        icon: '👑'
      };
    case 2:
      return {
        prize: '2등 🎊',
        color: 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900',
        icon: '🥈'
      };
    case 3:
      return {
        prize: '3등 🎁',
        color: 'bg-gradient-to-r from-orange-400 to-orange-600 text-white',
        icon: '🥉'
      };
    case 4:
      return {
        prize: '4등',
        color: 'bg-blue-500 text-white',
        icon: '🎯'
      };
    case 5:
      return {
        prize: '5등',
        color: 'bg-green-500 text-white',
        icon: '✨'
      };
    default:
      return {
        prize: '낙첨',
        color: 'bg-gray-400 text-white',
        icon: '😢'
      };
  }
}

/**
 * 여러 당첨번호와 비교 (최고 등수 반환)
 */
export function compareWithMultipleDraws(
  myNumbers: number[],
  myBonus: number,
  winningDraws: Array<{ numbers: number[]; bonus: number; round: number; date: string }>
): ComparisonResult & { bestRound?: number; bestDate?: string } {
  let bestResult: ComparisonResult | null = null;
  let bestRound: number | undefined;
  let bestDate: string | undefined;

  for (const draw of winningDraws) {
    const result = compareNumbers(myNumbers, myBonus, draw.numbers, draw.bonus);

    // 더 좋은 등수가 나왔거나, 첫 비교인 경우
    if (!bestResult || (result.rank !== null && (bestResult.rank === null || result.rank < bestResult.rank))) {
      bestResult = result;
      bestRound = draw.round;
      bestDate = draw.date;
    }
  }

  return {
    ...bestResult!,
    bestRound,
    bestDate,
  };
}
