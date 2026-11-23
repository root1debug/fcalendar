import { useEffect, useState } from 'react';

export default function LunarVisual(props: { cycle: number; days: number }) {
  const [percent, setPercent] = useState<number>(0);
  useEffect(() => {
    const half = Math.ceil(props.cycle / 2);
    const getDir = () => {
      if (props.days < half) {
        return 1;
      } else if (props.days == half) {
        return 0;
      } else {
        return -1;
      }
    };
    setPercent((props.days / props.cycle) * 100);
  }, [props.cycle, props.days]);

  return (
    <>
      <div className="h-30 w-30 bg-white rounded-full overflow-hidden relative" style={{}}>
        <div
          className="h-30 w-30 bg-black absolute"
          style={{
            left: `calc(${percent}%) `,
            borderRadius: `calc(${Math.abs(percent)}%)`,
          }}
        ></div>
      </div>
    </>
  );
}
