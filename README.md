# Eyedia <img src="https://eyedia.netlify.app/logo.svg" width="110" align="left" />
LLM과 RAG 기술을 활용한 AI기반 미술관 도슨트 서비스

<br />

## **💡1. 프로젝트 개요**

### 1-1. 프로젝트 소개
- 프로젝트 명 : LLM과 RAG 기술을 활용한 AI기반 미술관 도슨트 서비스
- 프로젝트 정의 : 사용자가 시선 추적을 통해 원하는 부분만 질의하면, AI로 해당 부분에 대한 설명을 찾아서 답변해주는 대화형 도슨트 서비스

<img width="1708" height="960" alt="image" src="https://eyedia.netlify.app/image.png" /></br>

<br />

### 1-2. 개발 배경 및 필요성

본 프로젝트는 스마트 아이웨어(Jetson Nano) , LLM(대형 언어 모델), RAG(문서 검색 기반 생성 모델)을 활용하여 AI 기반 미술관 도슨트 시스템을 개발합니다. 사용자가 웹 환경에서 미술관의 특정 그림, 특정 객체에 대해 질문하면, 그에 대한 자연스럽고 자세한 설명을 제공합니다. </br></br>


<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/878db6e0-ebba-4aa9-ae3c-e754b2bf8f15" />

<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/4e3aa93c-8da1-4271-b25d-4918508165d6" />

<img width="5704" height="2172" alt="image" src="https://github.com/user-attachments/assets/8b7d6b68-bc32-42fe-a0a2-118e86f66d7f" />
<br />

<br />

### 1-3. 프로젝트 특장점
- 실시간 맞춤형 AI 도슨트
- 시선·관심 객체·음성 질의 등 다양한 입력을 수집·해석해 즉석 설명 생성
- 채팅·음성(TTS)로 결과 제공, 관람 흐름에 맞춘 인터랙티브 경험 제공
- 미리 녹음된 일방향 설명·GPS/QR/버튼 입력 중심의 기존 도슨트 방식에서 탈피
- 시선 추적·객체 인식·멀티모달 AI(영상·음성·텍스트 통합)로 관람객의 ‘관심’과 ‘행동’ 중심 설계
- 상용 안내기의 폐쇄성·고가 대비, 오픈소스 기반으로 기능 자유 추가·변경·확장 가능
- 시선(동공)·환경(작품)·음성(질의)·프론트 클릭 등 모든 입력을 실시간 통합 분석
- 진정한 맞춤형 도슨트 경험 구현, 현장 적용 가능성과 확장성 입증

<br />


### 1-4. 주요 기능
- **객체 인식·크롭 자동화**: Ultralytics YOLOv8로 작품 내 객체 bbox 탐지 → OpenCV로 객체별 crop 저장/라벨 매핑
- **임베딩 기반 유사도 검색**: CLIP 임베딩 + FAISS 코사인 유사도 검색으로 가장 유사한 객체와 설명을 자동 반환
- **LLM 도슨트 설명 생성**: GPT-4o에 프롬프트 전달 → 한국어 구어체 설명 생성 → 채팅 형식으로 백엔드 전송(FastAPI)
- **시선 추적·객체 선택(Gaze)**: OpenCV/MediaPipe로 동공 중심 추출 → Homography 기반 Gaze Mapping → YOLO bbox와 교차해 ‘응시 객체’ 판정 및 시선 시각화
- **실시간 멀티모달 파이프라인**: Jetson Nano가 환경/동공 영상+음성 수집→ Wi-Fi로 FastAPI 전송 → YOLO·CLIP·FAISS 처리 → STT/TTS → Spring Boot 저장/권한 → React 채팅 UI
- **스마트 아이웨어 H/W**: Jetson Nano + Camera Module 3(환경) + Camera Module 3(눈동자) + Wi-Fi
- **실시간 통신/데이터 연동**: Jetson Nano ↔ 백엔드 간 실시간 송수신(영상/시선/음성), 연동 완료
- **클라우드 데이터 관리**: 이미지/메타데이터는 S3, 관계 데이터는 RDS(MySQL)에 안전 저장
- **웹앱 주요 기능**: 메인/갤러리 감상, 스마트 아이웨어 연동 채팅, 대화 기록 확인·검색, 발췌 기능, TTS, STT


<br />

### 1-5. 기대 효과 및 활용 분야

기대 효과
> 관람객의 시선·질의·행동을 토대로 해설을 즉시 생성해 기존 오디오 가이드보다 몰입감과 만족도를 높이고, 시선·질문·체류시간 등 행동 데이터를 축적·분석해 큐레이션과 동선 설계를 지속적으로 개선할 수 있습니다. 텍스트·음성(TTS)을 동시 제공해 연령·장애 유무와 상관없이 접근성을 강화하고, 웹(React)·백엔드(Spring) 기반 구조와 오픈소스 모듈러 설계로 현장/장비 제약 없이 빠른 배포와 기능 확장이 가능합니다. 팀과 기관 입장에서는 YOLO·CLIP·LLM·시선추적 등 융합 기술을 실전에서 다루며 운영 자동화 파이프라인을 축적해 인력·비용 효율을 동시에 확보합니다.

활용 분야
> 미술관·박물관·기념관 등 전시 공간에서 작품 맞춤 도슨트로 즉시 적용할 수 있고, 과학관·기업 쇼룸·브랜드 팝업/리테일 전시에서는 제품·프로토타입 이해를 돕는 인터랙티브 설명으로 전환율을 높일 수 있습니다. 도시 관광지·문화재 현장·야외 페스티벌/비엔날레에서는 GPS·비전 결합 안내로 현장성을 강화하고, 학교·대학·도서관·공공기관에서는 교육용 체험형 콘텐츠와 접근성 보조 해설로 학습 효과를 높입니다. 공항·역사·박람회 같은 대규모 유동 인프라에서는 다국어 안내와 군중 행태 데이터 분석에, 스마트 아이웨어와 결합한 투어·이벤트 운영에는 경량 장비 기반의 이동형 가이드로 확장 가능합니다.

<br />

### 1-6. 기술 스택

<table>
  <thead>
    <tr>
      <th>구분</th>
      <th>항목</th>
      <th>상세내용</th>
    </tr>
  </thead>
  <tbody>
    <!-- S/W 개발환경 -->
    <tr>
      <td rowspan="5"><strong>S/W 개발환경</strong></td>
      <td>OS</td>
      <td>macOS, Ubuntu 22.04 (AWS EC2), Windows</td>
    </tr>
    <tr>
      <td>개발환경(IDE)</td>
      <td>VSCode, IntelliJ, Colab</td>
    </tr>
    <tr>
      <td>개발도구</td>
      <td>Spring Boot, React, FastAPI, FAISS, Docker, GitHub Actions</td>
    </tr>
    <tr>
      <td>개발언어</td>
      <td>Java, TypeScript (JSX/TSX), Python, MySQL</td>
    </tr>
    <tr>
      <td>기타사항</td>
      <td>AWS EC2/S3/Route53, OpenAI(GPT-4, TTS)</td>
    </tr>
    <!-- H/W 구성장비 -->
    <tr>
      <td rowspan="4"><strong>H/W 구성장비</strong></td>
      <td>디바이스</td>
      <td>Jetson Nano (Jetson Orin Nano Super) + 카메라 2대 + usb 리모컨</td>
    </tr>
    <tr>
      <td>통신</td>
      <td>Wi-Fi, HTTP API 통신 (FastAPI ↔ Spring Boot ↔ React)</td>
    </tr>
    <tr>
      <td>언어</td>
      <td>Python 기반 제어스크립트, OpenCV</td>
    </tr>
    <tr>
      <td>기타사항</td>
      <td>Dual camera frame capture, 시선 좌표 추정(Gaze Estimation), 실시간 crop 객체 식별</td>
    </tr>
    <!-- 프로젝트 관리환경 -->
    <tr>
      <td rowspan="3"><strong>프로젝트 관리환경</strong></td>
      <td>형상관리</td>
      <td>Git, GitHub Actions CI/CD, Docker</td>
    </tr>
    <tr>
      <td>의사소통관리</td>
      <td>Discord, 카카오톡, GitHub Issues</td>
    </tr>
    <tr>
      <td>기타사항</td>
      <td>Notion, Google Drive, Google Sheets, Figma (UX 시안)</td>
    </tr>
  </tbody>
</table>


---

## **💡2. 팀원 소개**

| [<img src="https://github.com/Dubabbi.png" width="150px">](https://github.com/Dubabbi) | [<img src="https://github.com/kcw9609.png" width="150px">](https://github.com/kcw9609) | [<img src="https://github.com/20210699.png" width="150px">](https://github.com/20210699) | [<img src="https://github.com/yuchaemin2.png" width="150px">](https://github.com/yuchaemin2) | [<img src="https://github.com/yooni1231.png" width="150px">](https://github.com/yooni1231) |
|:---:|:---:|:---:|:---:|:---:|
| [윤소은](https://github.com/Dubabbi)   | [강채원](https://github.com/kcw9609)   | [김예빈](https://github.com/20210699) | [유채민](https://github.com/yuchaemin2) | [이윤서](https://github.com/yooni1231) |
| • 팀장 <br> • 프론트엔드 | • 부팀장, 백엔드 총괄 <br> • 백엔드, 모델  | • 서기 <br> • CI/CD 구축, 백엔드, 모델 |• 비교과 총괄 <br> • 작업/보고서 관리 <br> • 백엔드, 모델| • llm & 데이터분석 파트장 <br> • 하드웨어, 모델 |

## 🖼️ 단체 사진
> 우리 팀 최고

![KakaoTalk_20250926_103746930](https://github.com/user-attachments/assets/5758f16b-64f5-44ff-b23d-e73ed3bb602d)

---
## **💡3. 시스템 구성도**


| 서비스 구성도 | 시스템 구성도 |
|---------------|---------------|
| <img width="800" height="530" alt="시나리오-2" src="https://github.com/user-attachments/assets/ebf44098-51b0-475d-baa6-13ff57a134b6" />| <img width="320" alt="image" src="https://github.com/user-attachments/assets/24654a54-4c53-4b31-8604-854386241509" /> | 


|엔티티 관계도 |
|---------------|
| <img alt="image" src="https://github.com/user-attachments/assets/d7ae2534-8479-4a58-8778-6e110f80b84a" />|
|아이웨어 연결 → 실시간 채팅 flow |
| <img alt="실시간 채팅 flow" src="https://github.com/user-attachments/assets/866d1f77-218b-4d0e-87de-4d3f139cc9fb" /> |
|소프트웨어 아키텍처 | 
| <img alt="소프트웨어 아키텍처" src="https://github.com/user-attachments/assets/fd473c00-e4a8-43a2-a77a-700d3a756f56" />|
|하드웨어 설계 |
| <img alt="image" src="https://github.com/user-attachments/assets/0949f869-6451-42fb-b65e-b94d873ded62" />|

<br />

## **💡4. 작품 소개영상**
### 🔗[Eyedia 프로젝트 소개 영상 보러가기](https://www.youtube.com/watch?v=akFH7fvptO8)
### 🔗[Eyedia 팀의 웃픈 프로젝트 과정 보러가기](https://youtube.com/shorts/cawQaq1wMBc?si=ymtyX2Hwrhz8wHAg)

<br />

## **💡5. 핵심 소스코드**

<details>
  <summary><h3>백엔드 도슨트 프롬프트</h3></summary>

```Java
public Prompt basePrompt(Painting p, String question){

        String system = """
            너는 미술관 도슨트야. 한국어로 친절하고 자연스럽게 설명해.
            - 제공된 작품 정보와 질문만 사용(추측 금지)
            - 3~6문장, 마지막에 짧은 질문으로 마무리
            """;

        String user = """
            [작품 정보]
            제목: %s
            작가: %s
            전시: %s
            기본설명: %s

            [관람객 질문]
            %s
            """.formatted(
                nz(p.getTitle()), nz(p.getArtist()),
                "메트로폴리탄 미술관", nz(p.getDescription()),
                nz(question)
        );

        return new Prompt(system, user);
    }

    public Prompt gazeAreaPrompt(String paintingTitle, String quadrant, String description){
        String system = """
                당신은 미술관의 도슨트입니다.\s
                관람객에게 친절하고 감성적인 어조로 작품 속 객체를 설명해야 합니다.\s
                너무 기술적이거나 딱딱하지 않게 풀어주세요.\s
                그림에 없는 내용은 설명하지 말고, 해당 그림 외의 다른 그림은 언급하지 마세요.\s
                작품 전체 설명보다는 각 객체에 대한 설명을 중심으로 해설해주세요.
            """;

        String user = """
                아래는 %s 그림의 %s 분면에서 감지된 후보 객체 설명입니다: \s
                %s\s
                → 위의 내용을 바탕으로 관람객에게 설명을 작성해주세요.
            """.formatted(
                nz(paintingTitle), nz(quadrant),
                nz(description)
        );

        return new Prompt(system, user);
    }
```
</details>
<details>
  <summary><h3>백엔드 그림 인식 코드</h3></summary>

```Java
public ApiResponse<?> detect(@RequestBody Long artId) {

        MessageDTO.ChatImageResponseDTO message;

        var list = paintingRepository.findNullUserByArtId(artId);
        if (list.isEmpty()) {
            throw new GeneralException(ErrorStatus.PAINTING_NOT_FOUND);
        } else if (list.size() > 1) {
            List<Long> ids = list.stream().map(Painting::getPaintingId).toList();
            throw new GeneralException(ErrorStatus.PAINTING_CONFLICT, Map.of("duplicatedPaintingIds", ids));
        } else {
            Painting painting = list.get(0);
            var exhibition = exhibitionRepository.findByPaintingsPaintingId(painting.getPaintingId())
                    .orElseThrow(() -> new GeneralException(ErrorStatus.EXHIBITION_NOT_FOUND));

            message = MessageDTO.ChatImageResponseDTO.builder()
                    .paintingId(painting.getPaintingId())
                    .imgUrl("https://s3-eyedia.s3.ap-northeast-2.amazonaws.com/"
                            + exhibition.getExhibitionsId() + "/" + artId + "/" + artId + ".jpg")
                    .title(painting.getTitle())
                    .artist(painting.getArtist())
                    .description(painting.getDescription())
                    .exhibition(exhibition.getTitle())
                    .artId(artId)
                    .build();

            messagingTemplate.convertAndSend("/queue/events", message);
        }
        return ApiResponse.of(SuccessStatus._OK, message);
    }
```
</details>

<details>
  <summary><h3>프론트엔드 STOMP WebSocket 훅 (연결·구독·송신)</h3></summary>

```tsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IMessage, StompSubscription, IFrame } from '@stomp/stompjs';
import makeStompClient from '@/services/ws/makeStompClient';
import type { IncomingChat, OutgoingChat } from '@/types/chat';

type Args = {
  paintingId: number;
  token?: string;
  onConnected?: (headers: IFrame['headers']) => void;
  topic?: string;
  onRoomMessage?: (msg: IMessage) => void;
};

export default function useStompChat({
  paintingId, token, onConnected, topic: topicOverride, onRoomMessage,
}: Args) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<IncomingChat[]>([]);
  const clientRef = useRef<ReturnType<typeof makeStompClient> | null>(null);
  const chatSubRef = useRef<StompSubscription | null>(null);
  const roomSubRef = useRef<StompSubscription | null>(null);

  const chatTopic = useMemo(
    () => topicOverride ?? `/topic/chat/art/${paintingId}`,
    [topicOverride, paintingId],
  );
  const roomTopic = useMemo(() => `/room/${paintingId}`, [paintingId]);

  useEffect(() => {
    const url = import.meta.env.VITE_WS_URL as string;
    const client = makeStompClient({ url, token });
    clientRef.current = client;

    client.onConnect = (frame) => {
      setConnected(true);
      onConnected?.(frame.headers);

      chatSubRef.current = client.subscribe(chatTopic, (f) => {
        try { setMessages((p) => [...p, JSON.parse(f.body)]); } catch {}
      });
      roomSubRef.current = client.subscribe(roomTopic, (f) => onRoomMessage?.(f));
    };

    client.onWebSocketClose = () => setConnected(false);
    client.activate();

    return () => {
      chatSubRef.current?.unsubscribe();
      roomSubRef.current?.unsubscribe();
      client.deactivate();
    };
  }, [token, chatTopic, roomTopic]);

  const send = useCallback((content: string) => {
    const body = JSON.stringify({ paintingId, content: content.trim() } as OutgoingChat);
    if (content.trim()) clientRef.current?.publish({ destination: '/app/chat.sendMessage', body });
  }, [paintingId]);

  return { connected, messages, send, disconnect: () => clientRef.current?.deactivate() };
}
```

</details>


<details>
  <summary><h3>프론트엔드 아이웨어 연결 감지</h3></summary>

```tsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStompChat from '@/hooks/use-stomp-chat';
import getAuthToken from '@/utils/getToken';

type QueueEvent = {
  paintingId?: number; imgUrl?: string; title?: string; artist?: string;
  description?: string; exhibition?: string; artId?: number;
};

export default function OnboardingPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState<string>();
  const [detected, setDetected] = useState<QueueEvent | null>(null);
  const navigate = useNavigate();
  const token = getAuthToken();

  const { connected, messages } = useStompChat({
    paintingId: 0, token, topic: '/queue/events',
    onConnected: (headers) => {
      setIsConnected(true);
      const uid = headers['user-name'] as string | undefined;
      if (uid) setUserId(uid);
    },
  });

  useEffect(() => {
    const items = Array.isArray(messages) ? (messages as QueueEvent[]) : [];
    const next = items.find((e) => typeof e?.paintingId === 'number');
    if (next) setDetected(next);
  }, [messages]);

  useEffect(() => {
    if (!detected?.paintingId) return;
    const t = window.setTimeout(() => {
      navigate('/chat-gaze', {
        state: { userId, ...detected, artId: detected.artId ?? detected.paintingId },
      });
    }, 3000);
    return () => window.clearTimeout(t);
  }, [detected, userId, navigate]);

  const text = useMemo(
    () => (connected || isConnected) ? '아이웨어 연결 성공' : '전용 아이웨어를 연결해주세요.',
    [connected, isConnected],
  );

  return (
    // 연결 상태에 따라 온보딩 UI & 연결 애니메이션 렌더
    // ...
    <div aria-live="polite">{text}</div>
  );
}
```

</details>


<details>
  <summary><h3>프론트엔드 작품 확정 후 대화 시작</h3></summary>

```tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useStompChat from '@/hooks/use-stomp-chat';
import useConfirmPainting from '@/services/mutations/useConfirmPainting';

type LocationState = {
  paintingId?: number; imgUrl?: string; title?: string; artist?: string;
  description?: string; exhibition?: string; artId?: number;
};

export default function GazePage() {
  const { state } = useLocation();
  const s = (state as LocationState | null) ?? null;
  const navigate = useNavigate();
  const { mutate: confirmPainting, isPending } = useConfirmPainting();

  const hasDetected = typeof s?.paintingId === 'number';
  const pid = useMemo(() => (hasDetected ? (s!.paintingId as number) : -1), [hasDetected, s?.paintingId]);

  const [minSpinDone, setMinSpinDone] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMinSpinDone(true), 2000); return () => clearTimeout(t); }, []);
  const ready = hasDetected && minSpinDone;

  useStompChat({ paintingId: pid });

  const handleStartConversation = useCallback(() => {
    if (pid < 0) return;
    confirmPainting(pid, {
      onSettled: () => {
        navigate('/chat-artwork', {
          state: { paintingId: pid, title: s?.title, artist: s?.artist, imgUrl: s?.imgUrl,
                   description: s?.description, exhibition: s?.exhibition },
          replace: true,
        });
      },
    });
  }, [confirmPainting, navigate, pid, s]);

  return (
    <button disabled={!ready || isPending} onClick={handleStartConversation}>대화 시작하기</button>
  );
}
```

</details>


<details>
  <summary><h3>프론트엔드 Artwork 대화</h3></summary>

```tsx
import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useNavigate, useLocation } from 'react-router-dom';
import useStompChat from '@/hooks/use-stomp-chat';
import useArtworkChat from '@/hooks/useArtworkChat';
import useAutoScrollToEnd from '@/hooks/useAutoScrollToEnd';
import useRoomMessageHandler from '@/hooks/useRoomMessageHandler';
import useChatMessages from '@/services/queries/useChatMessages';
import getAuthToken from '@/utils/getToken';
import type { IncomingChat } from '@/types/chat';

export default function ArtworkPage() {
  const { state } = useLocation() as { state: { paintingId: number; imgUrl?: string; title?: string; artist?: string } };
  const { paintingId, imgUrl, title = '작품', artist = '' } = state;

  // 초기 서버 저장 메시지 불러오기
  const { data: chatMessages } = useChatMessages(paintingId);
  const initial = useMemo(() => (chatMessages ?? []).map(m => ({
    id: nanoid(), content: m.content, sender: m.sender as 'USER' | 'BOT', type: 'TEXT' as const,
  })), [chatMessages]);

  // 로컬/타자/보이스 등 복합 채팅 훅
  const {
    localMessages, setLocalMessages, typing, submitAsk, startVoice,
    promptText, voiceDisabled, didAutoAskRef, startTypewriter, speak,
  } = useArtworkChat({ paintingId, onError: () => {/* toast */} });

  // 방 이벤트 처리 핸들러(이미지 분석 등)
  const onRoomMessage = useRoomMessageHandler({
    paintingId, artworkInfo: { imgUrl }, processedIdsRef: useRef(new Set<string>()),
    setLocalMessages, startTypewriter, speak,
  });

  // STOMP 연결 + 룸 토픽 구독
  const token = getAuthToken();
  const { connected, messages: wsMessages } = useStompChat({
    paintingId, token, topic: `/topic/llm.${paintingId}`, onRoomMessage,
  });

  const wsList = wsMessages.map((m: IncomingChat) => ({
    id: m.id ?? nanoid(), sender: m.sender, content: m.content, type: 'TEXT' as const,
  }));

  const endRef = useRef<HTMLDivElement>(null);
  useAutoScrollToEnd([chatMessages, wsMessages, localMessages, typing], endRef);

  return (
    <>
      {/* MessageList에 initial/ws/local/typing 전달 */}
      {/* footer: 음성 startVoice 버튼, 키보드 입력 토글/ChatInputBar */}
      {/* promptText: 연결 상태/가이드 문구 표시 */}
    </>
  );
}
```

</details>

<details>
  <summary><h3>프론트엔드 발췌 저장(스크랩)</h3></summary>

```tsx
import { useQueryClient } from '@tanstack/react-query';
import useSaveScrap from '@/services/mutations/useSaveScrap';
import dateKST from '@/utils/dateKST';

const queryClient = useQueryClient();
const { mutate: saveScrap, isPending: saving } = useSaveScrap();

function handleSaveExcerpt(quote: string, paintingId: number, exhibition: string, artist: string) {
  const excerpt = quote.trim();
  if (!excerpt) return /* toast: 없음 */;

  saveScrap(
    { paintingId, date: dateKST(), excerpt, location: exhibition, artist },
    {
      onSuccess: () => {
        // 토스트 후 최신 리스트 재조회
        queryClient.invalidateQueries({ queryKey: ['recentViewedArtworks'] });
        queryClient.invalidateQueries({ queryKey: ['scrapsByExhibition'] });
      },
      onError: () => { /* toast: 실패 */ },
    },
  );
}
```

</details>

<details>
  <summary><h3>모델 동공</h3></summary>

```Python
import os
import time
import cv2
import dlib
import joblib
import numpy as np
from typing import Dict, Tuple, Optional, List
from sklearn.ensemble import RandomForestClassifier

# ==============================
# 0) 전역 설정
# ==============================
MODE = os.getenv("MODE", "predict")  # 'collect' or 'predict'
PREDICTOR_PATH = os.getenv("DLIB_PREDICTOR", "shape_predictor_68_face_landmarks.dat")

# 화면 4분할(2x2)
SCREEN_ZONES: Dict[int, str] = {
    1: "Top-Left",
    2: "Top-Right",
    3: "Bot-Left",
    4: "Bot-Right"
}
SCREEN_WIDTH, SCREEN_HEIGHT = 1280, 720   # UI 디스플레이 캔버스 크기
SAMPLES_PER_ZONE = 20                      # 각 구역 수집 샘플 수
MODEL_PATH = "gaze_model.pkl"              # 학습 모델 경로

# dlib 구성
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(PREDICTOR_PATH)

# ==============================
# 1) 특징 추출 유틸 함수
# ==============================
def get_eye_keypoints(
    shape: dlib.full_object_detection,
    gray_frame: np.ndarray,
    eye_points_indices: List[int]
) -> Tuple[Optional[Tuple[int, int]], Optional[Tuple[int, int]], Optional[Tuple[int, int]], Optional[Tuple[int, int]]]:
    """
    얼굴 특징점에서 눈 영역을 잘라 CLAHE+AdaptiveThreshold로 이진화 후,
    동공(pupil)과 글린트(glint) 좌표를 구한다.
    반환: (inner_corner, outer_corner, pupil_center, glint_center)
           - 좌표는 (x, y) 또는 None
    """
    eye_points = np.array([(shape.part(i).x, shape.part(i).y) for i in eye_points_indices], dtype=np.int32)
    x, y, w, h = cv2.boundingRect(eye_points)
    if w == 0 or h == 0:
        return None, None, None, None

    eye_roi = gray_frame[y:y + h, x:x + w]

    # 안쪽/바깥쪽 눈꼬리 (index는 68-landmark 기준)
    inner_corner = (shape.part(eye_points_indices[3]).x, shape.part(eye_points_indices[3]).y)
    outer_corner = (shape.part(eye_points_indices[0]).x, shape.part(eye_points_indices[0]).y)

    # 대비 향상
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    eye_roi = clahe.apply(eye_roi)

    # 이진화 (동공 후보 추출)
    threshold_eye = cv2.adaptiveThreshold(
        eye_roi, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV, 11, 2
    )
    contours, _ = cv2.findContours(threshold_eye, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    # 원형성(circularity)과 면적 제한으로 동공 후보 선택
    pupil_contour = None
    max_circularity = 0.0
    for c in contours:
        area = cv2.contourArea(c)
        if area == 0:
            continue
        perimeter = cv2.arcLength(c, True)
        if perimeter == 0:
            continue
        circularity = 4 * np.pi * (area / (perimeter * perimeter))
        # 경험적 범위 (튜닝 포인트): 원형성 0.7~1.2, 면적 15~400
        if 0.7 < circularity < 1.2 and 15 < area < 400:
            if circularity > max_circularity:
                max_circularity = circularity
                pupil_contour = c

    pupil_center: Optional[Tuple[int, int]] = None
    if pupil_contour is not None:
        M = cv2.moments(pupil_contour)
        if M['m00'] != 0:
            cx = int(M['m10'] / M['m00']) + x
            cy = int(M['m01'] / M['m00']) + y
            pupil_center = (cx, cy)

    # 글린트(하이라이트)는 eye_roi에서 가장 밝은 지점 (간단 추정)
    glint_center: Optional[Tuple[int, int]] = None
    if eye_roi.size > 0:
        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(eye_roi)
        # max_val 임계치(예: > 180)는 조명/노이즈에 따라 조정 필요
        if max_val > 180:
            glint_center = (max_loc[0] + x, max_loc[1] + y)

    return inner_corner, outer_corner, pupil_center, glint_center


def calculate_features(
    left_eye: Tuple[Optional[Tuple[int, int]], Optional[Tuple[int, int]], Optional[Tuple[int, int]], Optional[Tuple[int, int]]],
    right_eye: Tuple[Optional[Tuple[int, int]], Optional[Tuple[int, int]], Optional[Tuple[int, int]], Optional[Tuple[int, int]]]
) -> Optional[np.ndarray]:
    """
    논문/경험 기반의 6계열 특징(벡터+거리/각도)을 조합하여 하나의 feature vector로 만든다.
    입력: 각 눈에 대해 (inner_corner, outer_corner, pupil, glint)
    출력: feature_vector (np.ndarray) 또는 None
    """
    if not all(p is not None for eye in [left_eye, right_eye] for p in eye):
        return None

    l_inner, _, l_pupil, l_glint = left_eye
    r_inner, _, r_pupil, r_glint = right_eye

    l_pupil, l_glint, l_inner = np.array(l_pupil), np.array(l_glint), np.array(l_inner)
    r_pupil, r_glint, r_inner = np.array(r_pupil), np.array(r_glint), np.array(r_inner)

    # 벡터 구성
    vec_l_pg = l_pupil - l_glint
    vec_r_pg = r_pupil - r_glint
    vec_l_pc = l_pupil - l_inner
    vec_r_pc = r_pupil - r_inner
    vec_l_gc = l_glint - l_inner
    vec_r_gc = r_glint - r_inner
    vec_cc = l_inner - r_inner

    # 거리/각도
    dist_cc = np.linalg.norm(vec_cc)
    cos_theta_l = np.dot(vec_l_pg, vec_l_gc) / (np.linalg.norm(vec_l_pg) * np.linalg.norm(vec_l_gc) + 1e-6)
    theta_l = np.arccos(np.clip(cos_theta_l, -1.0, 1.0))
    cos_theta_r = np.dot(vec_r_pg, vec_r_gc) / (np.linalg.norm(vec_r_pg) * np.linalg.norm(vec_r_gc) + 1e-6)
    theta_r = np.arccos(np.clip(cos_theta_r, -1.0, 1.0))
    diff_cc = np.arctan2(vec_cc[1], vec_cc[0])

    feature_vector = np.concatenate([
        vec_l_pg, [np.linalg.norm(vec_l_pg)],
        vec_r_pg, [np.linalg.norm(vec_r_pg)],
        vec_l_pc, [np.linalg.norm(vec_l_pc)],
        vec_r_pc, [np.linalg.norm(vec_r_pc)],
        vec_l_gc, [np.linalg.norm(vec_l_gc)],
        vec_r_gc, [np.linalg.norm(vec_r_gc)],
        [dist_cc, theta_l, theta_r, diff_cc]
    ])
    return feature_vector


# ==============================
# 2) UI/도움 함수
# ==============================
def draw_screen_zones(canvas: np.ndarray) -> np.ndarray:
    """
    2x2 그리드를 그리고, 각 구역 번호(1~4)를 표시한다.
    canvas 크기는 SCREEN_WIDTH/HEIGHT 기반.
    """
    rows, cols = 2, 2
    zone_w, zone_h = SCREEN_WIDTH // cols, SCREEN_HEIGHT // rows

    for i in range(1, rows * cols + 1):
        c = (i - 1) % cols
        r = (i - 1) // cols
        x1, y1 = c * zone_w, r * zone_h
        x2, y2 = x1 + zone_w, y1 + zone_h
        cv2.rectangle(canvas, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(canvas, str(i), (x1 + 10, y1 + 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    return canvas


def process_frame_get_features(frame: np.ndarray) -> Tuple[np.ndarray, Optional[np.ndarray]]:
    """
    프레임에서 얼굴/눈 랜드마크를 검출하고, 양 눈의 특징 벡터를 산출한다.
    - 시각화: 랜드마크(36~47), 동공/글린트 점을 원으로 표시
    - 반환: (시각화된 frame, features or None)
    """
    frame = cv2.flip(frame, 1)  # 좌우 반전(자연스러운 셀피 방향)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = detector(gray)
    features: Optional[np.ndarray] = None

    for face in faces[:1]:  # 다인 검출 시 첫 얼굴만 사용(필요 시 더 개선)
        landmarks = predictor(gray, face)

        left_eye_indices = list(range(36, 42))
        right_eye_indices = list(range(42, 48))

        left_eye_keypoints = get_eye_keypoints(landmarks, gray, left_eye_indices)
        right_eye_keypoints = get_eye_keypoints(landmarks, gray, right_eye_indices)

        # 디버그 표시: 눈 랜드마크 + 동공(빨강)/글린트(파랑)
        for i in range(36, 48):
            lx, ly = landmarks.part(i).x, landmarks.part(i).y
            cv2.circle(frame, (lx, ly), 2, (0, 255, 0), -1)
        if left_eye_keypoints[2]:
            cv2.circle(frame, left_eye_keypoints[2], 3, (0, 0, 255), -1)
        if left_eye_keypoints[3]:
            cv2.circle(frame, left_eye_keypoints[3], 3, (255, 0, 0), -1)
        if right_eye_keypoints[2]:
            cv2.circle(frame, right_eye_keypoints[2], 3, (0, 0, 255), -1)
        if right_eye_keypoints[3]:
            cv2.circle(frame, right_eye_keypoints[3], 3, (255, 0, 0), -1)

        # 특징 벡터 계산
        features = calculate_features(left_eye_keypoints, right_eye_keypoints)

    return frame, features


def ensure_display_canvas() -> np.ndarray:
    """
    예측/수집 안내 UI를 그릴 흑색 캔버스를 생성하고, 4구역 라인을 그린다.
    """
    display_frame = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
    return draw_screen_zones(display_frame)


# ==============================
# 3) 데이터 수집/학습/예측 루프
# ==============================
def collect_loop(cap: cv2.VideoCapture):
    """
    [COLLECT] 스페이스바로 현재 응시 구역의 샘플을 수집.
    - 각 구역 SAMPLES_PER_ZONE 만큼 모이면 자동으로 다음 구역
    - 's'를 누르면 학습+저장 (단, 모든 구역 수집이 완료되어야 함)
    """
    features_data: List[np.ndarray] = []
    labels_data: List[int] = []

    current_zone = 1
    collected_counts = {i: 0 for i in range(1, 5)}

    print("--- 데이터 수집 모드 ---")
    print(f"각 구역을 응시한 상태에서 '스페이스바'로 데이터를 {SAMPLES_PER_ZONE}개씩 수집합니다.")
    print("구역별 수집이 완료되면 자동으로 다음 구역으로 넘어갑니다.")

    while True:
        ok, frame = cap.read()
        if not ok:
            break

        vis_frame, features = process_frame_get_features(frame)
        display_frame = ensure_display_canvas()

        if current_zone <= 4:
            count = collected_counts[current_zone]
            text = f"Look at Zone [{current_zone}]  ({count}/{SAMPLES_PER_ZONE})  Press SPACE"
        else:
            text = "Collection Complete! Press 's' to train & save."
        cv2.putText(display_frame, text, (50, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

        cv2.imshow("Webcam Feed", vis_frame)
        cv2.imshow("Gaze Interface", display_frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break

        # 스페이스: 현재 구역 샘플 수집
        if key == ord(' ') and features is not None and current_zone <= 4:
            if collected_counts[current_zone] < SAMPLES_PER_ZONE:
                features_data.append(features)
                labels_data.append(current_zone)
                collected_counts[current_zone] += 1
                print(f"[Zone {current_zone}] {collected_counts[current_zone]}/{SAMPLES_PER_ZONE}")

            # 현 구역 수집 완료 → 다음 구역으로
            if collected_counts[current_zone] == SAMPLES_PER_ZONE:
                print(f"Zone {current_zone} 수집 완료")
                current_zone += 1

        # 's': 전체 수집 완료 후 학습/저장
        if key == ord('s'):
            if all(v == SAMPLES_PER_ZONE for v in collected_counts.values()):
                train_and_save(np.array(features_data), np.array(labels_data), MODEL_PATH)
            else:
                print("⚠ 아직 모든 구역 수집이 끝나지 않았습니다.")

    print("[COLLECT] 종료")


def train_and_save(X: np.ndarray, y: np.ndarray, model_path: str):
    """
    RandomForest로 학습 후 모델 저장.
    """
    print("\n--- Training Model ---")
    model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X, y)
    joblib.dump(model, model_path)
    print(f"Model saved → {model_path}")


def predict_loop(cap: cv2.VideoCapture):
    """
    [PREDICT] 실시간 시선 구역 예측. 학습된 모델(gaze_model.pkl)이 필요하다.
    """
    # 모델 로드
    try:
        model: RandomForestClassifier = joblib.load(MODEL_PATH)
        print("--- 실시간 예측 모드 ---")
    except FileNotFoundError:
        print(f"오류: 모델 파일({MODEL_PATH})을 찾을 수 없습니다. 먼저 MODE='collect'로 학습하세요.")
        return

    while True:
        ok, frame = cap.read()
        if not ok:
            break

        vis_frame, features = process_frame_get_features(frame)
        display_frame = ensure_display_canvas()

        # 예측
        if features is not None:
            pred_zone: int = int(model.predict([features])[0])
            zone_name = SCREEN_ZONES.get(pred_zone, "Unknown")
            text = f"Gaze Prediction: Zone {pred_zone} ({zone_name})"
            cv2.putText(display_frame, text, (50, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 3)

        cv2.imshow("Webcam Feed", vis_frame)
        cv2.imshow("Gaze Interface", display_frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break

    print("[PREDICT] 종료")


# ==============================
# 4) 엔트리포인트
# ==============================
def main():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("error: 카메라를 열 수 없습니다.")
        return

    try:
        if MODE == "collect":
            collect_loop(cap)
        elif MODE == "predict":
            predict_loop(cap)
        else:
            print(f"알 수 없는 MODE: {MODE} (collect|predict 중 선택)")
    finally:
        cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
```
</details>

<details>
  <summary><h3>모델</h3></summary>

```Python
import os
import cv2
import json
import time
import torch
import faiss
import requests
import numpy as np
from typing import Tuple, Optional
from pathlib import Path
from PIL import Image
from ultralytics import YOLO
from transformers import CLIPProcessor, CLIPModel

# -------------------------------------------------
# 0) 기본 설정
# -------------------------------------------------
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

YOLO_WEIGHTS = "yolov8n.pt"
CLIP_ID = "openai/clip-vit-base-patch32"
FAISS_INDEX = "./data/faiss/met_text.index"
FAISS_META  = "./data/faiss/met_structured_with_objects.json"
BACKEND_URL = "http://3.34.240.201:8000"
REQUEST_TIMEOUT = 5

ART_CLASSES = {"tv", "book", "laptop", "cell phone", "remote", "keyboard", "monitor"}
MIN_CONF = 0.25             # YOLO 최소 신뢰도
SELECTED_Q_DEFAULT = "Q1"   # /detect-area 기본 Q
DEVICE = ("cuda" if torch.cuda.is_available()
          else ("mps" if torch.backends.mps.is_available() else "cpu"))

# -------------------------------------------------
# 1) 모델/리소스 로드
# -------------------------------------------------
def load_models() -> Tuple[YOLO, CLIPModel, CLIPProcessor, dict, faiss.Index, list]:
    """YOLO/CLIP/FAISS/메타 로드 후 반환"""
    yolo_model = YOLO(YOLO_WEIGHTS)

    clip_model = CLIPModel.from_pretrained(CLIP_ID).to(DEVICE)
    clip_processor = CLIPProcessor.from_pretrained(CLIP_ID)

    index = faiss.read_index(FAISS_INDEX)
    with open(FAISS_META, "r", encoding="utf-8") as f:
        image_meta = json.load(f)

    model_classes = yolo_model.model.names  # id->label 매핑
    return yolo_model, clip_model, clip_processor, model_classes, index, image_meta

# -------------------------------------------------
# 2) 임베딩/검색/전송 유틸
# -------------------------------------------------
def embed_crop(image_bgr: np.ndarray, clip_model: CLIPModel, clip_processor: CLIPProcessor) -> np.ndarray:
    """
    crop(BGR) → CLIP 임베딩(float32, L2정규화)
    """
    rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    pil = Image.fromarray(rgb)
    inputs = clip_processor(images=pil, return_tensors="pt", padding=True).to(DEVICE)
    with torch.no_grad():
        emb = clip_model.get_image_features(**inputs)
        emb = emb / emb.norm(p=2, dim=-1, keepdim=True)
    return emb[0].detach().cpu().numpy().astype("float32")

def search_faiss(vec: np.ndarray, index: faiss.Index, meta: list) -> Tuple[str, float]:
    """
    CLIP 벡터→FAISS 검색→ (art_id, score) 반환
    주의: index metric에 따라 score 해석 상이(L2=작을수록 유사 / IP=클수록 유사)
    """
    D, I = index.search(vec.reshape(1, -1), k=1)
    idx = int(I[0][0])
    art_id = str(meta[idx]["full_image_id"])
    return art_id, float(D[0][0])

def post_backend_art(art_id: str) -> Optional[int]:
    """ /process-image?art_id=... POST """
    url = f"{BACKEND_URL}/process-image?art_id={art_id}"
    try:
        res = requests.post(url, timeout=REQUEST_TIMEOUT)
        print(f"[POST] {url} → {res.status_code}")
        return res.status_code
    except requests.RequestException as e:
        print("[WARN] POST 실패:", e)
        return None

def post_backend_area(art_id: str, q: str) -> Optional[int]:
    """ /process-image?art_id=...&q=Qx POST """
    url = f"{BACKEND_URL}/process-image?art_id={art_id}&q={q}"
    try:
        res = requests.post(url, timeout=REQUEST_TIMEOUT)
        print(f"[POST] {url} → {res.status_code}")
        return res.status_code
    except requests.RequestException as e:
        print("[WARN] POST 실패:", e)
        return None

# -------------------------------------------------
# 3) 탐지 로직
# -------------------------------------------------
def detect_top_art(
    frame_bgr: np.ndarray,
    yolo_model: YOLO,
    model_classes: dict
) -> Optional[Tuple[str, float, Tuple[int, int, int, int]]]:
    """
    프레임에서 관심 라벨만 필터링 후, conf가 가장 높은 1개를 반환.
    반환: (label, conf, (x1,y1,x2,y2)) 또는 None
    """
    results = yolo_model(frame_bgr, verbose=False)[0]
    if results.boxes is None:
        return None

    candidates = []
    for box in results.boxes:
        cls_id = int(box.cls[0])
        label = model_classes[cls_id]
        conf = float(box.conf[0].item()) if box.conf is not None else 0.0
        if label in ART_CLASSES and conf >= MIN_CONF:
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            candidates.append((label, conf, (x1, y1, x2, y2)))

    if not candidates:
        return None

    # 최고 신뢰도 1개 선택
    candidates.sort(key=lambda x: x[1], reverse=True)
    return candidates[0]

# -------------------------------------------------
# 4) 시각화 헬퍼
# -------------------------------------------------
def draw_detection(frame: np.ndarray, label: str, art_id: str, score: float, box: Tuple[int, int, int, int]):
    """박스와 라벨/ID/스코어 오버레이"""
    x1, y1, x2, y2 = box
    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 200, 0), 2)
    cv2.putText(frame, f"{label}: {art_id} ({score:.2f})",
                (x1, max(0, y1 - 8)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (20, 80, 255), 2)

# -------------------------------------------------
# 5) 실행 루프
# -------------------------------------------------
def run_loop(mode: str = "art", selected_q: str = SELECTED_Q_DEFAULT):
    """
    카메라 열고 프레임 처리 → 첫 감지 1건만 전송 후 종료.
    mode: 'art' | 'area'
    """
    # 리소스 로드
    yolo_model, clip_model, clip_processor, model_classes, index, image_meta = load_models()

    # 모드 확인
    mode = mode.lower().strip()
    if mode not in ("art", "area"):
        print("error: 잘못된 모드입니다. 'art' 또는 'area' 중 선택.")
        return

    # 카메라 시작
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("error: 카메라를 열 수 없습니다.")
        return

    latest_painting_id = None

    try:
        while True:
            ok, frame = cap.read()
            if not ok:
                break

            # YOLO 탐지 → 최고 conf 1개
            picked = detect_top_art(frame, yolo_model, model_classes)
            found = picked is not None

            if found:
                label, conf, (x1, y1, x2, y2) = picked
                crop = frame[y1:y2, x1:x2]
                if crop.size == 0:
                    found = False
                else:
                    # CLIP 임베딩 → FAISS
                    vec = embed_crop(crop, clip_model, clip_processor)
                    art_id, score = search_faiss(vec, index, image_meta)
                    latest_painting_id = art_id

                    # 그리기
                    draw_detection(frame, label, art_id, score, (x1, y1, x2, y2))

            cv2.imshow("Art-Like Detection + FAISS", frame)

            # 감지되면 백엔드 전송하고 종료
            if found and latest_painting_id:
                print(f"감지된 그림 ID: {latest_painting_id}")
                if mode == "art":
                    post_backend_art(latest_painting_id)
                else:
                    post_backend_area(latest_painting_id, selected_q)
                break

            # 종료 키
            if (cv2.waitKey(1) & 0xFF) == ord('q'):
                break

    finally:
        cap.release()
        cv2.destroyAllWindows()

    if latest_painting_id:
        print("명령 실행 후 프로그램을 종료합니다.")
    else:
        print("프로그램을 정상 종료했습니다.")

# -------------------------------------------------
# 6) 엔트리포인트
# -------------------------------------------------
if __name__ == "__main__":
    # 기존과 동일하게 입력으로 모드 선택
    cmd = input("먼저 명령어를 입력하세요 (/detect-art 또는 /detect-area): ").strip().lower()
    if cmd.startswith("/detect-art"):
        run_loop("art", SELECTED_Q_DEFAULT)
    elif cmd.startswith("/detect-area"):
        run_loop("area", SELECTED_Q_DEFAULT)  # 필요 시 selected_q를 동적으로 바꿔도 됨
    else:
        print("error:잘못된 명령입니다. 프로그램을 종료합니다.")

```
</details>
