import React from 'react';

import * as htmlToImage from 'html-to-image';
import { flushSync } from 'react-dom';

import addIcon from '@/assets/icons/add-image.svg';
import shareIcon from '@/assets/icons/share-image.svg';
import Logo from '@/assets/images/logo.svg';
import BackButton from '@/components/common/BackButton';

type WebShareNavigator = Navigator & {
  share?: (data: {
    files?: File[];
    title?: string;
    text?: string;
    url?: string;
  }) => Promise<void>;
  canShare?: (data: {
    files?: File[];
    title?: string;
    text?: string;
    url?: string;
  }) => boolean;
};

interface ExtractCardProps {
  imageUrl: string;
  quote: string;
  title: string;
  artist: string;
  onSave: () => void;
  onShare: () => void;
}

export default function ExtractCard({
  imageUrl,
  quote,
  title,
  artist,
  onSave,
  onShare,
}: ExtractCardProps) {
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const [isCapturing, setIsCapturing] = React.useState(false);
  const waitFontsReady = async (): Promise<void> => {
    const d = document as unknown as { fonts?: { ready?: Promise<unknown> } };
    try {
      await d.fonts?.ready;
    } catch {
      /* noop */
    }
  };

  const waitImagesReady = async (root: HTMLElement): Promise<void> => {
    const imgs = Array.from(root.querySelectorAll<HTMLImageElement>('img'));
    if (imgs.length === 0) return;

    await Promise.all(
      imgs.map(img => {
        if (img.complete && img.naturalWidth > 0) {
          return Promise.resolve();
        }

        const maybeDecode = (
          img as HTMLImageElement & { decode?: () => Promise<unknown> }
        ).decode;

        if (typeof maybeDecode === 'function') {
          return maybeDecode.call(img).catch(() => undefined);
        }

        return new Promise<void>(resolve => {
          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', () => resolve(), { once: true });
        });
      }),
    );
  };

  const nextFrame = (): Promise<void> =>
    new Promise<void>(resolve => {
      requestAnimationFrame(() => {
        resolve();
      });
    });

  const twoFrames = async (): Promise<void> => {
    await nextFrame();
    await nextFrame();
  };

  const captureBlob = async (): Promise<Blob> => {
    const target = cardRef.current;
    if (!target) throw new Error('no target');

    flushSync(() => setIsCapturing(true));
    await waitFontsReady();
    await waitImagesReady(target);
    await twoFrames();

    const rect = target.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    const scale = Math.min(2, window.devicePixelRatio || 1);

    const style: Partial<CSSStyleDeclaration> = {
      transform: 'none',
      transformOrigin: 'top left',
      margin: '0',
      padding: '0',
      borderRadius: getComputedStyle(target).borderRadius,
      overflow: 'hidden',
      webkitTextSizeAdjust: '100%',
    };

    const options = {
      backgroundColor: undefined,
      width,
      height,
      pixelRatio: 1, // 캔버스 크기로 스케일
      style,
      cacheBust: true,
      preferCanvas: true as const, // ✅ Safari에서 foreignObject 대신 canvas 우선
      filter: (node: unknown) =>
        !(node instanceof Element && node.classList.contains('capture-ignore')),
      onClone: (_doc: Document, clonedNode: HTMLElement) => {
        clonedNode.querySelectorAll('img').forEach(n => {
          const img = n as HTMLImageElement;
          img.crossOrigin = 'anonymous';
          img.loading = 'eager';
          // img.decoding = 'sync' // 지원 브라우저 한정. 문제되면 주석 유지
          Object.assign(img.style, {
            position: 'absolute',
            inset: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translateZ(0)',
          } as CSSStyleDeclaration);
        });
      },
    };

    // 우선 시도
    let blob: Blob | null = null;
    try {
      // html-to-image는 canvas 크기를 내부에서 정하므로, 스케일은 pixelRatio로
      // (canvasWidth/Height는 무시될 수 있음)
      blob = await htmlToImage.toBlob(target, {
        ...options,
        pixelRatio: scale,
      });
    } catch {
      /*  */
    }

    if (!blob) {
      const dataUrl = await htmlToImage.toPng(target, {
        ...options,
        pixelRatio: scale,
      });
      const res = await fetch(dataUrl);
      blob = await res.blob();
    }
    return blob;
  };

  const handleSave = async (): Promise<void> => {
    if (isCapturing) return;
    try {
      const blob = await captureBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'eyedia'}-extract.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      onSave();
    } finally {
      setIsCapturing(false);
    }
  };

  const handleShare = async (): Promise<void> => {
    if (isCapturing) return;
    try {
      const blob = await captureBlob();
      const file = new File([blob], `${title || 'eyedia'}-extract.png`, {
        type: 'image/png',
      });
      const n = navigator as WebShareNavigator;

      if (typeof n.share === 'function' && n.canShare?.({ files: [file] })) {
        await n.share({ files: [file], title: title || 'Eyedia' });
      } else {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      }
      onShare();
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div
        className={`mx-auto flex h-[100dvh] w-full max-w-[43rem] flex-col bg-gray-0 ${
          isCapturing ? 'capture-still' : ''
        }`}
      >
        <div className="pt-[max(1rem,env(safe-area-inset-top))]">
          <BackButton className="capture-ignore text-gray-100" />
        </div>

        <div
          ref={cardRef}
          className="relative mx-auto mt-[5rem] h-[52rem] w-[90%] overflow-hidden rounded-[16px]"
          style={{ isolation: 'isolate' }}
        >
          <img
            src={imageUrl}
            alt="artwork"
            crossOrigin="anonymous"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />

          <div className="absolute left-[1.5rem] top-[1.5rem] flex items-center gap-[0.5rem]">
            <img
              src={Logo}
              alt="로고"
              crossOrigin="anonymous"
              className="h-[3rem] w-[3rem]"
            />
            <span className="text-t4 font-bold text-gray-0">EYEDIA</span>
          </div>

          <div className="absolute bottom-28 left-6 right-6 top-0 flex items-center">
            <p className="leading-relaxed text-white bd1">{quote}</p>
          </div>

          <div className="absolute bottom-[2.6rem] left-6 right-6 flex flex-col gap-[1.6rem] text-white/90">
            <div className="h-px bg-white/30" />
            <div>
              <div className="text-white t4">{title}</div>
              <div className="mt-1 ct4">{artist}</div>
            </div>
          </div>
        </div>

        <div className="mt-auto flex w-full justify-center pb-[max(3rem,env(safe-area-inset-bottom))]">
          <div className="capture-ignore flex items-center gap-[2.7rem] rounded-full bg-brand-blue px-10 py-4 shadow-lg">
            <button
              type="button"
              onClick={handleSave}
              className="flex flex-col items-center text-white"
              aria-label="이미지 저장"
            >
              <img src={addIcon} alt="저장" className="h-[2.4rem] w-[2.4rem]" />
              <span className="mt-1 ct4">이미지 저장</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex flex-col items-center text-white"
              aria-label="SNS 공유"
            >
              <img
                src={shareIcon}
                alt="공유"
                className="h-[2.4rem] w-[2.4rem]"
              />
              <span className="mt-1 ct4">SNS 공유</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
