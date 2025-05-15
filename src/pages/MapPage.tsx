import { useEffect, useState } from 'react';

import { Container as MapDiv, NaverMap, Marker } from 'react-naver-maps';

import mapIcon from '@/assets/icons/sheet-map.svg';
import map1 from '@/assets/images/sample/map1.png';
import map2 from '@/assets/images/sample/map2.png';
import map3 from '@/assets/images/sample/map3.png';
import DraggableBottomSheet from '@/components/bottomsheet/DraggableBottomSheet';
import SearchBar from '@/components/map/SearchBar';
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
    { id: 1, lat: 37.5864, lng: 127.0301 },
    { id: 2, lat: 37.5878, lng: 127.0322 },
    { id: 3, lat: 37.585, lng: 127.029 },
  ];

  return (
    <div className="relative w-full h-[100vh]">
      <MapDiv className="w-full h-full">
        {myLocation && (
          <NaverMap defaultCenter={myLocation} defaultZoom={16}>
            <Marker
              position={myLocation}
              icon={{
                content:
                  '<div style="width:16px;height:16px;background:#000;border-radius:50%;"></div>',
              }}
            />
            {markers.map(marker => (
              <Marker
                key={marker.id}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={{
                  content: `
                    <div style="
                      width: 24px;
                      height: 24px;
                      background: black;
                      border-radius: 50%;
                      border: 4px solid white;
                      box-shadow: 0 0 5px rgba(0,0,0,0.3);
                    "></div>
                  `,
                }}
              />
            ))}
          </NaverMap>
        )}
      </MapDiv>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] px-4 z-20">
        <div className="space-y-2 mt-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            onSubmit={() => console.log('검색 실행:', search)}
            placeholder="원하시는 전시를 검색해보세요!"
            className="w-full"
          />
          <div className="flex gap-2 overflow-x-auto">
            {EXHIBITION_FILTER_TAGS.map(tag => (
              <div
                key={tag}
                className="shrink-0 w-26 h-8 cursor-pointer bg-white mb-2 hover:bg-lightGray-hover active:bg-lightGray-active rounded-lg px-3 py-1 flex items-center gap-2 shadow-md"
              >
                <div className="w-4 h-4 bg-zinc-300 rounded-sm" />
                <span className="text-sm text-neutral-600 font-medium">
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DraggableBottomSheet height={80} minHeight={10}>
        <div className="px-4 py-2 mb-6">
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
                  <span>{exhibition.place}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DraggableBottomSheet>
    </div>
  );
}
