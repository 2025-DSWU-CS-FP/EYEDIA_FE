import { useEffect, useState } from 'react';

import { Container as MapDiv, NaverMap, Marker } from 'react-naver-maps';

import mapIcon from '@/assets/icons/sheet-map.svg';
import map1 from '@/assets/images/sample/map1.png';
import map2 from '@/assets/images/sample/map2.png';
import map3 from '@/assets/images/sample/map3.png';
import DraggableBottomSheet from '@/components/bottomsheet/DraggableBottomSheet';
import LoopLoading from '@/components/common/LoopLoading';
import SearchBar from '@/components/map/SearchBar';
import FILTER_COLORS from '@/constants/filterColors';
import EXHIBITION_FILTER_TAGS from '@/constants/filters';

export const EXHIBITIONS = [
  {
    id: 1,
    title: '전시의 전시',
    date: '2025.09.04. – 2026.01.04.',
    place: '국립현대미술관',
    distance: '1.9km',
    image: map1,
  },
  {
    id: 2,
    title: '모두에게 멋진 날들',
    date: '2025.09.04. – 2026.01.04.',
    place: '국립현대미술관',
    distance: '2.5km',
    image: map2,
  },
  {
    id: 3,
    title: '전시 3',
    date: '2025.09.04. – 2026.01.04.',
    place: '국립현대미술관',
    distance: '3.1km',
    image: map3,
  },
];

export default function MapPage() {
  const [search, setSearch] = useState('');
  const [address, setAddress] = useState('');
  const [, setIsMapReady] = useState(false);
  const [myLocation, setMyLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('이 브라우저에서는 위치 기능을 사용할 수 없습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setMyLocation({ lat: latitude, lng: longitude });
      },
      err => {
        console.error('위치 접근 실패:', err);
        alert('위치 정보를 가져오는 데 실패했습니다.');
      },
    );
  }, []);

  const markers = [
    {
      id: 1,
      name: '응접소파전시장',
      lat: 35.18654444,
      lng: 129.1224847,
    },
    {
      id: 2,
      name: '민들레소극장',
      lat: 35.14968814,
      lng: 126.9190813,
    },
    {
      id: 3,
      name: '이펙스전시장',
      lat: 35.23411313,
      lng: 128.8795125,
    },
    {
      id: 4,
      name: '미용기구전시장',
      lat: 35.5559254,
      lng: 129.3240879,
    },
    {
      id: 5,
      name: '미다갤러리',
      lat: 35.14895193,
      lng: 126.9185625,
    },
    {
      id: 6,
      name: '굴레소극장',
      lat: 37.88317524,
      lng: 127.7276523,
    },
    {
      id: 7,
      name: '동서아트갤러리',
      lat: 35.62238903,
      lng: 129.3556368,
    },
    {
      id: 8,
      name: '갤러리원',
      lat: 37.47442819,
      lng: 127.0408609,
    },
    {
      id: 9,
      name: '국립현대미술관',
      lat: 37.5787817,
      lng: 126.9800492,
    },
    {
      id: 10,
      name: '국립중앙박물관',
      lat: 37.5240867,
      lng: 126.980388,
    },
    {
      id: 11,
      name: '서울시립미술관',
      lat: 37.5641111,
      lng: 126.97368,
    },
    {
      id: 12,
      name: '리움미술관',
      lat: 37.5384613,
      lng: 126.9992941,
    },
    {
      id: 13,
      name: 'K현대미술관',
      lat: 37.5242986,
      lng: 127.0390958,
    },
  ];

  const handleMapClick = (e: naver.maps.PointerEvent) => {
    const lat = e.coord.y;
    const lng = e.coord.x;

    fetch(
      `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${lng},${lat}&orders=roadaddr,addr&output=json`,
      {
        method: 'GET',
        headers: {
          'X-NCP-APIGW-API-KEY-ID': `${import.meta.env.VITE_NAVER_MAPS_KEY}`,
          'X-NCP-APIGW-API-KEY': `${import.meta.env.VITE_NAVER_MAPS_API_KEY}`,
        },
      },
    )
      .then(response => response.json())
      .then(data => {
        const result = data?.results?.[0];
        if (
          result?.region?.area1?.name &&
          result.region.area2?.name &&
          result.region.area3?.name
        ) {
          const fetchedAddress = `${result.region.area1.name} ${result.region.area2.name} ${result.region.area3.name}`;
          setAddress(fetchedAddress);
        }
      })
      .catch(error => {
        console.error('Error fetching address:', error);
      });
  };

  if (!myLocation) {
    return <LoopLoading />;
  }

  return (
    <div className="relative w-full h-[100vh]">
      <MapDiv className="w-full h-full select-none">
        {myLocation && (
          <NaverMap
            onClick={handleMapClick}
            defaultCenter={myLocation}
            defaultZoom={16}
            onLoad={() => setIsMapReady(true)}
          >
            <Marker
              position={myLocation}
              icon={{
                content: `
                  <div style="
                    position: relative;
                    width: 40px;
                    height: 40px;
                    background: #A7A7A730;
                    border-radius: 50%;
                  ">
                    <div style="
                      position: absolute;
                      top: -1px;
                      left: 50%;
                      transform: translateX(-50%);
                      width: 0;
                      height: 0;
                      border-radius: 1px;
                      border-left: 6px solid transparent;
                      border-right: 6px solid transparent;
                      border-bottom: 10px solid #222;
                    "></div>
                    <div style="
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      width: 17px;
                      height: 17px;
                      background: #000;
                      border: 3px solid white;
                      border-radius: 50%;
                      box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
                    "></div>
                  </div>
                `,
              }}
            />

            {markers.map(marker => (
              <Marker
                key={marker.id}
                position={{ lat: marker.lat, lng: marker.lng }}
                title={marker.name}
                icon={{
                  content: `
                    <img 
                      src="${mapIcon}" 
                      style="
                        width: 24px; 
                        height: 24px; 
                        border-radius: 50%; 
                        transform: translateY(-10px);
                      " 
                    />
                  `,
                }}
                onClick={() => {
                  console.log(`클릭한 장소: ${marker.name}`);
                }}
              />
            ))}
          </NaverMap>
        )}
      </MapDiv>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] px-4 z-20">
        <div className="space-y-2 mt-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            onSubmit={() => console.log('검색 실행:', search)}
            placeholder="원하시는 전시를 검색해보세요!"
            className="w-full"
          />
          <div className="flex select-none gap-2 overflow-x-auto">
            {EXHIBITION_FILTER_TAGS.map(tag => (
              <div
                key={tag}
                className="shrink-0 w-26 h-8 cursor-pointer bg-white mb-2 hover:bg-lightGray-hover active:bg-lightGray-active rounded-lg px-3 py-1 flex items-center gap-2 shadow-md"
              >
                <div
                  className={`w-4 h-4 rounded-sm
                  ${FILTER_COLORS[tag] || 'bg-zinc-300'}`}
                />
                <span className="text-sm text-neutral-600 font-medium">
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DraggableBottomSheet height={80} minHeight={82}>
        <div className="px-4 py-2 mb-6 select-none">
          <h2 className="text-xl text-black font-bold mb-4">
            주변 전시 리스트
          </h2>
          {EXHIBITIONS.map(exhibition => (
            <div key={exhibition.id} className="mb-6">
              <img
                src={exhibition.image}
                alt={exhibition.title}
                className="w-full h-40 object-cover rounded-md"
              />
              <div className="flex justify-between items-center mt-2">
                <h3 className="text-lg font-semibold text-black">
                  {exhibition.title}
                </h3>
                <span className="text-red-500 text-sm font-semibold">
                  {exhibition.distance}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-neutral-500 mt-1">
                <p>{exhibition.date}</p>
                <div className="flex items-center gap-1 text-neutral-600">
                  <img src={mapIcon} alt="지도" />
                  <span className="cursor-pointer hover:underline">
                    {exhibition.place}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DraggableBottomSheet>
      <div className="fixed select-none -z-10 bottom-2 left-2 bg-white/100 px-3 py-1 rounded shadow">
        <span className="text-sm text-black/100">선택된 주소: {address}</span>
      </div>
    </div>
  );
}
