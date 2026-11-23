import { Colors } from '@/renderer/commons/constants';

export default function Badge(props: {
  text: string;
  color?: 'light' | 'dark' | 'info' | 'warning' | 'error' | 'success';
  backgroundColor?: string;
}) {
  return (
    <div
      className={`px-2 py-1 rounded-full text-xs font-semibold ${props.color ? `text-${props.color}-600` : 'text-stone-600'}`}
      style={{
        backgroundColor:
          props.backgroundColor || (props.color ? `${Colors[props.color]}cc` : 'var(--stone-100)'),
      }}
    >
      {props.text}
    </div>
  );
}
