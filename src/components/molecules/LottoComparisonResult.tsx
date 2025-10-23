import { ComparisonResult } from '@/utils/lottoComparison';

interface LottoComparisonResultProps {
  result: ComparisonResult;
  myNumbers: number[];
  myBonus: number;
  className?: string;
}

export function LottoComparisonResult({
  result,
  myNumbers,
  myBonus,
  className = ''
}: LottoComparisonResultProps) {
  const getNumberColor = (num: number) => {
    if (num <= 10) return 'bg-yellow-500';
    if (num <= 20) return 'bg-blue-500';
    if (num <= 30) return 'bg-red-500';
    if (num <= 40) return 'bg-gray-600';
    return 'bg-green-500';
  };

  const isMatched = (num: number) => result.matchedNumbers.includes(num);

  return (
    <div className={`${className}`}>
      {/* 등수 뱃지 */}
      <div className="flex items-center justify-between mb-2">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${result.color}`}>
          {result.icon} {result.prize}
        </span>
        <span className="text-xs text-gray-600">
          {result.matchCount}개 일치
          {result.bonusMatch && ' + 보너스'}
        </span>
      </div>

      {/* 번호 표시 */}
      <div className="flex items-center space-x-1">
        {myNumbers.map((num, index) => (
          <div
            key={index}
            className={`
              w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold
              ${isMatched(num)
                ? `${getNumberColor(num)} text-white ring-2 ring-yellow-400 ring-offset-1`
                : 'bg-gray-300 text-gray-600 opacity-50'
              }
            `}
          >
            {num}
          </div>
        ))}
        <div className="mx-0.5 text-gray-400 text-xs">+</div>
        <div
          className={`
            w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border
            ${result.bonusMatch
              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white ring-2 ring-yellow-400 ring-offset-1 border-yellow-300'
              : 'bg-gray-300 text-gray-600 opacity-50 border-gray-400'
            }
          `}
        >
          {myBonus}
        </div>
      </div>

      {/* 맞춘 번호 상세 */}
      {result.matchCount > 0 && (
        <div className="mt-2 text-xs text-gray-600">
          맞춘 번호: {result.matchedNumbers.join(', ')}
        </div>
      )}
    </div>
  );
}
