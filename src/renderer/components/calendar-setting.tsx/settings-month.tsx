import { FCalendar } from '@/renderer/commons/interfaces';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SettingsMonth(props: {
  data: FCalendar;
  onChange: (data: FCalendar) => void;
  onClickBack: () => void;
}) {
  const [t] = useTranslation();
  const [newData, setNewData] = useState({ name: '', days: 0 });
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
          <h3>{t('calendar-settings-month')}</h3>
        </div>

        <div className="w-full h-full overflow-auto p-1">
          {props.data.months.map((m, idx) => {
            return (
              <div key={m.name}>
                <div
                  className="w-full relative gap-3 underline-box text-sm p-1"
                  draggable
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setDragOverIdx(idx);
                  }}
                  onDragStart={(e) => {
                    setHoldingIdx(idx);
                  }}
                  onDragEnd={(e) => {
                    const newMonths = [...props.data.months];
                    if (idx !== null && dragOverIdx !== null) {
                      const [removed] = newMonths.splice(idx, 1);
                      if (dragOverIdx > idx) {
                        newMonths.splice(dragOverIdx - 1, 0, removed);
                      } else {
                        newMonths.splice(dragOverIdx, 0, removed);
                      }
                    }
                    setDragOverIdx(null);
                    setHoldingIdx(null);
                    props.onChange({
                      ...props.data,
                      months: newMonths,
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
                    <div style={{ marginRight: '8px' }}>{m.name}</div>
                    <div>
                      {m.days} {t('days')}
                    </div>
                    <span
                      className="material-symbols-rounded  absolute right-2 text-stone-500 cursor-pointer"
                      onClick={() => {
                        const newMonths = [...props.data.months];
                        newMonths.splice(idx, 1);
                        props.onChange({
                          ...props.data,
                          months: newMonths,
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
              height: props.data.months.length === dragOverIdx ? '50px' : '24px',
              width: '100%',
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragOverIdx(props.data.months.length);
              //console.log('drag over', props.data.months.length);
            }}
            onDragEnd={(e) => {
              const idx = props.data.months.length - 1;
              const newMonths = [...props.data.months];
              if (idx !== null && dragOverIdx !== null) {
                const [removed] = newMonths.splice(idx, 1);
                if (dragOverIdx > idx) {
                  newMonths.splice(dragOverIdx - 1, 0, removed);
                } else {
                  newMonths.splice(dragOverIdx, 0, removed);
                }
              }
              setDragOverIdx(null);
              setHoldingIdx(null);
              props.onChange({
                ...props.data,
                months: newMonths,
              });
            }}
          ></div>
        </div>
        <div className="w-full flex items-end gap-1 px-1">
          <div className="w-full">
            <div className="w-full flex items-center gap-1 mt-1 text-sm text-stone-500 p-1">
              {t('calendar-settings-month-description')}
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
                value={newData.name}
                placeholder={t('calendar-settings-month-name')}
                onChange={(e) => setNewData({ ...newData, name: e.target.value })}
              />
              <input
                className="box h-10 w-full"
                type="number"
                value={newData.days}
                onChange={(e) => setNewData({ ...newData, days: Number(e.target.value) })}
              />
              <div
                className="button button-primary h-10 flex justify-center items-center material-symbols-rounded"
                onClick={() => {
                  if (newData.name && newData.days > 0) {
                    props.onChange({
                      ...props.data,
                      months: [...props.data.months, { name: newData.name, days: newData.days }],
                    });
                    setNewData({ name: '', days: 0 });
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
