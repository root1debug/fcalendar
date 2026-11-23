import { join } from 'path';
import os from 'os';

export const homeDir = join(os.homedir(), 'Documents', 'FantasyCalendar');

export const basePath = {
  uploads: join(homeDir, 'uploads'),
  index: join(homeDir, 'uploads', 'index.json'),
  calendars: join(homeDir, 'uploads', 'calendars'),
  images: join(homeDir, 'uploads', 'images'),
};
