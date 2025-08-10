import emptyIcon from '@/assets/icons/empty.svg';

interface EmptyProps {
  title: string;
  description?: string;
}

function Empty({ title, description }: EmptyProps) {
  return (
    <div className="mt-[2.4rem] flex flex-col items-center justify-center">
      <img src={emptyIcon} alt="no data" className="w-[13rem]" />
      <div className="text-center">
        <h3 className="mt-[2.4rem] text-t5 text-gray-50">{title}</h3>
        <p className="mt-[0.8rem] text-ct4 text-gray-40">{description}</p>
      </div>
    </div>
  );
}

export default Empty;
