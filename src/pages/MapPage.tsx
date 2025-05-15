import { useEffect, useState } from 'react';

import { Container as MapDiv, NaverMap, Marker } from 'react-naver-maps';

export default function MapPage() {
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
    <MapDiv style={{ width: '100%', height: '100vh' }}>
      {myLocation && (
        <NaverMap defaultCenter={myLocation} defaultZoom={16}>
          {/* 현재 위치 마커 */}
          <Marker
            position={myLocation}
            icon={{
              content:
                '<div style="width:16px;height:16px;background:#000;border-radius:50%;"></div>',
            }}
          />

          {/* 전시장 마커들 */}
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
  );
}
