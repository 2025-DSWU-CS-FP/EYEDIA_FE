import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import Player from 'lottie-react';
import { useNavigate } from 'react-router-dom';

import BgLogo from '@/assets/icons/logo.svg?react';
import Img1 from '@/assets/images/landing/landing1.png';
import Img2 from '@/assets/images/landing/landing2.png';
import Img3 from '@/assets/images/landing/landing3.png';
import eyewareLottie from '@/assets/lottie/eyeware.json';
import Button from '@/components/common/Button';
import ProgressBar from '@/components/common/ProgressBar';

const slides = [
  {
    title: '시선이 머무는 곳에서\n감상이 시작됩니다',
    description:
      '시선 인식과 객체 탐지를 통해\n사용자의 관심 지점을 실시간으로 파악합니다.',
    image: Img1,
    buttonText: '다음으로',
  },
  {
    title: '작품 설명,\n더 이상 수동적일 필요 없습니다',
    description:
      'Eyedia가 사용자의 시선과 전시 데이터를\n바탕으로 설명을 생성합니다.',
    image: Img2,
    buttonText: '다음으로',
  },
  {
    title: '눈으로 묻고,\nAI로 답합니다',
    description: '질문하지 않아도,\n사용자의 시선이 질문이 되고 응답이 됩니다.',
    image: Img3,
    buttonText: '시작하기',
  },
];

export default function LandingPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(prev => prev + 1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between overflow-hidden px-[2.4rem] py-[3.2rem] text-center">
      <ProgressBar step={step} total={slides.length} />
      <BgLogo className="absolute top-[9rem] w-[25rem] text-brand-blue opacity-10" />
      <div className="relative flex w-full flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute left-0 top-0 flex w-full flex-shrink-0 flex-col items-center gap-[2.4rem]"
          >
            <Player
              autoplay
              loop
              animationData={eyewareLottie}
              className="w-[12.5rem]"
            />
            <div className="flex w-[30rem] flex-col gap-[1rem] text-left">
              <div className="whitespace-pre-line text-[2rem] font-semibold leading-[140%] text-gray-90">
                {slides[step].title}
              </div>

              <p className="whitespace-pre-line text-[1.4rem] leading-[150%] text-gray-60">
                {slides[step].description}
              </p>
            </div>

            {slides[step].image && (
              <img
                src={slides[step].image}
                alt={slides[step].title}
                className="w-[30.5rem]"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <Button onClick={handleNext} className="mt-auto">
        {slides[step].buttonText}
      </Button>
    </div>
  );
}
