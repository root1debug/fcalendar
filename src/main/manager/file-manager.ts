import fs, { readdir, readFile as fsReadFile, mkdir, writeFile as fsWriteFile } from 'fs';
import { join } from 'path';
import { basePath, homeDir } from '../constants';

export async function initializeFolder(
  defaultIndex: string,
): Promise<{ success: boolean; error?: string; data?: string }> {
  // check uploads folder exists
  try {
    const home = await readDir(homeDir);
    if (!home.success) {
      const createHome = await mkDir(homeDir);
      if (!createHome.success) {
        return { success: false, error: createHome.error + ` ${homeDir}` };
      }
    }
    const files = await readDir(basePath.uploads);
    if (!files.success) {
      const createUploads = await mkDir(basePath.uploads);
      if (!createUploads.success) {
        return { success: false, error: createUploads.error + ` ${basePath.uploads}` };
      } else {
        const createCalendars = await mkDir(basePath.calendars);
        if (!createCalendars.success) {
          return { success: false, error: createCalendars.error + ` ${basePath.calendars}` };
        }
        const createImages = await mkDir(basePath.images);
        if (!createImages.success) {
          return { success: false, error: createImages.error + ` ${basePath.images}` };
        }
        const writeIndex = await writeFile(basePath.index, defaultIndex);
        if (!writeIndex.success) {
          return { success: false, error: writeIndex.error + ` ${basePath.index}` };
        } else {
          return { success: true, data: 'create uploads folder' };
        }
      }
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message + ` ${basePath.uploads}` };
  }
}

export async function mkDir(
  path: string,
): Promise<{ success: boolean; error?: string; data?: string }> {
  return new Promise((resolve) => {
    mkdir(path, (err) => {
      if (err) {
        resolve({ success: false, error: err.message });
      } else {
        resolve({ success: true });
      }
    });
  });
}

export async function writeFile(
  path: string,
  data: string,
): Promise<{ success: boolean; error?: string; data?: string }> {
  return new Promise((resolve) => {
    fsWriteFile(path, data, 'utf-8', (err) => {
      if (err) {
        resolve({ success: false, error: err.message });
      } else {
        resolve({ success: true });
      }
    });
  });
}

export async function readDir(
  path: string,
): Promise<{ success: boolean; error?: string; data?: string[] }> {
  return new Promise((resolve) => {
    readdir(path, (err, files) => {
      if (err) {
        resolve({ success: false, error: err.message });
      } else {
        resolve({ success: true, data: files });
      }
    });
  });
}

export async function readFile(
  path: string,
): Promise<{ success: boolean; error?: string; data?: string }> {
  return new Promise((resolve) => {
    fsReadFile(path, 'utf-8', (err, data) => {
      if (err) {
        resolve({ success: false, error: err.message });
      } else {
        resolve({ success: true, data });
      }
    });
  });
}
