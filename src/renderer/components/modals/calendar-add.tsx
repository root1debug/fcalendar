import { FCalendar, FDate, FLunar } from '@/renderer/commons/interfaces';
import { defaultCalendar, EncodeFileToBase64 } from '@/renderer/commons/utils';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SettingsMonth from '../calendar-setting.tsx/settings-month';
import SettingsWeek from '../calendar-setting.tsx/settings-week';
import Badge from '../commons/badge';
import Loading from '../commons/loading';
import SettingsLunars from '../calendar-setting.tsx/settings-lunars';

export default function CalendarAdd(props: {
  calendar?: FCalendar;
  mode: 'add' | 'edit';
  onClose: () => void;
}) {
  const [t] = useTranslation();
  const [step, setStep] = useState<'main' | 'month' | 'week' | 'lunar'>('main');
  const [data, setData] = useState<FCalendar>({
    ...(props.calendar || defaultCalendar),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const mainRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleOnClickMenu = (menu: 'main' | 'month' | 'week' | 'lunar') => {
    setStep(menu);
    if (menu === 'main') {
      mainRef.current?.style.setProperty('transform', 'translateX(0px)');
      menuRef.current?.style.setProperty('transform', 'translateX(400px)');
    } else {
      mainRef.current?.style.setProperty('transform', 'translateX(-400px)');
      menuRef.current?.style.setProperty('transform', 'translateX(0px)');
    }
  };

  const handleSubmit = async (file?: File) => {
    setIsLoading(true);
    const newId = `f-${Date.now()}`;
    await window.mainApi.invoke('msgSaveCalendar', { ...data, id: newId });
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
    setData({ ...defaultCalendar });
    props.onClose();
  };

  return (
    <>
      <Loading isLoading={isLoading} />
      <div
        className="w-full h-full overflow-hidden relative"
        style={{ width: '400px', height: '700px', maxHeight: '100%' }}
      >
        <div
          className="absolute transition duration-300 container z-10"
          style={{ width: '400px', height: '700px', maxHeight: '100%' }}
          ref={mainRef}
        >
          <CalendarInfo
            isLoading={isLoading}
            data={data}
            mode={props.mode}
            onChange={(newData) => setData(newData)}
            onClickMenu={handleOnClickMenu}
            onClickSubmit={() => handleSubmit()}
          />
        </div>
        <div
          className="absolute transition duration-300 container z-10"
          style={{
            width: '400px',
            height: '700px',
            maxHeight: '100%',
            transform: 'translateX(400px)',
          }}
          ref={menuRef}
        >
          {(step === 'month' || step === 'main') && (
            <SettingsMonth
              data={data}
              onChange={(newData) => setData(newData)}
              onClickBack={() => handleOnClickMenu('main')}
            />
          )}
          {step === 'week' && (
            <SettingsWeek
              data={data}
              onChange={(newData) => setData(newData)}
              onClickBack={() => handleOnClickMenu('main')}
            />
          )}
          {
            step === 'lunar' && (
              <SettingsLunars data={data} onChange={(newData)=> setData(newData)} onClickBack={() => handleOnClickMenu('main')}/>
            )
          }
        </div>
      </div>
    </>
  );
}

function CalendarInfo(props: {
  isLoading: boolean;
  data: FCalendar;
  mode: 'add' | 'edit';
  onChange: (data: FCalendar) => void;
  onClickMenu?: (menu: 'main' | 'month' | 'week' | 'lunar') => void;
  onClickSubmit: (file?: File) => void;
}) {
  const [t] = useTranslation();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    EncodeFileToBase64(e.target.files?.[0]).then((base64) => {
      setImageSrc(base64);
      props.onChange({ ...props.data, path: base64 || '' });
    });
  };

  return (
    <>
      <div
        className="w-full h-full p-2 gap-3"
        style={{
          display: 'grid',
          maxHeight: '100%',
          gridTemplateRows: 'minmax(0, 1fr) 60px',
        }}
      >
        <div className="w-full h-full overflow-auto">
          {/** name */}
          <div className="w-full mb-6">
            <p className="mb-2">
              {t('calendar-name')}
              <span className="text-red-500">*</span>
            </p>
            <input
              className="h-full w-full"
              value={props.data.name}
              onChange={(e) => props.onChange({ ...props.data, name: e.target.value })}
            />
          </div>
          {/** description */}
          <div className="w-full mb-6">
            <p className="mb-2">{t('calendar-description')}</p>
            <textarea
              className="h-full w-full"
              value={props.data.description}
              onChange={(e) => props.onChange({ ...props.data, description: e.target.value })}
            />
          </div>
          {/** background */}
          <p className="mb-2">{t('calendar-background')}</p>
          <div className="relative w-full box" style={{ aspectRatio: '9/2', overflow: 'hidden' }}>
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Calendar Background"
                className="w-full h-full object-cover"
              />
            )}
            <div
              className="absolute top-0 left-0 w-full h-full cursor-pointer flex justify-center items-center hover-display"
              onClick={() => imgRef.current?.click()}
            >
              <span className="material-symbols-rounded">add_circle</span>
            </div>
            <input
              ref={imgRef}
              onChange={handleImageChange}
              type="file"
              accept="image/*"
              style={{ visibility: 'hidden' }}
            />
          </div>
          {/** settings */}
          <p className="mb-2 mt-6">{t('calendar-settings')}</p>
          <div
            className="w-full mt-2 button flex justify-between items-center"
            onClick={() => props.onClickMenu?.('month')}
          >
            {t('calendar-settings-month')}
            <span className="material-symbols-rounded cursor-pointer">chevron_right</span>
          </div>
          <div
            className="w-full mt-2 button flex justify-between items-center"
            onClick={() => props.onClickMenu?.('week')}
          >
            {t('calendar-settings-week')}
            <span className="material-symbols-rounded cursor-pointer">chevron_right</span>
          </div>
          <div
            className="w-full mt-2 button flex justify-between items-center mb-3"
            onClick={() => props.onClickMenu?.('lunar')}
          >
            {t('calendar-settings-lunar')} 
            <span className="material-symbols-rounded cursor-pointer">chevron_right</span>
          </div>
        </div>
        <div className="w-full h-full flex justify-center items-end gap-2">
          <div
            className="w-15 h-full button button-secondary flex justify-center items-center"
            style={{ height: '44px' }}
          >
            <span className="material-symbols-rounded" onClick={(e) => {}}>
              redo
            </span>
          </div>
          <div
            className="w-full h-full button button-primary flex justify-center items-center"
            style={{ height: '44px' }}
            onClick={() => {
              props.onClickSubmit(imgRef.current?.files?.[0]);
              setImageSrc(null);
            }}
          >
            {t('submit')}
          </div>
        </div>
      </div>
    </>
  );
}
