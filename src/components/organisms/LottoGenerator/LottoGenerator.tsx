import { useState } from 'react';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { LottoNumberSet } from '@/components/molecules/LottoNumberSet';

export interface LottoGeneratorProps {
  onNumbersGenerated?: (numbers: number[], bonus: number) => void;
}

export const LottoGenerator = ({ onNumbersGenerated }: LottoGeneratorProps) => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [bonusNumber, setBonusNumber] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateLotto = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const lottoNumbers: number[] = [];
      while (lottoNumbers.length < 6) {
        const randomNum = Math.floor(Math.random() * 45) + 1;
        if (!lottoNumbers.includes(randomNum)) {
          lottoNumbers.push(randomNum);
        }
      }

      let bonus: number;
      do {
        bonus = Math.floor(Math.random() * 45) + 1;
      } while (lottoNumbers.includes(bonus));

      const sortedNumbers = lottoNumbers.sort((a, b) => a - b);

      setNumbers(sortedNumbers);
      setBonusNumber(bonus);
      onNumbersGenerated?.(sortedNumbers, bonus);
      setIsGenerating(false);
    }, 1000);
  };

  const clearNumbers = () => {
    setNumbers([]);
    setBonusNumber(null);
  };

  return (
    <Card className="p-4 mb-6">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">당신의 로또 번호</h2>

        {numbers.length > 0 ? (
          <div className="flex flex-col items-center">
            <LottoNumberSet
              numbers={numbers}
              bonusNumber={bonusNumber || undefined}
              size="medium"
              className="justify-center"
            />
          </div>
        ) : (
          <Card variant="glass" className="p-6 text-center">
            <p className="text-gray-500 text-sm">번호를 생성해보세요!</p>
          </Card>
        )}
      </div>

      <div className="flex justify-center space-x-3 mt-4">
        <Button
          variant="primary"
          size="medium"
          onClick={generateLotto}
          isLoading={isGenerating}
        >
          번호 생성
        </Button>

        {numbers.length > 0 && (
          <Button
            variant="secondary"
            size="medium"
            onClick={clearNumbers}
          >
            삭제
          </Button>
        )}
      </div>
    </Card>
  );
};