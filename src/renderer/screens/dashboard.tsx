import { useEffect, useState } from 'react';
import { defaultIndex } from '../commons/utils';
import i18n from '../i18n';
import useSystem from '../hooks/use-system';
import { FIndex } from '../commons/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import CalendarItem from '../components/dashboard/calendar-item';
import CalendarItemAdd from '../components/dashboard/calendar-item-add';
import { useModal } from '../hooks/use-modal';
import CalendarAdd from '../components/modals/calendar-add';
import Loading from '../components/commons/loading';
import Settings from '../components/modals/settings';
import Help from '../components/modals/help';
import { useTranslation } from 'react-i18next';
import { addErrorMessage, setTheme } from '../store/slices/appScreenSlice';
import { useNavigate } from 'react-router-dom';

export default function DashBoard() {
  const nav = useNavigate();
  const [index, setIndex] = useState<FIndex>();
  const [t] = useTranslation();
  const [loading, saveFile, loadFile, deleteFile] = useSystem();
  const appScreen = useSelector((state: any) => state.appScreen);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  const [refresh, setRefresh] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'help' | 'settings' | 'calendar-add' | 'error'>(
    'help',
  );
  const [ModalContainer, isOpen, openModal, closeModal] = useModal();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const primaryLanguage = i18n.languages[0];
        if (!primaryLanguage || !['en', 'ko', 'jp'].includes(primaryLanguage)) {
          i18n.changeLanguage('en');
        }
        i18n.changeLanguage(primaryLanguage);
        dispatch(setTheme('light'));
        const result = await window.mainApi.invoke('msgInitialize', {
          ...defaultIndex,
          settings: { ...defaultIndex.settings, language: i18n.languages[0] },
        });
        dispatch(addErrorMessage('msg init :' + JSON.stringify(result)));
      } catch (err) {
        setIsLoading(false);
      }

      loadFile('index.json')
        .then((index) => {
          if (index && index.data) {
            const parsedJson = JSON.parse(index.data);
            setIndex(parsedJson as FIndex);
          }
        })
        .catch((err) => {
          dispatch(addErrorMessage('load file index.json: ' + err.message));
        });
      setIsLoading(false);
    };
    init();
    //console.log('useEffect init');
  }, []);

  useEffect(() => {
    setIsLoading(true);
    loadFile('index.json').then((res) => {
      if (res && res.data) {
        const parsedJson = JSON.parse(res.data);
        setIndex(parsedJson as FIndex);
        i18n.changeLanguage(parsedJson?.settings?.language ?? 'en');
        dispatch(setTheme(parsedJson?.settings?.theme ?? 'light'));
      }
    });
    setIsLoading(false);
  }, [refresh]);

  useEffect(() => {
    if (count >= 5) {
      setModalType('error');
      openModal();
      setCount(0);
    }
  }, [count]);

  const gnbs = [
    {
      icon: 'help',
      label: 'Help',
      onClick: () => {
        setModalType('help');
        openModal();
      },
    },
    {
      icon: 'settings',
      label: 'Settings',
      onClick: () => {
        setModalType('settings');
        openModal();
      },
    },
  ];

  useEffect(() => {
    if (index && !index?.license) {
      nav('/license');
    }
  }, [index]);

  return (
    <>
      <div
        className={`${appScreen.theme}`}
        style={{
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
        }}
      >
        <Loading isLoading={isLoading} />
        <div className="flex justify-between items-center h-10 underline-box px-2">
          <div className="clickable" onClick={() => setCount(count + 1)}>
            <img src="images/fcalendar-logo.png" alt="FCalendar Logo" width="30" />
          </div>

          <div>
            <ul className="flex gap-3">
              {gnbs.map((g, i) => (
                <li
                  key={i}
                  className="gnb-item h-full flex items-center clickable"
                  onClick={g.onClick}
                >
                  <span className="material-symbols-rounded icon-hover">{g.icon}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Content Area */}
        <div className="p-8 h-full overflow-auto bg">
          <ul>
            {index?.files.map((item, i) => (
              <li key={i} className="mb-7">
                <CalendarItem item={item} />
              </li>
            ))}
            <li
              key={'add-new'}
              className="mb-2"
              onClick={() => {
                setModalType('calendar-add');
                openModal();
              }}
            >
              <CalendarItemAdd />
            </li>
          </ul>
        </div>
      </div>
      {/* Content Area */}
      {ModalContainer(
        modalType === 'help'
          ? { title: t('help'), children: <Help /> }
          : modalType === 'settings'
            ? { title: t('settings'), children: <Settings onClose={closeModal} /> }
            : modalType === 'calendar-add'
              ? {
                  title: t('add-calendar'),
                  children: (
                    <CalendarAdd
                      mode="add"
                      onClose={() => {
                        closeModal();
                        setRefresh(!refresh);
                      }}
                    />
                  ),
                }
              : {
                  title: t('error'),
                  width: '400px',
                  children: (
                    <div className="p-4 w-full">
                      <h2 className="text-lg font-bold mb-2">{t('error')}</h2>
                      {appScreen.errorMessage?.map((msg, i) => (
                        <div key={i}>{msg}</div>
                      ))}
                    </div>
                  ),
                },
      )}
    </>
  );
}
