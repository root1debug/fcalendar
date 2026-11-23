import { FCalendar, FDate, FEventRender } from '@/renderer/commons/interfaces';
import CellMonth from './cell-month';
import { JSX } from 'node_modules/@emotion/react/dist/declarations/src/jsx-runtime';
import { MapEventToRender } from '@/renderer/commons/utils';
import { useMemo } from 'react';

export default function CellYear(props: {
  calendar: FCalendar;
  year: number;
  offset: number;
  onClickDate: (date: FDate, events: FEventRender[]) => void;
}) {
  const renders = useMemo(
    () => MapEventToRender(props.calendar, props.year, props.calendar.events ?? []),
    [props.calendar, props.year, props.calendar.events],
  );
  const printMonths = () => {
    let offset = props.offset % props.calendar.weeks.length;
    const months: JSX.Element[] = [];
    const monthRenders: FEventRender[] = renders ?? [];
    for (let i = 0; i < props.calendar.months.length; i++) {
      const month = props.calendar.months[i];
      const days = month.days + offset;
      months.push(
        <CellMonth
          key={`year-${props.year}-month-${i}`}
          calendar={props.calendar}
          year={props.year}
          month={i}
          offset={offset}
          onClickDate={props.onClickDate}
          renders={monthRenders}
        />,
      );

      offset = days % props.calendar.weeks.length;
    }
    return months;
  };

  return (
    <>
      <div className="overflow-y-auto h-full pb-110 bg">{printMonths()}</div>
    </>
  );
}
