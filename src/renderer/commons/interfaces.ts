export interface FTheme {
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
  secondaryColor: string;
  holidayColor: string;
  lunarColor: string;
}

export interface FEvent {
  id: string;
  color: string;
  icon: string;
  name: string;
  date: FDate;
  duration: number;
  repeat: number;
  until?: FDate;
  description?: string;
  isInfinite?: boolean;
}

export interface FDate {
  year: number;
  month: number;
  day: number;
}

export interface FWeek {
  name: string;
  isHoliday: boolean;
}
export interface FMonth {
  name: string;
  days: number;
}
export interface FLunar {
  name: string;
  cycle: number;
}

export interface FCalendar {
  id: string;
  name: string;
  description: string;
  path: string;
  theme: FTheme;
  startDay: number;
  year: number;
  weeks: FWeek[];
  months: FMonth[];
  events?: FEvent[];
  lunars?: FLunar[];
}

export interface CommonIdName {
  id: string;
  name: string;
  path: string;
  description?: string;
}

export interface FRender {
  date: FDate;
  type: number;
  row: number;
}

export interface FEventRender {
  event: FEvent;
  renders: FRender[];
}

export interface FIndex {
  version: string;
  files: CommonIdName[];
  settings: FSetting;
  credits: FCredit[];
  license: boolean;
}

export interface FSetting {
  language: string;
  theme: 'light' | 'dark';
}

export interface FCredit {
  name: string;
  url: string;
}

export interface FUpdate {
  version: string;
  date: string;
  title: string;
  content: string[];
}

export enum RepeatType {
  None = 'none',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'yearly',
  LunarYearly = 'lunar-yearly',
  LunarMonthly = 'lunar-monthly',
}
