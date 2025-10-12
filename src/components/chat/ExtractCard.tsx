import React from 'react';

import * as htmlToImage from 'html-to-image';
import { flushSync } from 'react-dom';

import addIcon from '@/assets/icons/add-image.svg';
import shareIcon from '@/assets/icons/share-image.svg';
import Logo from '@/assets/images/logo.svg';
import Header from '@/layouts/Header';

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
  onClose: () => void;
}

export default function ExtractCard({
  imageUrl,
  quote,
  title,
  artist,
  onSave,
  onShare,
  onClose,
}: ExtractCardProps) {
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const [isCapturing, setIsCapturing] = React.useState(false);

  const isIOS = React.useMemo(
    () =>
      /iP(hone|od|ad)/.test(navigator.userAgent) ||
      (navigator.platform?.includes('Mac') && 'ontouchend' in document),
    [],
  );

  const safeSrc = React.useMemo(
    () => imageUrl.replace(/^http:\/\//i, 'https://'),
    [imageUrl],
  );

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
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();

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
      requestAnimationFrame(() => resolve());
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
      backgroundColor: undefined as string | undefined,
      width,
      height,
      pixelRatio: 1,
      style,
      cacheBust: true,
      preferCanvas: true as const,
      filter: (node: unknown) =>
        !(node instanceof Element && node.classList.contains('capture-ignore')),
      onClone: (_doc: Document, clonedNode: HTMLElement) => {
        clonedNode.querySelectorAll('img').forEach(n => {
          const img = n as HTMLImageElement;

          try {
            const src = new URL(img.src, document.baseURI);
            if (
              src.origin !== window.location.origin &&
              src.protocol === 'https:'
            ) {
              img.crossOrigin = 'anonymous';
            }
          } catch {
            /*  */
          }

          img.loading = 'eager';
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

    let blob: Blob | null = null;
    try {
      blob = await htmlToImage.toBlob(target, {
        ...options,
        pixelRatio: scale,
      });
    } catch {
      /* noop */
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

      if (isIOS) {
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'eyedia'}-extract.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
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
    <section className="fixed inset-0 z-10 grid place-items-center">
      <div
        className={`mx-auto flex h-[100dvh] w-full max-w-[43rem] flex-col bg-gray-0 ${
          isCapturing ? 'capture-still' : ''
        }`}
      >
        <Header
          showBackButton
          backgroundColorClass="bg-gray-0"
          onBackClick={onClose}
        />

        <figure
          ref={cardRef}
          className="relative isolate mx-auto my-auto h-[50rem] w-[90%] overflow-hidden rounded-[16px]"
        >
          <img
            src={safeSrc}
            alt="artwork"
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            draggable={false}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/45" />

          <figcaption className="absolute left-[1.5rem] top-[1.5rem] flex items-center gap-[0.5rem]">
            <img src={Logo} alt="EYEDIA" className="h-[3rem] w-[3rem]" />
            <span className="font-bold text-gray-0 t4">EYEDIA</span>
          </figcaption>

          <div className="absolute bottom-28 left-6 right-6 top-0 flex items-center">
            <p className="leading-relaxed text-white bd1">{quote}</p>
          </div>

          <div className="absolute bottom-[2.6rem] left-6 right-6 flex flex-col gap-[1.6rem] text-white/90">
            <div className="h-px bg-white/30" />
            <div>
              <h2 className="text-white t4">{title}</h2>
              <p className="mt-1 ct4">{artist}</p>
            </div>
          </div>
        </figure>

        <div className="mt-auto flex w-full justify-center pb-[max(2rem,env(safe-area-inset-bottom))]">
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
    </section>
  );
}
