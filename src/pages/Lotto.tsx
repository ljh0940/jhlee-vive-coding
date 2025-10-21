import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LottoGenerator,
  Card,
  LottoNumberSet
} from "@/components";
import { getRecentLotteryNumbers } from "@/services/lotteryService";
import { lottoService, type LottoHistoryItem, type WeeklyRecommendation } from "@/services/lottoService";

export default function LottoPage() {
  const [history, setHistory] = useState<LottoHistoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoadingWinning, setIsLoadingWinning] = useState(false);
  const [winningDataSource, setWinningDataSource] = useState<'api' | 'sample'>('sample');
  const [recentWinningNumbers, setRecentWinningNumbers] = useState([
    { round: 1096, numbers: [8, 21, 24, 31, 35, 43], bonus: 25, date: '2023-12-16' },
    { round: 1095, numbers: [1, 9, 16, 24, 32, 37], bonus: 43, date: '2023-12-09' },
    { round: 1094, numbers: [7, 19, 25, 30, 39, 44], bonus: 14, date: '2023-12-02' },
    { round: 1093, numbers: [3, 12, 18, 26, 33, 41], bonus: 22, date: '2023-11-25' },
    { round: 1092, numbers: [5, 15, 20, 28, 36, 42], bonus: 17, date: '2023-11-18' }
  ]);
  const [weeklyRecommendations, setWeeklyRecommendations] = useState<WeeklyRecommendation | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  const ITEMS_PER_PAGE = 5;

  // 로또 이력 로드
  const loadHistory = async (page: number = 0) => {
    try {
      setLoading(true);
      const data = await lottoService.getLottoHistories(page, ITEMS_PER_PAGE);
      setHistory(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to load lotto history:', error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 이력 로드
  useEffect(() => {
    loadHistory();
  }, []);

  const handleNumbersGenerated = async (numbers: number[], bonus: number) => {
    try {
      await lottoService.saveLottoHistory({ numbers, bonusNumber: bonus });
      // 저장 후 첫 페이지로 이동하여 새로 저장된 항목 표시
      await loadHistory(0);
    } catch (error) {
      console.error('Failed to save lotto history:', error);
      alert('로또 번호 저장에 실패했습니다');
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await lottoService.deleteLottoHistory(id);
      // 현재 페이지가 비어있으면 이전 페이지로 이동
      const remainingItems = totalElements - 1;
      const newTotalPages = Math.ceil(remainingItems / ITEMS_PER_PAGE);
      const newPage = currentPage >= newTotalPages ? Math.max(0, newTotalPages - 1) : currentPage;
      await loadHistory(newPage);
    } catch (error) {
      console.error('Failed to delete lotto history:', error);
      alert('삭제에 실패했습니다');
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('모든 생성 기록을 삭제하시겠습니까?')) {
      try {
        await lottoService.deleteAllLottoHistories();
        await loadHistory(0);
      } catch (error) {
        console.error('Failed to delete all lotto histories:', error);
        alert('전체 삭제에 실패했습니다');
      }
    }
  };

  const fetchWinningNumbers = async () => {
    setIsLoadingWinning(true);
    try {
      const result = await getRecentLotteryNumbers();

      if (result.success && result.data.length > 0) {
        setRecentWinningNumbers(result.data);
        setWinningDataSource('api');
      } else {
        setRecentWinningNumbers(result.data);
        setWinningDataSource('sample');
      }
    } catch (error) {
      console.error('Failed to fetch winning numbers:', error);
      setWinningDataSource('sample');
    } finally {
      setIsLoadingWinning(false);
    }
  };

  const fetchWeeklyRecommendations = async () => {
    setIsLoadingRecommendations(true);
    try {
      const data = await lottoService.getWeeklyRecommendations();
      setWeeklyRecommendations(data);
    } catch (error) {
      console.error('Failed to fetch weekly recommendations:', error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    fetchWinningNumbers();
    fetchWeeklyRecommendations();
  }, []);

  const getNumberColor = (num: number) => {
    if (num <= 10) return 'bg-yellow-500';
    if (num <= 20) return 'bg-blue-500';
    if (num <= 30) return 'bg-red-500';
    if (num <= 40) return 'bg-gray-600';
    return 'bg-green-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

        {/* 이번 주 추천 번호 */}
        <div className="card p-3 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-800 flex items-center">
              <span className="mr-1.5">✨</span>
              이번 주 추천 번호
            </h3>
            <div className="flex items-center space-x-1.5">
              {isLoadingRecommendations ? (
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600">로딩중</span>
                </div>
              ) : weeklyRecommendations && (
                <button
                  onClick={fetchWeeklyRecommendations}
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                  title="새로고침"
                >
                  ↻
                </button>
              )}
            </div>
          </div>

          {isLoadingRecommendations ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="card-glass p-2 animate-pulse">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 bg-gray-300 rounded w-6"></div>
                    <div className="flex space-x-1 ml-auto">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="w-7 h-7 bg-gray-300 rounded-lg"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : weeklyRecommendations ? (
            <>
              <p className="text-xs text-gray-500 mb-2">
                역대 당첨번호와 겹치지 않는 번호입니다 ({weeklyRecommendations.weekKey})
              </p>
              <div className="space-y-1.5">
                {weeklyRecommendations.recommendations.map((rec, index) => (
                  <div key={index} className="card-glass p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 min-w-[20px]">
                        #{index + 1}
                      </span>
                      <div className="flex items-center space-x-1">
                        {rec.numbers.map((num, numIndex) => (
                          <div
                            key={numIndex}
                            className={`w-7 h-7 ${getNumberColor(num)} text-white rounded-lg flex items-center justify-center text-xs font-bold`}
                          >
                            {num}
                          </div>
                        ))}
                        <div className="mx-0.5 text-gray-400 text-xs">+</div>
                        <div className="w-7 h-7 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg flex items-center justify-center text-xs font-bold border border-yellow-300">
                          {rec.bonusNumber}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">추천 번호를 불러올 수 없습니다</p>
            </div>
          )}
        </div>

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

        {/* 생성 이력 */}
        {loading ? (
          <Card className="p-4">
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-sm text-gray-600">불러오는 중...</p>
            </div>
          </Card>
        ) : totalElements > 0 ? (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">내가 생성한 번호</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  총 {totalElements}개
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
              {history.map((item) => (
                <Card key={item.id} variant="glass" className="p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 flex-1">
                      <span className="text-xs text-gray-600 font-medium min-w-[120px]">
                        {formatDate(item.createdAt)}
                      </span>
                      <LottoNumberSet
                        numbers={item.numbers}
                        bonusNumber={item.bonusNumber}
                        size="small"
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
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
                  onClick={() => loadHistory(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i).map(page => (
                    <button
                      key={page}
                      onClick={() => loadHistory(page)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => loadHistory(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            )}
          </Card>
        ) : null}

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
