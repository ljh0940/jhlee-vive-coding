"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  Button,
  Input
} from "@/components";

export default function RoulettePage() {
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState("");
  const [winnerCount, setWinnerCount] = useState(1);
  const [winners, setWinners] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState(-1);

  const addParticipant = () => {
    if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant("");
    }
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const spinRoulette = async () => {
    if (participants.length < winnerCount) {
      alert("참가자 수가 당첨자 수보다 적습니다!");
      return;
    }

    setIsSpinning(true);
    setWinners([]);

    // 룰렛 애니메이션 효과
    let spins = 0;
    const maxSpins = 30 + Math.floor(Math.random() * 20);

    const spinInterval = setInterval(() => {
      setCurrentHighlight(Math.floor(Math.random() * participants.length));
      spins++;

      if (spins >= maxSpins) {
        clearInterval(spinInterval);

        // 당첨자 선정
        const shuffled = [...participants].sort(() => Math.random() - 0.5);
        const selectedWinners = shuffled.slice(0, winnerCount);

        setTimeout(() => {
          setWinners(selectedWinners);
          setIsSpinning(false);
          setCurrentHighlight(-1);
        }, 500);
      }
    }, 100);
  };

  const resetRoulette = () => {
    setWinners([]);
    setCurrentHighlight(-1);
  };

  return (
    <div className="page-background">
      <div className="content-max-width-lg mx-auto py-12 px-4">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">🎯 룰렛 추첨</h1>
          <p className="text-lg text-gray-600">참가자를 입력하고 당첨자를 뽑아보세요!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 참가자 입력 섹션 */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">참가자 입력</h2>

            <div className="flex gap-2 mb-4">
              <Input
                placeholder="참가자 이름을 입력하세요"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                className="flex-1"
              />
              <Button onClick={addParticipant} variant="primary">
                추가
              </Button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                당첨자 수
              </label>
              <Input
                type="number"
                min="1"
                max={participants.length || 1}
                value={winnerCount}
                onChange={(e) => setWinnerCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24"
              />
            </div>

            <div className="text-sm text-gray-600 mb-4">
              총 {participants.length}명 참가 / {winnerCount}명 당첨 예정
            </div>

            <div className="flex gap-2">
              <Button
                onClick={spinRoulette}
                variant="primary"
                size="medium"
                disabled={participants.length === 0 || isSpinning}
                isLoading={isSpinning}
              >
                {isSpinning ? "추첨 중..." : "🎯 룰렛 돌리기"}
              </Button>

              <Button
                onClick={resetRoulette}
                variant="secondary"
                size="medium"
                disabled={winners.length === 0}
              >
                초기화
              </Button>
            </div>
          </Card>

          {/* 룰렛 화면 */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">룰렛</h2>

            {participants.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <div className="text-6xl mb-4">🎯</div>
                <p>참가자를 추가해주세요</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {participants.map((participant, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-all duration-200 flex items-center justify-between ${
                      currentHighlight === index && isSpinning
                        ? 'bg-yellow-200 border-yellow-400 scale-105 shadow-md'
                        : winners.includes(participant)
                        ? 'bg-green-100 border-green-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-medium">{participant}</span>
                    {winners.includes(participant) && (
                      <span className="text-green-600 font-bold">🏆 당첨!</span>
                    )}
                    {!isSpinning && !winners.length && (
                      <button
                        onClick={() => removeParticipant(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* 당첨자 결과 */}
        {winners.length > 0 && (
          <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
              🎉 당첨자 발표! 🎉
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {winners.map((winner, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md text-center border-2 border-green-300"
                >
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="font-bold text-lg text-gray-800">{winner}</div>
                  <div className="text-sm text-green-600">#{index + 1} 당첨자</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 네비게이션 */}
        <div className="text-center mt-8">
          <Link href="/" className="navigation-link">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}