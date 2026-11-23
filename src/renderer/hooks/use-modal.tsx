import { JSX, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export function useModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
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
    ({
      title,
      width,
      height,
      children,
    }: {
      title: string;
      width?: string;
      height?: string;
      children: JSX.Element;
    }) => {
      return (
        <div className={`${appScreen.theme}`}>
          <div className={`modal-overlay`} ref={modalRef} style={{ visibility: 'hidden' }}>
            <div
              className={`modal-content gap-2`}
              ref={modalContentRef}
              style={{
                width: width || 'auto',
                height: height || '700px',
                maxHeight: '90%',
                gridTemplateRows: '28px minmax(0, 1fr)',
                visibility: 'hidden',
              }}
            >
              <div className="w-full h-full flex items-center gap-2 mb-3" onClick={closeModal}>
                <span className="material-symbols-rounded cursor-pointer">close</span>
                <h2 className="text-xl font-semibold">{title}</h2>
              </div>
              <div className="w-full h-full">{children}</div>
            </div>
          </div>
        </div>
      );
    },
    isOpen,
    openModal,
    closeModal,
  ] as const;
}
