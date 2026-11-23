import { FCalendar } from '@/renderer/commons/interfaces';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SettingsWeek(props: {
  data: FCalendar;
  onChange: (data: FCalendar) => void;
  onClickBack: () => void;
}) {
  const [t] = useTranslation();
  const [newData, setNewData] = useState({ name: '', isHoliday: false });
  const [holdingIdx, setHoldingIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  return (
    <>
      <div
        className="w-full h-full gap-3 pb-2"
        style={{
          display: 'grid',
          gridTemplateRows: '30px minmax(0, 1fr) minmax(80px, auto)',
        }}
      >
        <div className="w-full h-full flex items-end gap-2 mb-4">
          <span className="material-symbols-rounded cursor-pointer" onClick={props.onClickBack}>
            chevron_left
          </span>
          <h3>{t('calendar-settings-week')}</h3>
        </div>

        <div className="w-full h-full overflow-auto p-1">
          {props.data.weeks.map((w, idx) => {
            return (
              <div key={w.name}>
                <div
                  className="w-full relative gap-3 underline-box text-sm p-1"
                  draggable
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setDragOverIdx(idx);
                    //console.log('drag over', idx);
                  }}
                  onDragStart={(e) => {
                    setHoldingIdx(idx);
                  }}
                  onDragEnd={(e) => {
                    const newWeeks = [...props.data.weeks];
                    if (idx !== null && dragOverIdx !== null) {
                      const [removed] = newWeeks.splice(idx, 1);
                      if (dragOverIdx > idx) {
                        newWeeks.splice(dragOverIdx - 1, 0, removed);
                      } else {
                        newWeeks.splice(dragOverIdx, 0, removed);
                      }
                    }
                    setDragOverIdx(null);
                    setHoldingIdx(null);
                    props.onChange({
                      ...props.data,
                      weeks: newWeeks,
                    });
                  }}
                >
                  <div
                    className="transition-all duration-300"
                    style={{
                      height: dragOverIdx === idx && holdingIdx !== idx ? '24px' : '0px',
                      width: '100%',
                    }}
                  ></div>
                  <div
                    className="flex items-center gap-2 transition-all duration-300"
                    style={{
                      opacity: holdingIdx === idx ? 0.5 : 1,
                    }}
                  >
                    <span
                      className="material-symbols-rounded text-stone-500"
                      style={{ cursor: 'grab' }}
                    >
                      drag_handle
                    </span>
                    <div style={{ marginRight: '8px' }}>{w.name}</div>
                    <div>{w.isHoliday ? t('holiday') : ''}</div>
                    <span
                      className="material-symbols-rounded  absolute right-2 text-stone-500 cursor-pointer"
                      onClick={() => {
                        const newWeeks = [...props.data.weeks];
                        newWeeks.splice(idx, 1);
                        props.onChange({
                          ...props.data,
                          weeks: newWeeks,
                        });
                      }}
                    >
                      remove
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <div
            className="transition-all duration-300"
            style={{
              height: props.data.weeks.length === dragOverIdx ? '50px' : '24px',
              width: '100%',
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragOverIdx(props.data.weeks.length);
              //console.log('drag over', props.data.weeks.length);
            }}
            onDragEnd={(e) => {
              const idx = props.data.weeks.length - 1;
              const newWeeks = [...props.data.weeks];
              if (idx !== null && dragOverIdx !== null) {
                const [removed] = newWeeks.splice(idx, 1);
                if (dragOverIdx > idx) {
                  newWeeks.splice(dragOverIdx - 1, 0, removed);
                } else {
                  newWeeks.splice(dragOverIdx, 0, removed);
                }
              }
              setDragOverIdx(null);
              setHoldingIdx(null);
              props.onChange({
                ...props.data,
                weeks: newWeeks,
              });
            }}
          ></div>
        </div>
        <div className="w-full flex items-end gap-1 px-1">
          <div className="w-full">
            <div className="w-full flex items-center gap-1 mt-1 text-sm text-stone-500 p-1">
              {t('calendar-settings-week-description')}
            </div>
            <div
              className="w-full gap-2 px-1"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 80px 40px',
              }}
            >
              <input
                className="box h-10 w-full"
                placeholder={t('calendar-settings-week-name')}
                value={newData.name}
                onChange={(e) => setNewData({ ...newData, name: e.target.value })}
              />
              <button
                className="box h-10 w-full cursor-pointer"
                onClick={() => setNewData({ ...newData, isHoliday: !newData.isHoliday })}
              >
                {newData.isHoliday ? t('holiday') : t('workday')}
              </button>
              <div
                className="button button-primary h-10 flex justify-center items-center material-symbols-rounded"
                onClick={() => {
                  if (newData.name) {
                    props.onChange({
                      ...props.data,
                      weeks: [
                        ...props.data.weeks,
                        { name: newData.name, isHoliday: newData.isHoliday },
                      ],
                    });
                    setNewData({ name: '', isHoliday: false });
                  }
                }}
              >
                add
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
