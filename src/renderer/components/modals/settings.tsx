import { FIndex } from '@/renderer/commons/interfaces';
import { defaultIndex } from '@/renderer/commons/utils';
import { useAlert } from '@/renderer/hooks/use-alert';
import useSystem from '@/renderer/hooks/use-system';
import i18n from '@/renderer/i18n';
import { setTheme } from '@/renderer/store/slices/appScreenSlice';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

export default function Settings(props: { onClose: () => void }) {
  const [t] = useTranslation();
  const [isLoading, saveFile, loadFile, deleteFile] = useSystem();
  const [Alert, isAlertOpen, alertResult, openAlert, closeAlert] = useAlert();

  const [data, setData] = useState<FIndex | undefined>();
  const appScreen = useSelector((state: any) => state.appScreen);
  const dispatch = useDispatch();

  const openExternalLink = async (url: string): Promise<void> => {
    await window.mainApi.send('msgOpenExternalLink', url);
  };

  useEffect(() => {
    loadFile('index.json').then((res) => {
      if (res && res.data) {
        const parsedJson = JSON.parse(res.data);
        setData(parsedJson as FIndex);
      }
    });
  }, []);

  useEffect(() => {
    if (!data) return;
    saveFile(JSON.stringify(data), 'index.json');
  }, [data]);

  useEffect(() => {
    if (alertResult != 0) {
      //console.log('Alert Result:', alertResult);
    }
  }, [alertResult]);

  return (
    <>
      <div className="h-full p-2" style={{ width: '400px' }}>
        <div className="flex flex-col gap-2">
          <p className="">{t('language')}</p>
          <div className="flex gap-2">
            {languages.map((lang) => (
              <div
                key={lang.code}
                className={`${data?.settings.language === lang.code ? 'selected' : ''} button button-selection px-2 py-1 cursor-pointer transition duration-120 mb-3`}
                onClick={() => {
                  if (!data) return;
                  i18n.changeLanguage(lang.code);
                  setData({ ...data, settings: { ...data.settings, language: lang.code } });
                }}
              >
                {lang.name}
              </div>
            ))}
          </div>
          <p className="">{t('theme')}</p>
          <div className="flex gap-2 mb-6">
            <div
              className={`${appScreen.theme === 'light' ? 'selected' : ''} button button-selection px-2 py-1 cursor-pointer transition duration-120 mb-3`}
              onClick={() => {
                if (!data) return;
                setData({ ...data, settings: { ...data.settings, theme: 'light' } });
                dispatch(setTheme('light'));
              }}
            >
              {t('light')}
            </div>
            <div
              className={`${appScreen.theme === 'dark' ? 'selected' : ''} button button-selection px-2 py-1 cursor-pointer transition duration-120 mb-3`}
              onClick={() => {
                if (!data) return;
                setData({ ...data, settings: { ...data.settings, theme: 'dark' } });
                dispatch(setTheme('dark'));
              }}
            >
              {t('dark')}
            </div>
          </div>
          <p className="">{t('updates-note')}</p>
          <div className="mb-6">
            <ul>
              {updates.map((update) => (
                <li key={update.version} className="mb-2">
                  <p className="text-sm font-semibold">{update.version}</p>
                  <p className="text-xs text-secondary">{update.date}</p>
                  <p className="text-xs text-secondary">{update.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <p className="">{t('bug-reports')}</p>
          <span className="text-xs text-secondary">
            if you find any bugs or issues, you can contact the developer through the following
            blog. Your feedback will help improve the application.
          </span>
          <span className="text-xs text-secondary">
            버그나 불편 사항이 있다면 개발자에게 제보해 주십시오. 더 나은 어플리케이션을 만드는데
            도움이 됩니다.
          </span>
          {/* <div className="mb-6">
            <div
              onClick={() => openExternalLink('https://terminal-node.tistory.com')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="text-xs text-secondary flex items-center gap-1 border rounded px-1 py-0.5">
                <span className="material-symbols-rounded">report</span>
                Bug Report
              </div>

              <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>
                open_in_new
              </span>
            </div>
          </div>
          <p className="">{t('credits')}</p> */}
          <div className="mt-2">
            <div
              onClick={() => openExternalLink('https://terminal-node.tistory.com/95')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="text-xs text-secondary flex items-center gap-1 border rounded px-1 py-0.5">
                <span className="material-symbols-rounded">code</span>
                Developer
              </div>
              ROOT{' '}
              <span className="text-xs text-secondary">(https://terminal-node.tistory.com)</span>
              <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>
                open_in_new
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ko', name: '한국어' },
  { code: 'ja', name: '日本語' },
];

const updates = [
  {
    version: '0.0.1',
    date: '2026-08-09',
    description: 'Demo release of FCalendar. Basic calendar functionalities are implemented.',
  },
];
