import { CommonIdName } from '@/renderer/commons/interfaces';
import { useAlert } from '@/renderer/hooks/use-alert';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function Header(props: { item: CommonIdName }) {
  const nav = useNavigate();
  const [image, setImage] = useState<string>('');
  const [alert, isAlertOpen, alertResult, openAlert, closeAlert] = useAlert();
  const [t] = useTranslation();
  const [headerHeight, setHeaderHeight] = useState<number>(2);

  useEffect(() => {
    window.mainApi.invoke('msgLoadImage', props.item.path).then((res) => {
      if (res && res.data) {
        setImage(res.data as string);
      }
    });
  }, []);

  useEffect(() => {
    if (alertResult === 16) {
      window.mainApi.invoke('msgDeleteCalendar', props.item.id).then((res) => {
        nav('/');
      });
    }
  }, [alertResult]);

  return (
    <>
      <div className="bg">
        <div className="w-full h-10 flex items-center justify-between px-2 underline-box ">
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded clickable" onClick={() => nav(-1)}>
              keyboard_arrow_left
            </span>
            <div className="text-lg font-bold text-primary">{props.item.name}</div>
            <div className="text-sm text-primary">{props.item.description ?? ''}</div>
          </div>
          <div className="flex gap-3">
            <span
              className="material-symbols-rounded clickable icon-hover"
              onClick={() => {
                openAlert();
              }}
              style={{ color: '#c03333' }}
            >
              delete
            </span>
            <span
              className="material-symbols-rounded clickable icon-hover"
              onClick={() => {
                //openAlert();
              }}
            >
              edit
            </span>
            <span
              className="material-symbols-rounded clickable icon-hover"
              onClick={() => {
                if (headerHeight == 2) {
                  setHeaderHeight(0);
                } else if (headerHeight == 0) {
                  setHeaderHeight(2);
                }
              }}
            >
              {headerHeight != 0 && 'compress'}
              {headerHeight != 2 && 'expand'}
            </span>
          </div>
        </div>
        <div
          className="w-full"
          style={{
            aspectRatio: `9/${headerHeight}`,
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: '50% 25%',
            transition: 'all',
            transitionDuration: '120ms',
          }}
        >
          <div className="flex flex-col justify-center"></div>
        </div>
      </div>
      {alert({
        title: t('delete-calendar'),
        content: t('delete-calendar-confirm'),
        type: 16,
      })}
    </>
  );
}
