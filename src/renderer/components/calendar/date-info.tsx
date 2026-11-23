import { FCalendar, FDate, FEventRender, RepeatType } from '@/renderer/commons/interfaces';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import skyImage from '@/renderer/assets/skyimage.jpg';
import LunarVisual from './lunar-visual';

export default function DateInfo(props: {
  calendar: FCalendar | undefined;
  date?: FDate;
  events?: FEventRender[];
  refresh: boolean;
  onClickEvent?: (event: FEventRender) => void;
}) {
  const [t] = useTranslation();
  const [events, setEvents] = useState<FEventRender[]>(props.events ?? []);
  useEffect(() => {
    setEvents(props.events ?? []);
  }, [props.events, props.refresh]);

  if (!props.calendar || !props.date) {
    return null;
  }

  return (
    <>
      <div className="px-3 w-full h-full overflow-y-auto pb-10">
        {events && events.length > 0 ? (
          <div className="flex flex-col gap-2">
            {events.map((event, index) => (
              <div
                key={index}
                className="transition duration-120 cursor-pointer event-info-item"
                onClick={() => props.onClickEvent && props.onClickEvent(event)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{event.event.name ?? ''}</span>
                  <div className="flex gap-1 items-center text-sm text-secondary">
                    <div className="flex gap-1 items-center">
                      {event.event.repeat > 0 && (
                        <>
                          <span
                            className="material-symbols-rounded"
                            style={{
                              fontSize: '16px',
                            }}
                          >
                            repeat
                          </span>
                          <span>{t(Object.values(RepeatType)[event.event.repeat])}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-secondary mt-1">{event.event.description ?? ''}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-sm text-secondary">No events for this date</span>
          </div>
        )}
      </div>
      {props.calendar.lunars && (
        <div
          className="h-50 w-50 bg-blue-100 absolute bottom-46 left-4 z-999 rounded-md flex items-center justify-center"
          style={{ backgroundImage: `url(${skyImage})`, backgroundSize: 'cover' }}
        >
          <LunarVisual cycle={20} days={props.date.day} />
        </div>
      )}
    </>
  );
}
