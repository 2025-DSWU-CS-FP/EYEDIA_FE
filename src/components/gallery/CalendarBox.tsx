interface CalendarBoxProps {
  month?: string;
  date?: string;
}

export default function CalendarBox({
  month = '5월',
  date = '22일',
}: CalendarBoxProps) {
  return (
    <div className="overflow-hidden rounded-lg shadow">
      <div className="h-[7.7rem] w-[6.9rem] overflow-hidden rounded-[0.8rem] bg-white">
        <div className="flex h-[3.2rem] items-center justify-center rounded-t-[0.8rem] bg-blue-500">
          <p className="text-[1.4rem] font-semibold leading-[1.96rem] text-white">
            {month}
          </p>
        </div>
        <div className="flex h-[4.5rem] items-center justify-center">
          <p className="text-[1.8rem] font-semibold leading-[2.52rem] text-blue-500">
            {date}
          </p>
        </div>
      </div>
    </div>
  );
}
