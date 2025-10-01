import { useEffect, useState } from 'react';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { LottoNumberSet } from '@/components/molecules/LottoNumberSet';

interface WinningNumber {
  round: number;
  date: string;
  numbers: number[];
  bonus: number;
}

interface LotteryApiResponse {
  success: boolean;
  data: WinningNumber[];
  message?: string;
  fallback?: WinningNumber[];
  lastUpdated?: string;
}

export const WinningNumbers = () => {
  const [winningNumbers, setWinningNumbers] = useState<WinningNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'api' | 'fallback'>('fallback');

  const fetchWinningNumbers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/lottery');
      const data: LotteryApiResponse = await response.json();

      if (data.success && data.data.length > 0) {
        setWinningNumbers(data.data);
        setDataSource('api');
      } else {
        setWinningNumbers(data.fallback || []);
        setDataSource('fallback');
      }
    } catch (error) {
      console.error('Failed to fetch winning numbers:', error);
      setWinningNumbers([
        { round: 1154, date: '2024.03.23', numbers: [1, 5, 11, 16, 20, 27], bonus: 31 },
        { round: 1153, date: '2024.03.16', numbers: [2, 6, 12, 15, 30, 44], bonus: 9 },
        { round: 1152, date: '2024.03.09', numbers: [3, 8, 13, 19, 28, 42], bonus: 25 },
        { round: 1151, date: '2024.03.02', numbers: [7, 11, 17, 22, 35, 40], bonus: 14 },
        { round: 1150, date: '2024.02.24', numbers: [4, 9, 18, 24, 32, 45], bonus: 21 },
      ]);
      setDataSource('fallback');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWinningNumbers();
  }, []);

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
          <span className="mr-3">🏆</span>
          최근 5회 당첨번호
        </h3>
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">로딩 중...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${dataSource === 'api' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-xs text-gray-500">
                {dataSource === 'api' ? '실시간' : '샘플'}
              </span>
              <Button
                size="small"
                variant="outline"
                onClick={fetchWinningNumbers}
                className="text-xs ml-2"
              >
                새로고침
              </Button>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Card key={index} variant="glass" className="p-4 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="flex space-x-2 ml-auto">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="w-10 h-10 bg-gray-300 rounded-xl"></div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {winningNumbers.map((winning) => (
            <Card key={winning.round} variant="glass" className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-indigo-600">
                    {winning.round}회
                  </span>
                  <span className="text-sm text-gray-600 font-medium">
                    {winning.date}
                  </span>
                </div>
                <LottoNumberSet
                  numbers={winning.numbers}
                  bonusNumber={winning.bonus}
                  size="small"
                  className="justify-center lg:justify-end"
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};