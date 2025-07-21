export {};

declare global {
  namespace naver.maps {
    interface Coord {
      lat: number;
      lng: number;
    }

    interface PointerEvent {
      coord: Coord;
    }
  }
}
