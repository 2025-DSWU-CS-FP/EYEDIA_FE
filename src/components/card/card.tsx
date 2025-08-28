import React from 'react';

import * as htmlToImage from 'html-to-image';
import { flushSync } from 'react-dom';

import '@/styles/card.css';
import Logo from '@/assets/images/logo.svg';
import QR from '@/assets/images/qr.png';
import { useToast } from '@/contexts/ToastContext';

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

export default function Card() {
  const captureRef = React.useRef<HTMLDivElement | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [isCapturing, setIsCapturing] = React.useState(false);
  type CSSProps = React.CSSProperties & { '--i'?: number };

  const { showToast } = useToast();
  const idx = (i: number): CSSProps => ({ '--i': i });

  function useTodayKST() {
    return React.useMemo(() => {
      const now = new Date();

      const dateISO = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(now);

      const display = new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
        .format(now)
        .replace(/\s/g, '')
        .replace(/\.$/, '');

      return { dateISO, display };
    }, []);
  }

  const waitFontsReady = async (): Promise<void> => {
    const d = document as unknown as { fonts?: { ready?: Promise<unknown> } };
    try {
      await d.fonts?.ready;
    } catch {
      /*  */
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
        if (typeof maybeDecode === 'function')
          return maybeDecode.call(img).catch(() => undefined);
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

  const isIOS = () =>
    /iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

  type HtmlToImageOptions = NonNullable<
    Parameters<typeof htmlToImage.toBlob>[1]
  >;
  const captureBlob = async (): Promise<Blob> => {
    const target = captureRef.current;
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

    const options: HtmlToImageOptions = {
      backgroundColor: '#0f1114',
      width,
      height,
      pixelRatio: scale, // 해상도 스케일
      style,
      cacheBust: true,
      filter: (node: HTMLElement) =>
        !(
          node.classList?.contains('noise') ||
          node.classList?.contains('capture-ignore')
        ),
    };

    let blob = await htmlToImage.toBlob(target, options);
    if (!blob) {
      const dataUrl = await htmlToImage.toPng(target, options);
      const res = await fetch(dataUrl);
      blob = await res.blob();
    }
    return blob;
  };

  const savePng = async (): Promise<void> => {
    if (!captureRef.current || isCapturing) return;
    try {
      const blob = await captureBlob();
      const fileName = 'eyedia-ticket.png';
      const file = new File([blob], fileName, { type: 'image/png' });
      const n = navigator as WebShareNavigator;

      if (typeof n.share === 'function' && n.canShare?.({ files: [file] })) {
        await n.share({ files: [file], title: 'Eyedia Ticket' });
      } else if (isIOS()) {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      showToast('이미지 저장에 실패했습니다.', 'error');
    } finally {
      setIsCapturing(false);
    }
  };

  const { dateISO, display } = useTodayKST();

  return (
    <div
      ref={rootRef}
      className={`max-h-dvh overflow-hidden py-[0.5rem] ${isCapturing ? 'capture-still' : ''}`}
    >
      <div className="output fixed">
        <div className="wrap-colors-1">
          <div className="bg-colors" />
        </div>
        <div className="wrap-colors-2">
          <div className="bg-colors" />
        </div>
        <div className="cover" />
      </div>

      <div className="absolute bottom-[calc(env(safe-area-inset-bottom)_+_2rem)] left-1/2 z-30 -translate-x-1/2 print:hidden">
        <button
          type="button"
          onClick={savePng}
          className="rounded-[10px] bg-brand-mint px-[1.2rem] py-[0.6rem] text-gray-0 shadow-card bt3 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mint"
          aria-label="티켓 이미지 저장"
        >
          티켓 이미지 저장
        </button>
      </div>

      <div className="area">
        <div className="area-wrapper">
          <div className="ticket-mask">
            <div className="ticket">
              <div className="ticket-flip-container">
                <div className="float">
                  <div className="front">
                    {/* ⬇️ 캡처 대상 */}
                    <div className="ticket-body" ref={captureRef}>
                      <div className="reflex" />

                      <img
                        src={Logo}
                        className="icon-cube max-w-[25rem]"
                        alt="로고"
                        crossOrigin="anonymous"
                      />

                      <header>
                        <div className="ticket-name flex gap-[0.2rem]">
                          <div>
                            <span className="bold" style={idx(1)}>
                              E
                            </span>
                            <span className="bold" style={idx(2)}>
                              Y
                            </span>
                            <span className="bold" style={idx(3)}>
                              E
                            </span>
                            <span className="bold" style={idx(4)}>
                              D
                            </span>
                            <span className="bold" style={idx(5)}>
                              I
                            </span>
                            <span className="bold" style={idx(6)}>
                              A
                            </span>
                          </div>
                          <div className="flex gap-[0.2rem]">
                            <span className="bold" style={idx(8)}>
                              T
                            </span>
                            <span className="bold" style={idx(9)}>
                              i
                            </span>
                            <span className="bold" style={idx(10)}>
                              c
                            </span>
                            <span className="bold" style={idx(11)}>
                              k
                            </span>
                            <span className="bold" style={idx(11)}>
                              e
                            </span>
                            <span className="bold" style={idx(11)}>
                              t
                            </span>
                          </div>
                        </div>

                        <div className="barcode" />
                      </header>

                      <div className="contents">
                        <div className="event">
                          <div>
                            <span className="bold !tracking-[0em]">Eyedia</span>
                          </div>
                          <div className="!tracking-[0em]">
                            eye-tracked docent
                          </div>
                        </div>

                        <div className="number">MuMul</div>

                        <div className="qrcode">
                          <img alt="이미지" src={QR} crossOrigin="anonymous" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="back">
                    <div className="ticket-body">
                      <div className="reflex" />
                      <header>
                        <div className="ticket-name">
                          <div>
                            <span style={idx(1)}>E</span>
                            <span style={idx(2)}>Y</span>
                            <span style={idx(3)}>E</span>
                            <span style={idx(4)}>D</span>
                            <span style={idx(5)}>I</span>
                            <span style={idx(6)}>A</span>
                          </div>
                          <b>
                            <span className="bold" style={idx(8)}>
                              P
                            </span>
                            <span className="bold" style={idx(9)}>
                              A
                            </span>
                            <span className="bold" style={idx(10)}>
                              S
                            </span>
                            <span className="bold" style={idx(11)}>
                              S
                            </span>
                          </b>
                        </div>
                        <time dateTime={dateISO}>{display}</time>
                      </header>
                      <div className="contents">
                        <div className="qrcode">
                          <img alt="이미지" src={QR} crossOrigin="anonymous" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="noise capture-ignore">
        <svg height="100%" width="100%">
          <defs>
            <pattern
              height="500"
              width="500"
              patternUnits="userSpaceOnUse"
              id="noise-pattern"
            >
              <filter y="0" x="0" id="noise">
                <feTurbulence
                  stitchTiles="stitch"
                  numOctaves="3"
                  baseFrequency="0.65"
                  type="fractalNoise"
                />
                <feBlend mode="screen" />
              </filter>
              <rect filter="url(#noise)" height="500" width="500" />
            </pattern>
          </defs>
          <rect fill="url(#noise-pattern)" height="100%" width="100%" />
        </svg>
      </div>
    </div>
  );
}
