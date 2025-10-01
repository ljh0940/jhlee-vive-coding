import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LottoGenerator,
  WinningNumbers,
  Card,
  LottoNumberSet
} from "@/components";
import { getRecentLotteryNumbers } from "@/services/lotteryService";

export default function LottoPage() {
  const [history, setHistory] = useState<Array<{numbers: number[], bonus: number, timestamp: Date}>>([]);
  const [isLoadingWinning, setIsLoadingWinning] = useState(false);
  const [winningDataSource, setWinningDataSource] = useState<'api' | 'sample'>('sample');
  const [recentWinningNumbers, setRecentWinningNumbers] = useState([
    { round: 1096, numbers: [8, 21, 24, 31, 35, 43], bonus: 25, date: '2023-12-16' },
    { round: 1095, numbers: [1, 9, 16, 24, 32, 37], bonus: 43, date: '2023-12-09' },
    { round: 1094, numbers: [7, 19, 25, 30, 39, 44], bonus: 14, date: '2023-12-02' },
    { round: 1093, numbers: [3, 12, 18, 26, 33, 41], bonus: 22, date: '2023-11-25' },
    { round: 1092, numbers: [5, 15, 20, 28, 36, 42], bonus: 17, date: '2023-11-18' }
  ]);

  const handleNumbersGenerated = (numbers: number[], bonus: number) => {
    setHistory(prev => [{
      numbers,
      bonus,
      timestamp: new Date()
    }, ...prev.slice(0, 4)]);
  };

  const fetchWinningNumbers = async () => {
    setIsLoadingWinning(true);
    try {
      const result = await getRecentLotteryNumbers();

      if (result.success && result.data.length > 0) {
        setRecentWinningNumbers(result.data);
        setWinningDataSource('api');
      } else if (result.fallback) {
        setRecentWinningNumbers(result.fallback);
        setWinningDataSource('sample');
      }
    } catch (error) {
      console.error('Failed to fetch winning numbers:', error);
      setWinningDataSource('sample');
    } finally {
      setIsLoadingWinning(false);
    }
  };

  useEffect(() => {
    fetchWinningNumbers();
  }, []);

  const getNumberColor = (num: number) => {
    if (num <= 10) return 'bg-yellow-500';
    if (num <= 20) return 'bg-blue-500';
    if (num <= 30) return 'bg-red-500';
    if (num <= 40) return 'bg-gray-600';
    return 'bg-green-500';
  };

  return (
    <div className="page-background">
      <div className="content-max-width-lg mx-auto py-12 px-4">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">🎰 로또 번호 생성기</h1>
          <p className="text-lg text-gray-600">행운의 번호를 생성해보세요!</p>
        </div>

        {/* 로또 생성기 */}
        <LottoGenerator onNumbersGenerated={handleNumbersGenerated} />

        {/* 최근 당첨번호 */}
        <WinningNumbers />

        {/* 생성 히스토리 */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
              <span className="mr-3">🏆</span>
              최근 5회 당첨번호
            </h3>
            <div className="flex items-center space-x-2">
              {isLoadingWinning ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">로딩 중...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${winningDataSource === 'api' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-xs text-gray-500">
                    {winningDataSource === 'api' ? '실시간' : '샘플'}
                  </span>
                  <button
                    onClick={fetchWinningNumbers}
                    className="text-xs text-indigo-600 hover:text-indigo-800 ml-2"
                  >
                    새로고침
                  </button>
                </div>
              )}
            </div>
          </div>

          {isLoadingWinning ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="card-glass p-4 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="flex space-x-2 ml-auto">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="w-10 h-10 bg-gray-300 rounded-xl"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentWinningNumbers.map((winning) => (
              <div key={winning.round} className="card-glass p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-indigo-600">
                        {winning.round}회
                      </span>
                      <span className="text-sm text-gray-600 font-medium">
                        {winning.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 justify-center lg:justify-end">
                    {winning.numbers.map((num, numIndex) => (
                      <div
                        key={numIndex}
                        className={`w-10 h-10 ${getNumberColor(num)} text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-md`}
                      >
                        {num}
                      </div>
                    ))}
                    <div className="mx-2 text-gray-400">+</div>
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl flex items-center justify-center text-sm font-bold border-2 border-yellow-300 shadow-md">
                      {winning.bonus}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        {history.length > 0 && (
          <Card className="p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">내가 생성한 번호</h3>
            <div className="space-y-4">
              {history.map((item, index) => (
                <Card key={index} variant="glass" className="p-4">
                  <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <span className="text-sm text-gray-600 font-medium">
                      {item.timestamp.toLocaleTimeString('ko-KR')}
                    </span>
                    <LottoNumberSet
                      numbers={item.numbers}
                      bonusNumber={item.bonus}
                      size="small"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* 하단 네비게이션 */}
        <div className="text-center mt-12">
          <Link to="/" className="navigation-link text-lg">
            ← 홈으로 돌아가기
          </Link>
        </div>

        {/* 로또 정보 */}
        <Card className="p-6 mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-3">🎯</span>
            로또 6/45 정보
          </h3>
          <div className="grid gap-3 text-gray-700">
            <div className="flex items-start space-x-3">
              <span className="text-indigo-500 font-bold">•</span>
              <p>1부터 45까지의 숫자 중 6개를 선택합니다</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-indigo-500 font-bold">•</span>
              <p>보너스 번호는 2등 당첨 시 사용됩니다</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-indigo-500 font-bold">•</span>
              <p>숫자 색상: <span className="font-semibold">노랑(1-10), 파랑(11-20), 빨강(21-30), 회색(31-40), 초록(41-45)</span></p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-indigo-500 font-bold">•</span>
              <p>이 생성기는 재미를 위한 것이며, 당첨을 보장하지 않습니다</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}