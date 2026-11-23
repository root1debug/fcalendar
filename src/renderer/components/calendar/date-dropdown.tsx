import { FCalendar, FDate } from '@/renderer/commons/interfaces';
import { useEffect, useState } from 'react';

export function DateDropdown(props: {
  calendar: FCalendar;
  date: FDate;
  direction?: 'bottom' | 'top';
  disable?: boolean;
  onChange: (date: FDate) => void;
}) {
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);
  const [year, setYear] = useState<number>(props.date.year);
  const [month, setMonth] = useState<number>(props.date.month);
  const [day, setDay] = useState<number>(props.date.day);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.month-dropdown')) {
        setIsMonthOpen(false);
      }
      if (!target.closest('.day-dropdown')) {
        setIsDayOpen(false);
      }
    };
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    setYear(props.date.year);
    setMonth(props.date.month);
    setDay(props.date.day);
  }, [props.date]);

  const handleOnYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value);
    setYear(newYear - 1);
    props.onChange({ year: newYear, month, day });
  };

  const handleOnMonthChange = (newMonth: number) => {
    setMonth(newMonth);
    if (props.calendar.months[newMonth] && day > props.calendar.months[newMonth].days) {
      setDay(props.calendar.months[newMonth].days);
      props.onChange({ year, month: newMonth, day: props.calendar.months[newMonth].days });
    } else {
      props.onChange({ year, month: newMonth, day });
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="number"
        value={year + 1}
        onChange={handleOnYearChange}
        disabled={props.disable}
        className={`w-20 px-2 py-1 border border-stone-300 rounded-md ${props.disable ? 'bg-stone-100' : ''}`}
      />
      <div className="relative">
        <div
          className={`w-30 px-2 py-1 border border-stone-300 rounded-md cursor-pointer month-dropdown flex items-center justify-between ${props.disable ? 'bg-stone-100' : ''}`}
          onClick={() => {
            if (!props.disable) {
              setIsMonthOpen(!isMonthOpen);
            }
          }}
        >
          {month + 1}
          <span
            className="material-symbols-rounded transition duration-120"
            style={{
              transform: isMonthOpen ? 'rotateZ(180deg)' : 'rotateZ(0deg)',
            }}
          >
            arrow_drop_down
          </span>
        </div>
        {isMonthOpen && (
          <ul
            className="absolute top-full left-0 w-full bg-white border border-stone-300 rounded-md mt-1 z-10"
            style={{
              maxHeight: '200px',
              overflowY: 'scroll',
              transform: props.direction === 'top' ? 'translateY(-242px)' : 'none',
            }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <li
                key={i}
                className="px-2 py-1 hover:bg-stone-100 cursor-pointer"
                onClick={() => {
                  handleOnMonthChange(i);
                  setIsMonthOpen(false);
                }}
              >
                {i + 1}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="relative">
        <div
          className={`w-30 px-2 py-1 border border-stone-300 rounded-md cursor-pointer day-dropdown flex items-center justify-between ${props.disable ? 'bg-stone-100' : ''}`}
          onClick={() => {
            if (!props.disable) {
              setIsDayOpen(!isDayOpen);
            }
          }}
        >
          {day + 1}
          <span
            className="material-symbols-rounded transition duration-120"
            style={{
              transform: isDayOpen ? 'rotateZ(180deg)' : 'rotateZ(0deg)',
            }}
          >
            arrow_drop_down
          </span>
        </div>
        {isDayOpen && props.calendar.months[month] && (
          <ul
            className="absolute top-full left-0 w-full bg-white border border-stone-300 rounded-md mt-1 z-10 "
            style={{
              maxHeight: '200px',
              overflowY: 'scroll',
              transform: props.direction === 'top' ? 'translateY(-242px)' : 'none',
            }}
          >
            {Array.from({ length: props.calendar.months[month].days }, (_, i) => (
              <li
                key={i}
                className="px-2 py-1 hover:bg-stone-100 cursor-pointer"
                onClick={() => {
                  setDay(i);
                  props.onChange({ year, month, day: i });
                  setIsDayOpen(false);
                }}
              >
                {i + 1}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
