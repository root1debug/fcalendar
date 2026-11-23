import { useEffect, useState } from 'react';

export default function DropdownData(props: {
  id: string;
  index: number;
  list: string[];
  direction?: 'bottom' | 'top';
  disabled?: boolean;
  width?: number;
  onChange: (newIndex: number) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`#${props.id}`)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  return (
    <>
      <div
        className="relative w-full"
        style={{ width: props.width ? `${props.width}%` : '100%' }}
        id={props.id}
        onClick={() => !props.disabled && setOpen(!open)}
      >
        <div className="px-2 py-1 cursor-pointer box flex justify-between items-center">
          {props.list[props.index]}
          <span
            className="material-symbols-rounded transition-transform duration-200"
            style={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            arrow_drop_down
          </span>
        </div>
        <div
          className="absolute h-40 overflow-auto dropdown"
          style={{
            top: props.direction === 'top' ? 'auto' : '100%',
            bottom: props.direction === 'top' ? '100%' : 'auto',
            left: 0,
            right: 0,
            zIndex: 99,
            display: open ? 'block' : 'none',
            marginTop: props.direction === 'top' ? '0' : '4px',
            marginBottom: props.direction === 'top' ? '4px' : '0',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <ul>
            {props.list.map((item, i) => (
              <li
                key={props.id + i}
                className="dropdown-item"
                onClick={() => {
                  props.onChange(i);
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
