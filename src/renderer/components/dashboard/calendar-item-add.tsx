import { CommonIdName } from '@/renderer/commons/interfaces';

export default function CalendarItemAdd() {
  const handleClick = () => {
    //console.log('Add New Calendar');
  };

  return (
    <>
      <div
        className="clickable card card-hover"
        onClick={handleClick}
        style={{
          maxWidth: '100%',
          width: '900px',
          height: '60px',
        }}
      >
        <div className="flex justify-center items-center h-full">
          <span className="material-symbols-rounded">add</span>
        </div>
      </div>
    </>
  );
}
