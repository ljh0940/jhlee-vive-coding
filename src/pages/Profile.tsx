import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { userService } from '@/services/userService';
import { lottoService, type LottoHistoryItem } from '@/services/lottoService';
import { LottoNumberSet, LottoComparisonResult } from '@/components';
import { getRecentLotteryNumbers, type LotteryNumber } from '@/services/lotteryService';
import { compareWithMultipleDraws, type ComparisonResult } from '@/utils/lottoComparison';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [picture, setPicture] = useState(user?.picture || '');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<LottoHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [winningNumbers, setWinningNumbers] = useState<LotteryNumber[]>([]);
  const [comparisonResults, setComparisonResults] = useState<Map<number, ComparisonResult & { bestRound?: number; bestDate?: string }>>(new Map());
  const [showingComparison, setShowingComparison] = useState<Set<number>>(new Set());

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPicture(user.picture || '');
    }
  }, [user]);

  useEffect(() => {
    loadHistory();
    loadWinningNumbers();
  }, []);

  const loadWinningNumbers = async () => {
    try {
      const result = await getRecentLotteryNumbers();
      if (result.success && result.data.length > 0) {
        setWinningNumbers(result.data);
      }
    } catch (error) {
      console.error('Failed to load winning numbers:', error);
    }
  };

  const handleCheckWinning = (item: LottoHistoryItem) => {
    if (winningNumbers.length === 0) {
      alert('당첨번호를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const result = compareWithMultipleDraws(
      item.numbers,
      item.bonusNumber,
      winningNumbers
    );

    setComparisonResults(new Map(comparisonResults.set(item.id, result)));
    setShowingComparison(new Set(showingComparison.add(item.id)));
  };

  const toggleComparison = (id: number) => {
    const newSet = new Set(showingComparison);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setShowingComparison(newSet);
  };

  const loadHistory = async (page: number = 0) => {
    try {
      setHistoryLoading(true);
      const data = await lottoService.getLottoHistories(page, ITEMS_PER_PAGE);
      setHistory(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to load lotto history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      alert('이름을 입력해주세요');
      return;
    }

    try {
      setLoading(true);
      await userService.updateProfile(name.trim(), picture.trim() || undefined);
      alert('프로필이 업데이트되었습니다');
      setIsEditing(false);
      window.location.reload(); // AuthContext 갱신
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('프로필 업데이트에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('정말 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      setLoading(true);
      await userService.deleteAccount();
      alert('계정이 삭제되었습니다');
      logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('계정 삭제에 실패했습니다');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">내 프로필</h1>
          <Link to="/">
            <Button variant="outline">홈으로</Button>
          </Link>
        </div>

        {/* 프로필 정보 */}
        <Card className="p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="이름"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">프로필 사진 URL</label>
                    <input
                      type="text"
                      value={picture}
                      onChange={(e) => setPicture(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/profile.jpg"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleUpdateProfile} disabled={loading}>
                      {loading ? '저장 중...' : '저장'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setName(user?.name || '');
                        setPicture(user?.picture || '');
                      }}
                      disabled={loading}
                    >
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      수정
                    </button>
                  </div>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 mt-4">
            <Button
              variant="outline"
              onClick={handleDeleteAccount}
              disabled={loading}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              계정 삭제
            </Button>
          </div>
        </Card>

        {/* 로또 생성 이력 */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">로또 생성 이력</h2>
            <span className="text-sm text-gray-600">총 {totalElements}개</span>
          </div>

          {historyLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">불러오는 중...</p>
            </div>
          ) : totalElements === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">아직 생성한 로또 번호가 없습니다</p>
              <Link to="/lotto">
                <Button className="mt-4">로또 번호 생성하기</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {history.map((item) => {
                  const result = comparisonResults.get(item.id);
                  const isShowing = showingComparison.has(item.id);

                  return (
                    <div key={item.id} className="card-glass p-3">
                      <div className="flex flex-col space-y-2">
                        {/* 기본 정보 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <span className="text-xs text-gray-600 font-medium min-w-[140px]">
                              {formatDate(item.createdAt)}
                            </span>
                            {!isShowing && (
                              <LottoNumberSet
                                numbers={item.numbers}
                                bonusNumber={item.bonusNumber}
                                size="small"
                              />
                            )}
                          </div>

                          {/* 당첨 확인 버튼 */}
                          <button
                            onClick={() => {
                              if (!result) {
                                handleCheckWinning(item);
                              } else {
                                toggleComparison(item.id);
                              }
                            }}
                            className="ml-2 px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            {isShowing ? '접기' : result ? '결과보기' : '당첨확인'}
                          </button>
                        </div>

                        {/* 비교 결과 */}
                        {isShowing && result && (
                          <div className="pt-2 border-t border-gray-200">
                            <LottoComparisonResult
                              result={result}
                              myNumbers={item.numbers}
                              myBonus={item.bonusNumber}
                            />
                            {result.bestRound && (
                              <div className="mt-2 text-xs text-gray-500">
                                {result.bestRound}회 ({result.bestDate}) 당첨번호 기준
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-6">
                  <button
                    onClick={() => loadHistory(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i;
                      } else if (currentPage < 3) {
                        page = i;
                      } else if (currentPage > totalPages - 3) {
                        page = totalPages - 5 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => loadHistory(page)}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page + 1}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => loadHistory(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
