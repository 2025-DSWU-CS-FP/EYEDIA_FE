import { useEffect, useState } from 'react';

import { Container as MapDiv, NaverMap, Marker } from 'react-naver-maps';

import SearchBar from '@/components/map/SearchBar';
import EXHIBITION_FILTER_TAGS from '@/constants/filters';

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
    <div className="relative w-full h-[100dvh]">
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

      <div className="absolute w-full max-w-[93%] space-y-2 mx-auto top-10 left-1/2 -translate-x-1/2 flex flex-col">
        <SearchBar
          value={search}
          onChange={setSearch}
          onSubmit={() => console.log('검색 실행:', search)}
          placeholder="원하시는 전시를 검색해보세요!"
          className="w-full z-10"
        />
        <div className="flex max-w-[100%] mx-auto gap-2 overflow-x-auto">
          {EXHIBITION_FILTER_TAGS.map(tag => (
            <div
              key={tag}
              className="shrink-0 w-26 h-8 cursor-pointer bg-white hover:bg-lightGray-hover active:bg-lightGray-active rounded-lg px-3 py-1 flex items-center gap-2 shadow-md mb-2 mx-1"
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
  );
}
