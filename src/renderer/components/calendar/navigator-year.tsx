import { FCalendar } from '@/renderer/commons/interfaces';
import { useState } from 'react';

export default function NavigatorYear(props: {
  calendar: FCalendar;
  year: number;
  navigateYear: (year: number) => void;
}) {
  const [year, setYear] = useState<number>(props.year);

  return (
    <div className="flex items-center justify-center gap-3 p-3 bg">
      <button
        className="material-symbols-rounded cursor-pointer button button-primary shadow-md"
        style={{ padding: '4px' }}
        onClick={() => {
          if (year > 0) {
            setYear(year - 1);
            props.navigateYear(year - 1);
          }
        }}
      >
        keyboard_arrow_left
      </button>
      Year
      <input
        className="text-right"
        type="number"
        value={year + 1}
        style={{ width: '150px' }}
        onChange={(e) => {
          if (Number(e.currentTarget.value) <= 0) {
            setYear(0);
            return;
          }
          const newYear = Number(e.currentTarget.value) - 1;
          setYear(newYear);
        }}
        onKeyDown={(e) => e.key === 'Enter' && props.navigateYear(year)}
        onBlur={() => props.navigateYear(year)}
      />
      <button
        className="material-symbols-rounded cursor-pointer button button-primary shadow-md"
        style={{ padding: '4px' }}
        onClick={() => {
          setYear(year + 1);
          props.navigateYear(year + 1);
        }}
      >
        keyboard_arrow_right
      </button>
    </div>
  );
}
