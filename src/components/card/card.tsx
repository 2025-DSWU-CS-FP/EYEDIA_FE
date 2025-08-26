import React from 'react';
import './card.css';

type CSSProps = React.CSSProperties & { '--i'?: number };

const idx = (i: number): CSSProps => ({ '--i': i });

export default function Card() {
  return (
    <>
      <div className="output fixed h-dvh">
        <div className="wrap-colors-1">
          <div className="bg-colors" />
        </div>
        <div className="wrap-colors-2">
          <div className="bg-colors" />
        </div>
        <div className="cover" />
      </div>

      <div className="area">
        <div className="area-wrapper">
          <div className="ticket-mask">
            <div className="ticket">
              <div className="ticket-flip-container">
                <div className="float">
                  <div className="front">
                    <div className="ticket-body">
                      <div className="reflex" />

                      <svg
                        className="icon-cube"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          style={idx(1)}
                          className="path-center"
                          d="M12 12.75L14.25 11.437M12 12.75L9.75 11.437M12 12.75V15"
                          stroke="black"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          style={idx(21)}
                          className="path-t"
                          d="M9.75 3.562L12 2.25L14.25 3.563"
                          stroke="black"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <path
                          style={idx(3)}
                          className="path-tr"
                          d="M21 7.5L18.75 6.187M21 7.5V9.75M21 7.5L18.75 8.813"
                          stroke="black"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          style={idx(4)}
                          className="path-br"
                          d="M21 14.25V16.5L18.75 17.813"
                          stroke="black"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          style={idx(5)}
                          className="path-b"
                          d="M12 21.75L14.25 20.437M12 21.75V19.5M12 21.75L9.75 20.437"
                          stroke="black"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          style={idx(6)}
                          className="path-bl"
                          d="M5.25 17.813L3 16.5V14.25"
                          stroke="black"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          style={idx(7)}
                          className="path-tl"
                          d="M3 7.5L5.25 6.187M3 7.5L5.25 8.813M3 7.5V9.75"
                          stroke="black"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

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
                          <div>
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
                          </div>
                        </div>

                        <div className="barcode" />
                      </header>
                      <div className="contents">
                        <div className="event">
                          <div>
                            <span className="bold">UI</span>
                            <span>verse</span>
                          </div>
                          <div>CONFERENCE</div>
                        </div>

                        <div className="number">#001</div>

                        <div className="qrcode">
                          <img
                            alt="이미지"
                            src="data:image/png;base64,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"
                          />
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

                        <time dateTime="2025-08-27T18:45:00+01:00">
                          <span style={idx(11)} className="bold">
                            2
                          </span>
                          <span style={idx(12)} className="bold">
                            7
                          </span>
                          <span style={idx(13)} className="slash">
                            /
                          </span>
                          <span style={idx(14)}>0</span>
                          <span style={idx(15)}>8</span>
                          <span style={idx(16)} className="slash">
                            /
                          </span>
                          <span style={idx(17)}>2</span>
                          <span style={idx(18)}>0</span>
                          <span style={idx(19)}>2</span>
                          <span style={idx(20)}>5</span>
                        </time>
                      </header>
                      <div className="contents">
                        <div className="qrcode">
                          <img
                            alt="이미지"
                            src="data:image/png;base64,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"
                          />
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

      <div className="noise">
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
    </>
  );
}
