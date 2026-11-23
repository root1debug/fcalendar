import { FDate, FEventRender } from '@/renderer/commons/interfaces';
import { EventDrawType, FindByDateFromRenders } from '@/renderer/commons/utils';
import { useRef, useState, useEffect } from 'react';

export default function CellDate(props: {
  year: number;
  month: number;
  day: number;
  isHoliday?: boolean;
  isEmpty?: boolean;
  renders?: FEventRender[];
  onClickDate: (date: FDate, events: FEventRender[]) => void;
}) {
  const hoveredEvent = useRef<number>(-1);
  const events: FEventRender[] = FindByDateFromRenders(props.renders ?? [], {
    year: props.year,
    month: props.month,
    day: props.day - 1,
  });
  const [count, setCount] = useState<number>(
    events.filter((r) => r.renders[0].row >= 3).length ?? 0,
  );
  useEffect(() => {
    setCount(events.filter((r) => r.renders[0].row >= 3).length ?? 0);
  }, [props.renders, props.year, props.month, props.day]);

  return (
    <div
      className={`relative cell-date overflow-hidden w-full ${props.isEmpty ? '' : 'hoverable'}`}
      style={{ aspectRatio: '1 / 0.7', cursor: props.isEmpty ? 'default' : 'pointer' }}
      onClick={() => {
        if (!props.isEmpty) {
          props.onClickDate(
            {
              year: props.year,
              month: props.month,
              day: props.day - 1,
            },
            events,
          );
        }
      }}
    >
      <span className={props.isHoliday ? 'holiday' : ''} style={{ padding: '5px 5px' }}>
        {props.isEmpty ? '' : props.day}
      </span>
      <div className="cell-date-events relative">
        {events.map((event, i) => {
          if (event.renders[0].row < 3) {
            return (
              <div key={i} className="cell-date-event">
                <EventRender
                  label={event.event.name}
                  type={event.renders[0].type}
                  row={event.renders[0].row}
                />
              </div>
            );
          }
        })}
      </div>
      <div>
        {count > 0 && (
          <div
            className="text-xs text-secondary"
            style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
            }}
          >
            +{count}
          </div>
        )}
      </div>
    </div>
  );
}

function EventRender(props: { label: string; type: number; row?: number }) {
  if ((props.row ?? 0) > 2) {
    return <></>;
  }
  if (props.type === EventDrawType.EXACT) {
    return (
      <div
        className="event-box absolute h-3 text-xs ml-1 mb-1 rounded"
        style={{
          top: `calc(var(--spacing) * ${(props.row ?? 1) - 1} * 4)`,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: 'calc(100% - var(--spacing) * 2)',
        }}
      >
        {props.label}
      </div>
    );
  } else if (props.type === EventDrawType.START) {
    return (
      <div
        className="event-box absolute w-full h-3 text-xs ml-1 mb-1 rounded-tl rounded-bl"
        style={{
          top: `calc(var(--spacing) * ${(props.row ?? 1) - 1} * 4)`,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {props.label}
      </div>
    );
  } else if (props.type === EventDrawType.BETWEEN) {
    return (
      <div
        className="event-box absolute w-full h-3 text-xs mb-1 "
        style={{
          top: `calc(var(--spacing) * ${(props.row ?? 1) - 1} * 4)`,
        }}
      ></div>
    );
  } else if (props.type === EventDrawType.END) {
    return (
      <div
        className="event-box absolute w-full h-3 text-xs mr-1 mb-1 rounded-tr rounded-br"
        style={{
          top: `calc(var(--spacing) * ${(props.row ?? 1) - 1} * 4)`,
          width: 'calc(100% - var(--spacing) * 1)',
        }}
      ></div>
    );
  }
  return <></>;
}
