import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LottoGenerator,
  Card,
  LottoNumberSet
} from "@/components";
import { getRecentLotteryNumbers } from "@/services/lotteryService";

interface LottoHistoryItem {
  numbers: number[];
  bonus: number;
  timestamp: string;
}

const STORAGE_KEY = 'lotto_history';
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000; // 30일

export default function LottoPage() {
  const [history, setHistory] = useState<Array<{numbers: number[], bonus: number, timestamp: Date}>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingWinning, setIsLoadingWinning] = useState(false);
  const [winningDataSource, setWinningDataSource] = useState<'api' | 'sample'>('sample');
  const [recentWinningNumbers, setRecentWinningNumbers] = useState([
    { round: 1096, numbers: [8, 21, 24, 31, 35, 43], bonus: 25, date: '2023-12-16' },
    { round: 1095, numbers: [1, 9, 16, 24, 32, 37], bonus: 43, date: '2023-12-09' },
    { round: 1094, numbers: [7, 19, 25, 30, 39, 44], bonus: 14, date: '2023-12-02' },
    { round: 1093, numbers: [3, 12, 18, 26, 33, 41], bonus: 22, date: '2023-11-25' },
    { round: 1092, numbers: [5, 15, 20, 28, 36, 42], bonus: 17, date: '2023-11-18' }
  ]);

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentHistory = history.slice(startIndex, endIndex);

  // localStorage에서 히스토리 로드 및 오래된 항목 필터링
  const loadHistoryFromStorage = (): LottoHistoryItem[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const items: LottoHistoryItem[] = JSON.parse(stored);
      const now = Date.now();

      // 한 달 이내의 항목만 필터링
      return items.filter(item => {
        const itemDate = new Date(item.timestamp).getTime();
        return now - itemDate < ONE_MONTH_MS;
      });
    } catch (error) {
      console.error('Failed to load history:', error);
      return [];
    }
  };

  // localStorage에 히스토리 저장
  const saveHistoryToStorage = (items: LottoHistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  };

  // 컴포넌트 마운트 시 localStorage에서 히스토리 로드
  useEffect(() => {
    const storedHistory = loadHistoryFromStorage();
    const parsedHistory = storedHistory.map(item => ({
      numbers: item.numbers,
      bonus: item.bonus,
      timestamp: new Date(item.timestamp)
    }));
    setHistory(parsedHistory);

    // 필터링된 히스토리를 다시 저장 (오래된 항목 제거)
    if (storedHistory.length !== parsedHistory.length) {
      saveHistoryToStorage(storedHistory);
    }
  }, []);

  const handleNumbersGenerated = (numbers: number[], bonus: number) => {
    const newItem = {
      numbers,
      bonus,
      timestamp: new Date()
    };

    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    setCurrentPage(1); // 새 항목 추가 시 첫 페이지로 이동

    // localStorage에 저장
    const storageItems: LottoHistoryItem[] = updatedHistory.map(item => ({
      numbers: item.numbers,
      bonus: item.bonus,
      timestamp: item.timestamp.toISOString()
    }));
    saveHistoryToStorage(storageItems);
  };

  const handleDeleteItem = (index: number) => {
    const actualIndex = startIndex + index;
    const updatedHistory = history.filter((_, i) => i !== actualIndex);
    setHistory(updatedHistory);

    // 현재 페이지가 비어있으면 이전 페이지로 이동
    const newTotalPages = Math.ceil(updatedHistory.length / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }

    // localStorage에 저장
    const storageItems: LottoHistoryItem[] = updatedHistory.map(item => ({
      numbers: item.numbers,
      bonus: item.bonus,
      timestamp: item.timestamp.toISOString()
    }));
    saveHistoryToStorage(storageItems);
  };

  const handleDeleteAll = () => {
    if (window.confirm('모든 생성 기록을 삭제하시겠습니까?')) {
      setHistory([]);
      setCurrentPage(1);
      saveHistoryToStorage([]);
    }
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
      <div className="content-max-width-lg mx-auto py-6 px-4">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎰 로또 번호 생성기</h1>
          <p className="text-sm text-gray-600">행운의 번호를 생성해보세요!</p>
        </div>

        {/* 로또 생성기 */}
        <LottoGenerator onNumbersGenerated={handleNumbersGenerated} />

        {/* 최근 당첨번호 */}
        <div className="card p-3 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-800 flex items-center">
              <span className="mr-1.5">🏆</span>
              최근 5회
            </h3>
            <div className="flex items-center space-x-1.5">
              {isLoadingWinning ? (
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600">로딩중</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <div className={`w-2 h-2 rounded-full ${winningDataSource === 'api' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-xs text-gray-500">
                    {winningDataSource === 'api' ? '실시간' : '샘플'}
                  </span>
                  <button
                    onClick={fetchWinningNumbers}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    ↻
                  </button>
                </div>
              )}
            </div>
          </div>

          {isLoadingWinning ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="card-glass p-2 animate-pulse">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 bg-gray-300 rounded w-12"></div>
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                    <div className="flex space-x-1 ml-auto">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="w-7 h-7 bg-gray-300 rounded-lg"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1.5">
              {recentWinningNumbers.map((winning) => (
              <div key={winning.round} className="card-glass p-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1.5 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-indigo-600">
                      {winning.round}회
                    </span>
                    <span className="text-xs text-gray-500">
                      {winning.date}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 justify-center sm:justify-end">
                    {winning.numbers.map((num, numIndex) => (
                      <div
                        key={numIndex}
                        className={`w-7 h-7 ${getNumberColor(num)} text-white rounded-lg flex items-center justify-center text-xs font-bold`}
                      >
                        {num}
                      </div>
                    ))}
                    <div className="mx-0.5 text-gray-400 text-xs">+</div>
                    <div className="w-7 h-7 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg flex items-center justify-center text-xs font-bold border border-yellow-300">
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
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">내가 생성한 번호</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {history.length}개 (30일간 보관)
                </span>
                <button
                  onClick={handleDeleteAll}
                  className="text-xs text-red-600 hover:text-red-800 font-medium"
                >
                  전체삭제
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {currentHistory.map((item, index) => (
                <Card key={startIndex + index} variant="glass" className="p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 flex-1">
                      <span className="text-xs text-gray-600 font-medium min-w-[120px]">
                        {item.timestamp.toLocaleDateString('ko-KR', {
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <LottoNumberSet
                        numbers={item.numbers}
                        bonusNumber={item.bonus}
                        size="small"
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteItem(index)}
                      className="ml-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="삭제"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </Card>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            )}
          </Card>
        )}

        {/* 하단 네비게이션 */}
        <div className="text-center mt-6">
          <Link to="/" className="navigation-link text-sm">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}