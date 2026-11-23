import { FCalendar, FDate, FEventRender, FMonth } from '@/renderer/commons/interfaces';
import CellDate from './cell-date';
import { useMemo } from 'react';

export default function CellMonth(props: {
  calendar: FCalendar;
  year: number;
  month: number;
  offset?: number;
  renders?: FEventRender[];
  onClickDate: (date: FDate, events: FEventRender[]) => void;
}) {
  const month = props.calendar.months[props.month];
  const printDays = useMemo(() => {
    const holidayIndices = props.calendar.weeks
      .map((week, i) => (week.isHoliday ? i : -1))
      .filter((i) => i >= 0);
    let offset = (props.offset ?? 0) % props.calendar.weeks.length;
    return Array.from({
      length:
        Math.ceil((month.days + offset) / props.calendar.weeks.length) *
        props.calendar.weeks.length,
    }).map((day, i) => (
      <CellDate
        year={props.year}
        month={props.month}
        day={i + 1 - offset}
        isEmpty={i + 1 - offset <= 0 || i + 1 - offset > month.days}
        isHoliday={holidayIndices.includes(i % props.calendar.weeks.length)}
        onClickDate={props.onClickDate}
        key={`month-${props.month}-day_${i + 1 - offset}`}
        renders={props.renders ?? []}
      />
    ));
  }, [props.calendar, props.month, props.offset, props.renders, props.year]);

  return (
    <>
      <div className="p-5">
        <div className="text-lg mb-3 mt-3 sticky">{month.name}</div>
        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${props.calendar.weeks.length}, 1fr)` }}
        >
          {props.calendar.weeks.map((week, i) => (
            <div
              key={`month-${props.month}-weekheader_${i}`}
              className="calendar-week text-sm text-center p-3"
            >
              {week.name}
            </div>
          ))}
        </div>
        <div
          className="grid cell-month"
          style={{ gridTemplateColumns: `repeat(${props.calendar.weeks.length}, 1fr)` }}
        >
          {printDays}
        </div>
      </div>
    </>
  );
}
