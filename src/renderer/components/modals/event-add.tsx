import { FCalendar, FDate, FEvent, RepeatType } from '@/renderer/commons/interfaces';
// import { DateDiff, GetRandomId, icons } from '@/renderer/commons/utils';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DateDropdown } from '../calendar/date-dropdown';
import { defaultCalendar, defaultEvent, GetDateDiff } from '@/renderer/commons/utils';
import Loading from '../commons/loading';
import DropdownData from '../calendar/dropdown-data';
import useSystem from '@/renderer/hooks/use-system';

export default function EventAdd(props: {
  calendar?: FCalendar;
  event?: FEvent;
  mode: 'add' | 'edit';
  onClose: () => void;
}) {
  const [t] = useTranslation();
  const [data, setData] = useState<FEvent>({
    ...(props.event || defaultEvent),
  });

  const [isLoading, saveFile, loadFile, deleteFile] = useSystem();
  const [_loading, setIsLoading] = useState<boolean>(false);

  const [to, setTo] = useState<FDate>({
    year: data.date.year,
    month: data.date.month,
    day: data.date.day,
  });

  const handleSubmit = async () => {
    if (!props.calendar) return;
    setIsLoading(true);

    if (props.mode === 'edit') {
    } else {
      const newId = `${props.calendar?.name || 'calendar'}-${Date.now()}`;
      if (!props.calendar.events) props.calendar.events = [];
      props.calendar.events.push({ ...data, id: newId });
      await saveFile(JSON.stringify(props.calendar), `calendars/${props.calendar.id}.json`);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
    setData({ ...defaultEvent });
    props.onClose();
  };

  useEffect(() => {
    if (props.event && props.event.date) {
      setData({
        ...data,
        date: {
          day: props.event.date.day,
          month: props.event.date.month,
          year: props.event.date.year,
        },
        duration: 1,
        until: undefined,
        isInfinite: false,
        repeat: 0,
      });
      setTo({
        day: props.event.date.day,
        month: props.event.date.month,
        year: props.event.date.year,
      });
    }
  }, [props.event]);

  useEffect(() => {
    if (GetDateDiff(props.calendar || defaultCalendar, data.date, to) < 0) {
      setTo({ ...data.date });
    }
  }, [data.date]);

  useEffect(() => {
    const diff = GetDateDiff(props.calendar || defaultCalendar, data.date, to) + 1;
    setData({ ...data, duration: diff });
    if (GetDateDiff(props.calendar || defaultCalendar, data.date, to) <= 0) {
      setData({ ...data, date: to });
    }
  }, [to]);

  return (
    <>
      <Loading isLoading={_loading} />
      <div
        className="h-full p-2 gap-3"
        style={{
          width: '400px',
          display: 'grid',
          maxHeight: '100%',
          gridTemplateRows: 'minmax(0, 1fr) 60px',
        }}
      >
        <div className="w-full h-full overflow-auto">
          {/** name */}
          <div className="w-full mb-6">
            <p className="mb-2">
              {t('event-name')}
              <span className="text-red-500">*</span>
            </p>
            <input
              className="h-full w-full"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>
          {/** description */}
          <div className="w-full mb-6">
            <p className="mb-2">{t('event-memo')}</p>
            <textarea
              className="h-full w-full"
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
            />
          </div>

          <div
            className="w-full"
            style={{
              display: 'grid',
              gridTemplateColumns: '50px 1fr',
            }}
          >
            <p className="text-xs text-secondary flex items-center">{t('event-start')}</p>
            <div className="flex gap-2">
              <input
                type="number"
                className="w-30"
                min={1}
                max={9999}
                value={data.date.year + 1}
                onChange={(e) => {
                  const newDate = { ...data.date, year: parseInt(e.target.value) - 1 };
                  setData({ ...data, date: newDate });
                }}
              />
              <DropdownData
                id="event-date-month"
                index={data.date.month}
                list={props.calendar?.months.map((month) => month.name) || []}
                onChange={(newIndex) => {
                  const newDate = { ...data.date, month: newIndex };
                  setData({ ...data, date: newDate });
                }}
              />
              <DropdownData
                id="event-date-day"
                index={data.date.day}
                width={70}
                list={Array.from(
                  { length: props.calendar?.months[data.date.month].days || 31 },
                  (_, i) => (i + 1).toString(),
                )}
                onChange={(newIndex) => {
                  const newDate = { ...data.date, day: newIndex };
                  setData({ ...data, date: newDate });
                }}
              />
            </div>
            <p className="text-xs text-secondary flex items-center">{t('event-end')}</p>
            <div className="flex gap-2 mt-2">
              <input
                type="number"
                className="w-30"
                min={1}
                max={9999}
                value={to.year + 1}
                onChange={(e) => {
                  const newDate = { ...to, year: parseInt(e.target.value) - 1 };
                  setTo(newDate);
                }}
              />
              <DropdownData
                id="event-to-month"
                index={to.month}
                list={props.calendar?.months.map((month) => month.name) || []}
                onChange={(newIndex) => {
                  const newDate = { ...to, month: newIndex };
                  setTo(newDate);
                }}
              />
              <DropdownData
                id="event-to-day"
                index={to.day}
                list={Array.from({ length: props.calendar?.months[to.month].days || 31 }, (_, i) =>
                  (i + 1).toString(),
                )}
                width={70}
                onChange={(newIndex) => {
                  const newDate = { ...to, day: newIndex };
                  setTo(newDate);
                }}
              />
            </div>
            <p></p>
            <p className="text-secondary text-xs text-right mt-1 px-1 mb-4">
              {GetDateDiff(props.calendar || defaultCalendar, data.date, to) + 1} {t('days')}
            </p>
            <p className="text-xs text-secondary flex items-center">{t('event-repeat')}</p>
            <DropdownData
              id="event-repeat"
              index={data.repeat}
              direction="top"
              list={Object.values(RepeatType).map((type) => t(type))}
              onChange={(newIndex) => {
                if (newIndex != 0) {
                  setData({ ...data, repeat: newIndex, until: to });
                }
                if (newIndex === 0) {
                  setData({ ...data, repeat: newIndex, until: undefined });
                }
              }}
            />
            {data.repeat !== 0 && !data.isInfinite && (
              <p className="text-xs text-secondary flex items-center">{t('event-until')}</p>
            )}
            {data.repeat !== 0 && !data.isInfinite && (
              <div className="flex gap-2 mt-2">
                <input
                  type="number"
                  className="w-30"
                  min={1}
                  max={9999}
                  value={(data.until?.year ?? to.year) + 1}
                  onChange={(e) => {
                    if (data.until) {
                      const newDate = { ...data.until, year: parseInt(e.target.value) - 1 };
                      setData({ ...data, until: newDate });
                    }
                  }}
                />
                <DropdownData
                  id="event-until-month"
                  direction="top"
                  index={data.until?.month ?? 0}
                  list={props.calendar?.months.map((month) => month.name) || []}
                  onChange={(newIndex) => {
                    if (data.until) {
                      const newDate = { ...data.until, month: newIndex };
                      setData({ ...data, until: newDate });
                    }
                  }}
                />
                <DropdownData
                  id="event-until-day"
                  direction="top"
                  width={70}
                  index={data.until?.day ?? 0}
                  list={Array.from(
                    { length: props.calendar?.months[data.until?.month ?? 0].days || 31 },
                    (_, i) => (i + 1).toString(),
                  )}
                  onChange={(newIndex) => {
                    if (data.until) {
                      const newDate = { ...data.until, day: newIndex };
                      setData({ ...data, until: newDate });
                    }
                  }}
                />
              </div>
            )}
            {data.repeat !== 0 && <p></p>}
            {data.repeat !== 0 && (
              <div className="flex gap-2 mt-2 justify-end items-center text-secondary text-xs">
                {t('is-infinite')}
                <div
                  className="w-6 h-6 box rounded-full icon cursor-pointer flex justify-center items-center"
                  onClick={() => setData({ ...data, isInfinite: !data.isInfinite })}
                >
                  {data.isInfinite ? '✔' : ''}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full h-full flex justify-center items-end gap-2">
          {/* <div
            className="w-15 h-full button button-secondary flex justify-center items-center"
            style={{ height: '44px' }}
          >
            <span className="material-symbols-rounded" onClick={(e) => {}}>
              redo
            </span>
          </div> */}
          <div
            className="w-full h-full button button-primary flex justify-center items-center"
            style={{ height: '44px' }}
            onClick={handleSubmit}
          >
            {t('submit')}
          </div>
        </div>
      </div>
    </>
  );
}
