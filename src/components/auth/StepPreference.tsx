import { useState } from 'react';

import Chip from '@/components/auth/Chip';
import Button from '@/components/common/Button';

interface StepPreferenceProps {
  onComplete?: (keywords: ExhibitionCategoryCode[]) => void;
}

export type ExhibitionCategoryCode =
  | 'ANCIENT'
  | 'RENAISSANCE'
  | 'MODERN'
  | 'CONTEMPORARY'
  | 'WARM'
  | 'COOL'
  | 'MONOTONE'
  | 'PASTEL'
  | 'HEALING'
  | 'HUMOROUS'
  | 'EMOTIONAL'
  | 'CALM'
  | 'PASSIONATE'
  | 'INTERACTIVE'
  | 'OBSERVATIONAL'
  | 'REPETITIVE'
  | 'SCARY';

const TIME_PREFS = [
  '고대/고전',
  '르네상스',
  '근대',
  '현대 (20c 중반 이후)',
] as const;
const COLOR_PREFS = [
  '따뜻한 색감',
  '차가운 색감',
  '모노톤/무채색',
  '파스텔톤',
] as const;
const KEYWORD_PREFS = [
  '힐링되는',
  '유머러스한',
  '감성적인',
  '차분한',
  '정열적인',
] as const;
const SECOND_KEYWORD_PREFS = [
  '인터랙티브한',
  '관찰을 유도하는',
  '반복적인',
  '무서운',
] as const;

type TimePref = (typeof TIME_PREFS)[number];
type ColorPref = (typeof COLOR_PREFS)[number];
type KeywordPref = (typeof KEYWORD_PREFS | typeof SECOND_KEYWORD_PREFS)[number];

const MAP_LABEL_TO_CODE: Record<string, ExhibitionCategoryCode> = {
  '고대/고전': 'ANCIENT',
  르네상스: 'RENAISSANCE',
  근대: 'MODERN',
  '현대 (20c 중반 이후)': 'CONTEMPORARY',
  '따뜻한 색감': 'WARM',
  '차가운 색감': 'COOL',
  '모노톤/무채색': 'MONOTONE',
  파스텔톤: 'PASTEL',
  힐링되는: 'HEALING',
  유머러스한: 'HUMOROUS',
  감성적인: 'EMOTIONAL',
  차분한: 'CALM',
  정열적인: 'PASSIONATE',
  인터랙티브한: 'INTERACTIVE',
  '관찰을 유도하는': 'OBSERVATIONAL',
  반복적인: 'REPETITIVE',
  무서운: 'SCARY',
};

export default function StepPreference({ onComplete }: StepPreferenceProps) {
  const [selectedTime, setSelectedTime] = useState<TimePref | null>(null);
  const [selectedColors, setSelectedColors] = useState<ColorPref[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<KeywordPref[]>([]);

  const toggleSelection = <T extends string>(
    value: T,
    list: T[],
    setList: (val: T[]) => void,
  ) => {
    if (list.includes(value)) setList(list.filter(v => v !== value));
    else setList([...list, value]);
  };

  const isComplete =
    selectedTime && selectedColors.length > 0 && selectedKeywords.length > 0;

  const handleComplete = () => {
    if (!isComplete) return;

    const mergedLabels: string[] = [
      selectedTime as string,
      ...selectedColors,
      ...selectedKeywords,
    ];

    const codes: ExhibitionCategoryCode[] = mergedLabels.map(
      label => MAP_LABEL_TO_CODE[label],
    );

    onComplete?.(codes);
  };

  return (
    <main className="flex min-h-screen flex-col justify-between bg-gray-5 px-[2.5rem] pb-[2.5rem] pt-[3rem]">
      <section className="flex flex-col gap-[3rem]">
        <header className="flex flex-col items-center gap-[1.2rem]">
          <p className="text-center text-brand-blue t5">취향 고르기</p>
          <h1 className="self-stretch text-center text-gray-90 t2">
            회원님의 작품 취향을 <br /> 골라주세요!
          </h1>
        </header>

        <div className="flex flex-col gap-[3.2rem]">
          <section className="flex flex-col gap-[1.6rem]">
            <h2 className="mb-[0.2rem] text-gray-90 t5">시간별</h2>
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
          </section>

          <section className="flex flex-col gap-[1.6rem]">
            <h2 className="mb-[0.2rem] text-gray-90 t5">색감</h2>
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
          </section>

          <section className="flex flex-col gap-[1.6rem]">
            <h2 className="mb-[0.2rem] text-gray-90 t5">키워드</h2>
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
          </section>
        </div>
      </section>

      <Button
        className="w-full bg-brand-blue text-white disabled:cursor-not-allowed disabled:bg-gray-30"
        onClick={handleComplete}
        disabled={!isComplete}
      >
        완료
      </Button>
    </main>
  );
}
