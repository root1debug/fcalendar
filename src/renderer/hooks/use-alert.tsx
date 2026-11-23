import { JSX, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export function useAlert() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [btnResult, setBtnResult] = useState<number>(0);
  const appScreen = useSelector((state: any) => state.appScreen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const openAlert = () => {
    setBtnResult(0);
    setIsOpen(true);
  };

  const closeAlert = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (modalRef.current && modalContentRef.current && isOpen) {
      modalRef.current.style.visibility = 'visible';
      modalContentRef.current.style.visibility = 'visible';
      modalRef.current.style.animation = 'modalPop 0.2s ease-out';
      modalContentRef.current.style.animation = 'modalContentPop 0.2s ease-out';

      modalRef.current.style.display = 'flex';
      modalContentRef.current.style.display = 'grid';
    } else if (modalRef.current && modalContentRef.current && !isOpen) {
      modalRef.current.style.animation = 'modalClose 0.2s ease-out';
      modalContentRef.current.style.animation = 'modalContentClose 0.2s ease-out';

      const timeout = setTimeout(() => {
        modalRef.current!.style.display = 'none';
        modalContentRef.current!.style.display = 'none';

        modalRef.current!.style.visibility = 'hidden';
        modalContentRef.current!.style.visibility = 'hidden';
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  return [
    ({ title, content, type }: { title: string; content: string; type: number }) => {
      return (
        <div className={`${appScreen.theme}`}>
          <div className={`modal-overlay z-999`} ref={modalRef} style={{ visibility: 'hidden' }}>
            <div
              className={`modal-content gap-2`}
              ref={modalContentRef}
              style={{
                width: '300px',
                height: 'auto',
                maxHeight: '90%',
                overflowY: 'auto',
                gridTemplateRows: '28px minmax(0, 1fr)',
                visibility: 'hidden',
              }}
            >
              <div className="w-full h-full flex items-center gap-2 mb-3" onClick={closeAlert}>
                <span className="material-symbols-rounded cursor-pointer">close</span>
                <h2 className="text-xl font-semibold">{title}</h2>
              </div>
              <div className="w-full h-full">
                <p>{content}</p>
              </div>
              <div className="w-full flex justify-end gap-2">
                {Object.values(alertButtonTypes).map((value) => {
                  if ((type & value) === value) {
                    return (
                      <div
                        key={value}
                        onClick={() => {
                          setBtnResult(value);
                          closeAlert();
                        }}
                        className="button button-primary cursor-pointer transition duration-120 text-sm"
                      >
                        {Object.keys(alertButtonTypes).find(
                          (key) => alertButtonTypes[key] === value,
                        )}
                      </div>
                    );
                  } else {
                    return <></>;
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      );
    },
    isOpen,
    btnResult,
    openAlert,
    closeAlert,
  ] as const;
}

const alertButtonTypes = {
  CANCEL: 2 << 0,
  NO: 2 << 1,
  OKAY: 2 << 2,
  YES: 2 << 3,
};
