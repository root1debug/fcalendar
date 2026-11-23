import {
  FCalendar,
  FDate,
  FEvent,
  FEventRender,
  FIndex,
  FRender,
  FTheme,
  RepeatType,
} from './interfaces';

export const defaultIndex: FIndex = {
  version: '0.0.1',
  files: [],
  settings: {
    language: 'en',
    theme: 'light',
  },
  credits: [],
  license: false,
};

export const defaultDate: FDate = {
  year: 0,
  month: 0,
  day: 0,
};

export const defaultEvent: FEvent = {
  id: '',
  color: '',
  icon: '',
  name: 'new-event',
  date: defaultDate,
  duration: 1,
  description: '',
  repeat: 0,
};

export const defaultTheme: FTheme = {
  backgroundColor: '#ffffff',
  textColor: '#000000',
  primaryColor: '#007bff',
  secondaryColor: '#6c757d',
  holidayColor: '#dc3545',
  lunarColor: '#ffc107',
};

export const defaultCalendar: FCalendar = {
  id: 'default',
  name: 'default',
  description: 'Default Calendar',
  path: '',
  theme: defaultTheme,
  startDay: 0,
  year: 0,
  weeks: [
    { name: 'Sun', isHoliday: true },
    { name: 'Mon', isHoliday: false },
    { name: 'Tue', isHoliday: false },
    { name: 'Wed', isHoliday: false },
    { name: 'Thu', isHoliday: false },
    { name: 'Fri', isHoliday: false },
    { name: 'Sat', isHoliday: true },
  ],
  months: [
    {
      name: 'January',
      days: 31,
    },
    {
      name: 'February',
      days: 28,
    },
    {
      name: 'March',
      days: 31,
    },
    {
      name: 'April',
      days: 30,
    },
    {
      name: 'May',
      days: 31,
    },
    {
      name: 'June',
      days: 30,
    },
    {
      name: 'July',
      days: 31,
    },
    {
      name: 'August',
      days: 31,
    },
    {
      name: 'September',
      days: 30,
    },
    {
      name: 'October',
      days: 31,
    },
    {
      name: 'November',
      days: 30,
    },
    {
      name: 'December',
      days: 31,
    },
  ],
  lunars: [
    {
      //id: 'moon',
      name: 'moon',
      //offset: 0,
      cycle: 29,
    },
  ],
};

export const emptyCalendar: FCalendar = {
  id: '',
  name: '',
  description: '',
  path: '',
  startDay: 0,
  year: 0,
  weeks: [],
  months: [],
  lunars: [],
  theme: defaultTheme,
};

export const EventDrawType = {
  NONE: -1,
  EXACT: 1,
  START: 2,
  BETWEEN: 3,
  END: 4,
};

export function GetDateId(calendar: FCalendar, date: FDate): number {
  const yearDays = calendar.months.reduce((prev, curr) => prev + curr.days, 0);
  const totalDays =
    date.year * yearDays +
    calendar.months.slice(0, date.month).reduce((prev, curr) => prev + curr.days, 0) +
    date.day;
  return totalDays;
}

export function AddDays(calendar: FCalendar, date: FDate, days: number): FDate {
  const yearDays = calendar.months.reduce((prev, curr) => prev + curr.days, 0);
  const totalDays = GetDateId(calendar, date) + days;

  const newYear = Math.floor(totalDays / yearDays);
  let remainingDays = totalDays % yearDays;
  let newMonth = 0;

  for (let i = 0; i < calendar.months.length; i++) {
    if (remainingDays < calendar.months[i].days) {
      newMonth = i;
      break;
    }
    remainingDays -= calendar.months[i].days;
  }

  const newDay = remainingDays;

  return {
    year: newYear,
    month: newMonth,
    day: newDay,
  };
}

export function AddMonths(calendar: FCalendar, date: FDate, months: number): FDate {
  const newYear = Math.floor((date.month + months) / calendar.months.length) + date.year;
  const newMonth = (date.month + months) % calendar.months.length;
  return {
    year: newYear,
    month: newMonth,
    day: date.day,
  };
}

export function GetDateDiff(calendar: FCalendar, date1: FDate, date2: FDate): number {
  const dateId1 = GetDateId(calendar, date1);
  const dateId2 = GetDateId(calendar, date2);
  return dateId2 - dateId1;
}

export function GetMonthDiff(calendar: FCalendar, date1: FDate, date2: FDate): number {
  const yearDiff = date2.year - date1.year;
  const monthDiff = date2.month - date1.month;
  const years = yearDiff * calendar.months.length;
  return years + monthDiff;
}

export function GetIsClipped(calendar: FCalendar, date1: FDate, date2: FDate): boolean {
  return GetDateDiff(calendar, date1, date2) < 0;
}

const YearGetFirstId = (calendar: FCalendar, year: number): number => {
  return GetDateId(calendar, { year: year, month: 0, day: 0 });
};

const YearGetLastId = (calendar: FCalendar, year: number): number => {
  return GetDateId(calendar, {
    year: year,
    month: calendar.months.length - 1,
    day: calendar.months[calendar.months.length - 1].days - 1,
  });
};

export const EncodeFileToBase64 = (fileBlob: Blob | File | undefined): Promise<string | null> => {
  if (!fileBlob) {
    return Promise.resolve(null);
  }
  const reader = new FileReader();
  reader.readAsDataURL(fileBlob);
  return new Promise((resolve) => {
    reader.onload = () => {
      resolve(reader.result as string | null);
    };
  });
};

export const FilterEventInYear = (
  calendar: FCalendar,
  year: number,
  events: FEvent[],
): FEvent[] => {
  const firstDate = { year: year, month: 0, day: 0 };
  const lastDate = {
    year: year,
    month: calendar.months.length - 1,
    day: calendar.months[calendar.months.length - 1].days - 1,
  };
  return events.filter((event) => {
    const eventStart = event.date;
    let eventEnd = event.until ? event.until : AddDays(calendar, event.date, event.duration - 1);
    if (event.isInfinite) {
      eventEnd = lastDate;
    }
    return (
      GetDateDiff(calendar, eventStart, lastDate) >= 0 &&
      GetDateDiff(calendar, firstDate, eventEnd) >= 0
    );
  });
};

export const GetEventRenderType = (event: FEvent, index: number): number => {
  if (event.duration <= 1) {
    return EventDrawType.EXACT;
  } else {
    if (index === 0) {
      return EventDrawType.START;
    } else if (index === event.duration - 1) {
      return EventDrawType.END;
    } else {
      return EventDrawType.BETWEEN;
    }
  }
};

export const GetEventRows = (
  calendar: FCalendar,
  dateDict: Map<number, number>,
  groups: FDate[][],
): FRender[] => {
  const renders: FRender[] = [];

  for (const dateGroup of groups) {
    let row = Math.max(
      ...dateGroup.map((date, index) => {
        const dateId = GetDateId(calendar, date);
        return dateDict.get(dateId) ?? 0;
      }),
    );
    dateGroup.forEach((date, index) => {
      renders.push({
        date: date,
        type: GetEventRenderType({ ...defaultEvent, duration: dateGroup.length }, index),
        row: row + 1,
      } as FRender);
      dateDict.set(GetDateId(calendar, date), row + 1);
    });
  }

  return renders;
};

export const MapEventToRender = (
  calendar: FCalendar,
  year: number,
  events: FEvent[],
): FEventRender[] => {
  const firstDateId = YearGetFirstId(calendar, year);
  const lastDateId = YearGetLastId(calendar, year);
  const filteredEvents = FilterEventInYear(calendar, year, events);

  const dateDict = new Map<number, number>();

  const renders: FEventRender[] = [];
  for (const event of filteredEvents) {
    let untilDateId = event.until ? GetDateId(calendar, event.until) : lastDateId;

    let startDateId = GetDateId(calendar, event.date);
    let startDurationId = startDateId + event.duration - 1;
    if (firstDateId > startDurationId) {
      startDateId = firstDateId;
    }
    if (event.isInfinite || untilDateId > lastDateId) {
      untilDateId = lastDateId;
    }
    let dateDiff = untilDateId - startDateId;
    let events: FDate[][] = [];

    // repeat event 0 none/1 weekly/2 monthly/3 yearly/4 lunar-yearly/5 lunar-monthly
    if (event.repeat === 0) {
      events = RepeatNone(calendar, event);
    } else if (event.repeat === 1) {
      events = RepeatWeekly(calendar, event, year);
    } else if (event.repeat === 2) {
      events = RepeatMonthly(calendar, event, year);
    } else if (event.repeat === 3) {
      events = [
        Array.from({ length: event.duration }, (_, i) => i).map((i) => {
          return { ...AddDays(calendar, event.date, i), year } as FDate;
        }),
      ];
    } else if (event.repeat === 4) {
    } else if (event.repeat === 5) {
    }

    //console.log('event' + event.repeat, JSON.stringify(events, null, 2));
    const newRender: FEventRender = {
      event: event,
      renders: GetEventRows(calendar, dateDict, events),
    };
    renders.push(newRender);
  }

  //console.log('renders', renders);
  return renders;
};

export const FindByDateFromRenders = (renders: FEventRender[], date: FDate): FEventRender[] => {
  return renders
    .map((render) => {
      return {
        ...render,
        renders: render.renders.filter(
          (r) =>
            r.date.year === date.year && r.date.month === date.month && r.date.day === date.day,
        ),
      };
    })
    .filter((r) => r.renders.length > 0) as FEventRender[];
};

const RepeatNone = (calendar: FCalendar, event: FEvent): FDate[][] => {
  return [
    Array.from({ length: event.duration }, (_, i) => i).map((i) =>
      AddDays(calendar, event.date, i),
    ),
  ];
};

const RepeatWeekly = (
  calendar: FCalendar,
  event: FEvent, // original event
  year: number, // target year
): FDate[][] => {
  const weekLength = calendar.weeks.length;
  const yearStartDateId = YearGetFirstId(calendar, year);
  const originStartDateId = GetDateId(calendar, event.date);
  const originEndDateId = GetDateId(calendar, AddDays(calendar, event.date, event.duration - 1));
  const originUntilDateId = event.isInfinite
    ? YearGetLastId(calendar, year)
    : event.until
      ? GetDateId(calendar, event.until)
      : YearGetLastId(calendar, year);

  const startDiff = yearStartDateId - originEndDateId;
  let rangeStartId = originStartDateId;
  if (startDiff > 0) {
    rangeStartId = originStartDateId + Math.ceil(startDiff / weekLength) * weekLength;
  }

  let rangeEndId = originUntilDateId;
  let offset = Math.floor((rangeStartId - originStartDateId) / weekLength);
  let n = Math.ceil((rangeEndId - rangeStartId + 1) / weekLength);

  return Array.from({ length: n }, (_, j) => {
    return Array.from({ length: event.duration }, (_, i) => i).map((i) =>
      AddDays(calendar, event.date, i + (j + offset) * calendar.weeks.length),
    );
  });
};

const RepeatMonthly = (calendar: FCalendar, event: FEvent, year: number): FDate[][] => {
  const firstDate = { year: year, month: 0, day: 0 } as FDate;
  const lastDate = {
    year: year + 1,
    month: 0,
    day: 0,
  } as FDate;

  const originEndDate = AddDays(calendar, event.date, event.duration - 1);

  let startDate = event.date;
  const monthDiff = GetMonthDiff(calendar, originEndDate, firstDate);
  if (monthDiff > 0) {
    startDate = AddMonths(calendar, event.date, monthDiff);
  }

  let untilDate = event.until ? event.until : lastDate;
  if (event.isInfinite || GetDateDiff(calendar, untilDate, lastDate) < 0) {
    untilDate = lastDate;
  }

  const endMonthDiff = GetMonthDiff(calendar, event.date, untilDate);
  let endDate = AddMonths(calendar, event.date, endMonthDiff);
  if (GetDateDiff(calendar, endDate, untilDate) < 0) {
    endDate = untilDate;
  }

  let offset = GetMonthDiff(calendar, event.date, startDate);
  let n = GetMonthDiff(calendar, startDate, endDate);

  return Array.from({ length: n }, (_, j) => {
    return Array.from({ length: event.duration }, (_, i) => i).map((i) =>
      AddDays(calendar, AddMonths(calendar, event.date, j + offset), i),
    );
  });
};

const RepeatYearly = (calendar: FCalendar, event: FEvent, year: number): FDate[][] => {
  return [[]];
};

const RepeatLunarYearly = (calendar: FCalendar, event: FEvent, year: number): FDate[][] => {
  return [[]];
};

const RepeatLunarMonthly = (calendar: FCalendar, event: FEvent, year: number): FDate[][] => {
  return [[]];
};
