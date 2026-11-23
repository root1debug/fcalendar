import { useEffect, useState } from 'react';
import { useModal } from '../hooks/use-modal';
import { CommonIdName, FCalendar, FDate, FEvent, FEventRender } from '../commons/interfaces';
import useSystem from '../hooks/use-system';
import Header from '../components/calendar/header';

import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import CellYear from '../components/calendar/cell-year';
import CalendarAdd from '../components/modals/calendar-add';
import NavigatorYear from '../components/calendar/navigator-year';
import DateInfo from '../components/calendar/date-info';
import EventAdd from '../components/modals/event-add';
import { defaultEvent } from '../commons/utils';
import { useTranslation } from 'react-i18next';
import { useAlert } from '../hooks/use-alert';

export default function Calendar(props: {}) {
  const location = useLocation();
  const appScreen = useSelector((state: any) => state.appScreen);
  const [t] = useTranslation();

  const [data, setData] = useState<FCalendar | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, saveFile, loadFile, deleteFile] = useSystem();
  const [ModalContainer, isOpen, openModal, closeModal] = useModal();
  const [Alert, isAlertOpen, alertResult, openAlert, closeAlert] = useAlert();
  const [modalType, setModalType] = useState<'event-edit' | 'event-add' | 'calendar-edit'>(
    'event-add',
  );
  // State for date info panel
  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<{ date: FDate; events: FEventRender[] } | null>(
    null,
  );
  const [selectedEvent, setSelectedEvent] = useState<FEvent | null>(null);

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // load calendar data with calId
    const callId = location.pathname.split('/')[2];

    loadFile(`calendars/${callId}.json`).then((res) => {
      if (res && res?.data) {
        const json = JSON.parse(res.data);
        setData(json as FCalendar);
        //console.log(json);
      }
    });
  }, [refresh]);

  useEffect(() => {
    if (!data) return;
    const yearDays = data?.months.reduce((acc, month) => acc + month.days, 0);
    const yearOffset = (yearDays * (data?.year ?? 0)) % data.weeks.length;
    setOffset(yearOffset);
  }, [data]);

  useEffect(() => {
    if (!data) return;
    saveFile(JSON.stringify(data), `calendars/${data.id}.json`);
  }, [data?.year]);

  useEffect(() => {
    if (alertResult === 16) {
      const updatedRenders = selectedDate?.events?.filter((r) => r.event.id !== selectedEvent?.id);
      const updatedEvents = data?.events?.filter((e) => e.id !== selectedEvent?.id);
      if (data) {
        data.events = updatedEvents ?? [];
        saveFile(JSON.stringify(data), `calendars/${data?.id}.json`).then((res) => {
          setRefresh(!refresh);
        });
        setSelectedDate({ ...selectedDate!, events: updatedRenders ?? [] });
      }
    }
  }, [alertResult]);

  const navigateYear = (year: number) => {
    if (!data) return;
    setData({ ...data, year: year });
  };

  const onClickDate = (date: FDate, events: FEventRender[]) => {
    setSelectedDate({ date, events });
    setInfoOpen(true);
  };

  const onClickEvent = (event: FEventRender) => {
    setSelectedEvent(event.event);
    openAlert();
  };

  if (!data) {
    return <></>;
  }
  return (
    <>
      <div
        className={`${appScreen.theme}`}
        style={{
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr',
        }}
      >
        <Header item={data as CommonIdName} />
        <NavigatorYear calendar={data} year={data.year} navigateYear={navigateYear} />
        <CellYear calendar={data} year={data.year} offset={offset} onClickDate={onClickDate} />
        <div
          className="fixed bottom-5 left-0 right-0 z-50 flex flex-col items-end justify-center"
          style={{
            transform: infoOpen ? 'translateY(0)' : 'translateY(calc(var(--spacing) * 110))',
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          <div
            className="h-42 card-nop grid"
            style={{
              margin: '0 auto',
              left: 0,
              right: 0,
              width: 'calc(100% - var(--spacing) * 7)',
              gridTemplateRows: 'auto 1fr',
            }}
          >
            <div
              className="material-symbols-rounded button button-primary shadow-md mb-4 mr-4 hover absolute top-[-72px] right-0"
              style={{
                zIndex: 1000,
                cursor: 'pointer',
                borderRadius: '50%',
                padding: '10px',
                fontSize: '2rem',
              }}
              onClick={() => {
                setModalType('event-add');
                setInfoOpen(false);
                openModal();
              }}
            >
              add
            </div>
            <div className="flex items-center justify-between px-4 py-2 transition duration-120">
              <span className="text-sm text-secondary">
                {(selectedDate?.date.day ?? 0) + 1} .{' '}
                {data?.months[selectedDate?.date.month ?? 0]?.name}
              </span>
              <div
                className="material-symbols-rounded text-right hover icon-hover"
                onClick={() => setInfoOpen(!infoOpen)}
              >
                remove
              </div>
            </div>
            <div className="overflow-y-auto h-full">
              <DateInfo
                calendar={data}
                date={selectedDate?.date}
                events={selectedDate?.events}
                refresh={refresh}
                onClickEvent={onClickEvent}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Content Area */}
      {ModalContainer(
        modalType === 'event-add'
          ? {
              title: t('event-add'),
              children: (
                <EventAdd
                  calendar={data}
                  event={{
                    ...defaultEvent,
                    date: selectedDate?.date ?? { day: 0, month: 0, year: data.year },
                  }}
                  mode="add"
                  onClose={() => {
                    closeModal();
                    setRefresh(!refresh);
                  }}
                />
              ),
            }
          : modalType === 'event-edit'
            ? { title: t('event-edit'), children: <div>Event Edit Modal</div> }
            : {
                title: t('calendar-edit'),
                children: (
                  <CalendarAdd
                    mode="edit"
                    calendar={data}
                    onClose={() => {
                      closeModal();
                      setRefresh(!refresh);
                    }}
                  />
                ),
              },
      )}
      {Alert({
        title: t('delete-event'),
        content: t('delete-event-confirm'),
        type: 16,
      })}
    </>
  );
}
