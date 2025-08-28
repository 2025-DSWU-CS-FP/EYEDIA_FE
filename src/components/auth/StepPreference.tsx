import { useState } from 'react';

import Chip from '@/components/auth/Chip';
import Button from '@/components/common/Button';

interface StepPreferenceProps {
  onComplete?: () => void;
}

const TIME_PREFS = ['고대/고전', '르네상스', '근대', '현대 (20c 중반 이후)'];
const COLOR_PREFS = ['따뜻한 색감', '차가운 색감', '모노톤/무채색', '파스텔톤'];
const KEYWORD_PREFS = [
  '힐링되는',
  '유머러스한',
  '감성적인',
  '차분한',
  '정열적인',
];
const SECOND_KEYWORD_PREFS = [
  '인터랙티브한',
  '관찰을 유도하는',
  '반복적인',
  '무서운',
];

export default function StepPreference({ onComplete }: StepPreferenceProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const toggleSelection = (
    value: string,
    list: string[],
    setList: (val: string[]) => void,
  ) => {
    if (list.includes(value)) {
      setList(list.filter(v => v !== value));
    } else {
      setList([...list, value]);
    }
  };

  const isComplete =
    selectedTime && selectedColors.length > 0 && selectedKeywords.length > 0;

  return (
    <div className="flex min-h-screen flex-col justify-between bg-gray-5 px-[2.5rem] pb-[2.5rem] pt-[3rem]">
      <div className="flex flex-col gap-[3rem]">
        <div className="flex flex-col items-center gap-[1.2rem]">
          <div className="text-center text-brand-blue t5">취향 고르기</div>
          <div className="self-stretch text-center text-gray-90 t2">
            회원님의 작품 취향을 <br />
            골라주세요!
          </div>
        </div>
        <div className="flex flex-col gap-[3.2rem]">
          <div className="flex flex-col gap-[1.6rem]">
            <p className="mb-2 text-gray-90 t5">시간별</p>
            <div className="flex flex-wrap gap-[0.8rem]">
              {TIME_PREFS.map(item => (
                <Chip
                  key={item}
                  label={item}
                  selected={selectedTime === item}
                  onClick={() => setSelectedTime(item)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[1.6rem]">
            <p className="mb-2 text-gray-90 t5">색감</p>
            <div className="flex flex-wrap gap-[0.8rem]">
              {COLOR_PREFS.map(item => (
                <Chip
                  key={item}
                  label={item}
                  selected={selectedColors.includes(item)}
                  onClick={() =>
                    toggleSelection(item, selectedColors, setSelectedColors)
                  }
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[1.6rem]">
            <p className="mb-2 text-gray-90 t5">키워드</p>
            <div className="flex flex-col gap-[1.2rem] overflow-x-auto">
              <div className="flex gap-[0.8rem]">
                {KEYWORD_PREFS.map(item => (
                  <Chip
                    key={item}
                    label={item}
                    selected={selectedKeywords.includes(item)}
                    onClick={() =>
                      toggleSelection(
                        item,
                        selectedKeywords,
                        setSelectedKeywords,
                      )
                    }
                  />
                ))}
              </div>
              <div className="flex gap-[0.8rem]">
                {SECOND_KEYWORD_PREFS.map(item => (
                  <Chip
                    key={item}
                    label={item}
                    selected={selectedKeywords.includes(item)}
                    onClick={() =>
                      toggleSelection(
                        item,
                        selectedKeywords,
                        setSelectedKeywords,
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        className="w-full bg-brand-blue text-white disabled:cursor-not-allowed disabled:bg-gray-30"
        onClick={onComplete}
        disabled={!isComplete}
      >
        완료
      </Button>
    </div>
  );
}
