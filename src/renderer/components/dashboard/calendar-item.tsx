import { CommonIdName } from '@/renderer/commons/interfaces';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CalendarItem(props: { item: CommonIdName }) {
  const nav = useNavigate();
  const [image, setImage] = useState<string>('');

  const handleClick = () => {
    console.log(`navigate to calendar/${props.item.id}`);
    nav(`calendar/${props.item.id}`);
  };

  useEffect(() => {
    window.mainApi.invoke('msgLoadImage', props.item.path).then((res) => {
      if (res && res.data) {
        setImage(res.data as string);
      }
    });
  }, [props.item.path]);

  // todo : change background image url base
  return (
    <>
      <div
        className="relative card card-hover clickable"
        onClick={handleClick}
        style={{
          maxWidth: '100%',
          width: '900px',
          height: '200px',
          overflow: 'hidden',
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: '50% 25%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="card-mask p-4"></div>
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <div className="text-sm text-secondary">{props.item.description ?? ''}</div>
          <div className="text-lg text-primary">{props.item.name}</div>
        </div>
      </div>
    </>
  );
}
