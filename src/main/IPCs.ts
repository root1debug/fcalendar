import { IpcMainEvent, IpcMainInvokeEvent, ipcMain, shell } from 'electron';
import { version } from '../../package.json';
import { join } from 'path';
import { readFile, writeFile, readdir, mkdir, unlink } from 'fs';
import { initializeFolder } from './manager/file-manager';
import { basePath } from './constants';
import { IPCResponse } from './interface';
import { Base64ToImageBuffer } from './utils';

/*
 * IPC Communications
 * */
export default class IPCs {
  static initialize(): void {
    // Get application version
    ipcMain.on('msgRequestGetVersion', (event: IpcMainEvent): IPCResponse => {
      event.returnValue = version;
      return { success: true, data: version };
    });

    // Open url via web browser
    ipcMain.on('msgOpenExternalLink', async (event: IpcMainEvent, url: string) => {
      await shell.openExternal(url);
    });

    ipcMain.handle('msgInitialize', async (event: IpcMainInvokeEvent, defaultIndex: any) => {
      return initializeFolder(JSON.stringify(defaultIndex));
    });

    ipcMain.handle(
      'msgSaveFile',
      async (event: IpcMainInvokeEvent, data: string, filename: string) => {
        // save file with data and filename
        return writeFile(join(basePath.uploads, filename), data, 'utf-8', (err) => {
          if (err) {
            return { success: false, error: err.message };
          } else {
            return { success: true };
          }
        });
      },
    );

    ipcMain.handle('msgLoadFile', async (event: IpcMainInvokeEvent, filename: string) => {
      // load file with filename and return data
      return new Promise((resolve, reject) => {
        readFile(join(basePath.uploads, filename), 'utf-8', (err, data) => {
          if (err) {
            resolve({ success: false, error: err.message });
          } else {
            resolve({ success: true, data });
          }
        });
      });
    });

    ipcMain.handle('msgDeleteFile', async (event: IpcMainInvokeEvent, filename: string) => {
      // delete file with filename
      return new Promise((resolve, reject) => {
        readdir(join(basePath.uploads, 'calendars'), (err, files) => {
          if (err) {
            resolve({ success: false, error: err.message });
          } else {
            const filePath = join(basePath.uploads, 'calendars', filename);
            if (files.includes(filename)) {
              writeFile(filePath, '', 'utf-8', (err) => {
                if (err) {
                  resolve({ success: false, error: err.message });
                } else {
                  resolve({ success: true });
                }
              });
            } else {
              resolve({ success: false, error: 'File not found' });
            }
          }
        });
      });
    });

    ipcMain.handle('msgSaveCalendar', async (event: IpcMainInvokeEvent, data: any) => {
      // save calendar data and image
      readFile(basePath.index, 'utf-8', async (err, index) => {
        if (err) {
          return { success: false, error: err.message };
        } else {
          const newFileName = `${data.id}.json`;
          const newFilePath = join(basePath.calendars, newFileName);
          if (data.path && data.path !== newFilePath) {
            const { buffer, fileType } = await Base64ToImageBuffer(data.path);
            writeFile(
              join(basePath.images, `${data.id}.${fileType.split('/')[1]}`),
              buffer,
              (err) => {
                if (err) {
                  return { success: false, error: err.message };
                } else {
                  return { success: true };
                }
              },
            );
            data.path = `${data.id}.${fileType.split('/')[1]}`;
            // save only relative path
          }
          return writeFile(newFilePath, JSON.stringify(data), 'utf-8', (err) => {
            if (err) {
              return { success: false, error: err.message };
            } else {
              const indexJson = JSON.parse(index);
              indexJson.files.push({
                id: data.id,
                name: data.name,
                path: data.path,
                description: data.description,
              });
              return writeFile(basePath.index, JSON.stringify(indexJson), 'utf-8', (err) => {
                if (err) {
                  return { success: false, error: err.message };
                } else {
                  return { success: true };
                }
              });
            }
          });
        }
      });
    });

    ipcMain.handle('msgLoadImage', async (event: IpcMainInvokeEvent, filename: string) => {
      return new Promise((resolve, reject) => {
        readFile(join(basePath.images, filename), (err, data) => {
          if (err) {
            resolve({ success: false, error: err.message });
          } else {
            const base64 = `data:image/${filename.split('.').pop()};base64,${data.toString('base64')}`;
            resolve({ success: true, data: base64 });
          }
        });
      });
    });

    ipcMain.handle('msgDeleteCalendar', async (event: IpcMainInvokeEvent, id: string) => {
      // delete file with filename
      return new Promise((resolve, reject) => {
        readdir(join(basePath.uploads, 'calendars'), (err, files) => {
          if (err) {
            resolve({ success: false, error: err.message });
          } else {
            const fileName = `${id}.json`;
            const filePath = join(basePath.uploads, 'calendars', fileName);
            if (files.includes(fileName)) {
              unlink(filePath, (err) => {
                if (err) {
                  resolve({ success: false, error: err.message });
                } else {
                  const indexFilePath = join(basePath.uploads, 'index.json');
                  readFile(indexFilePath, 'utf-8', (err, indexData) => {
                    if (err) {
                      resolve({ success: false, error: err.message });
                    } else {
                      const indexJson = JSON.parse(indexData);
                      indexJson.files = indexJson.files.filter((file: any) => file.id !== id);
                      writeFile(indexFilePath, JSON.stringify(indexJson), 'utf-8', (err) => {
                        if (err) {
                          resolve({ success: false, error: err.message });
                        } else {
                          resolve({ success: true });
                        }
                      });
                    }
                  });

                  resolve({ success: true });
                }
              });
            } else {
              resolve({ success: false, error: 'File not found' });
            }
          }
        });
      });
    });
  }
}
