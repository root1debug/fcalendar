import { FIndex } from '@/renderer/commons/interfaces';
import { useAlert } from '@/renderer/hooks/use-alert';
import useSystem from '@/renderer/hooks/use-system';
import i18n from '@/renderer/i18n';
import { setTheme } from '@/renderer/store/slices/appScreenSlice';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

export default function Help() {
  const [t] = useTranslation();

  const appScreen = useSelector((state: any) => state.appScreen);
  const dispatch = useDispatch();

  const openExternalLink = async (url: string): Promise<void> => {
    await window.mainApi.send('msgOpenExternalLink', url);
  };

  // useEffect(() => {
  //   if (alertResult != 0) {
  //     console.log('Alert Result:', alertResult);
  //   }
  // }, [alertResult]);

  return (
    <>
      <div className="h-full p-2" style={{ width: '400px' }}>
        <div className="text-lg font-bold">{t('help-intro')}</div>
        <div>{t('help-content')}</div>
        <div className="mt-2">
          <div
            onClick={() => openExternalLink('https://terminal-node.tistory.com/95')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="text-xs text-secondary flex items-center gap-1 border rounded px-1 py-0.5">
              <span className="material-symbols-rounded">code</span>
              Developer
            </div>
            ROOT <span className="text-xs text-secondary">(https://terminal-node.tistory.com)</span>
            <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>
              open_in_new
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ko', name: '한국어' },
];

const updates = [
  {
    version: '0.0.1',
    date: '2026-08-09',
    description: 'Demo release of FCalendar. Basic calendar functionalities are implemented.',
  },
];
