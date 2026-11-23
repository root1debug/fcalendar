import { useEffect, useRef } from 'react';

export default function Loading(props: { isLoading: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (!props.isLoading) {
      ref.current.style.opacity = '0';
      const timeout = setTimeout(() => {
        ref.current!.style.display = 'none';
      }, 200);
      return () => {
        clearTimeout(timeout);
      };
    } else {
      ref.current.style.display = 'flex';
      ref.current.style.opacity = '1';
    }
  }, [props.isLoading]);

  return (
    <div
      className="flex justify-center items-center w-full h-full z-99 absolute top-0 left-0 bg transition-opacity duration-200"
      ref={ref}
    >
      <div className="spinner"></div>
    </div>
  );
}
