import { useParams } from 'react-router-dom';

import BackButton from '@/components/common/BackButton';

export default function ExhibitionDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex h-[100vh] max-h-[100vh] flex-col items-center justify-between bg-white px-2 py-7 text-black">
      <BackButton />
      <h1 className="mb-2 text-2xl font-bold">전시 상세 페이지</h1>
      <p className="text-lg">전시 ID: {id}</p>
      <p className="mt-4 text-sm text-gray-500">
        이곳에 상세 정보가 표시됩니다.
      </p>
    </div>
  );
}
