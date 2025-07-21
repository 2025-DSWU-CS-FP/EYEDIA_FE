import { useParams } from 'react-router-dom';

import BackButton from '@/components/common/BackButton';

export default function ExhibitionDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-h-[100vh] h-[100vh] flex flex-col items-center justify-between py-7 px-2 bg-white text-black">
      <BackButton />
      <h1 className="text-2xl font-bold mb-2">전시 상세 페이지</h1>
      <p className="text-lg">전시 ID: {id}</p>
      <p className="text-sm text-gray-500 mt-4">
        이곳에 상세 정보가 표시됩니다.
      </p>
    </div>
  );
}
