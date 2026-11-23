import { useState } from 'react';

export default function useSystem() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const saveFile = async (
    data: string,
    filename: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const result = await window.mainApi.invoke('msgSaveFile', data, filename);
    setIsLoading(false);
    return result;
  };

  const loadFile = async (
    filename: string,
  ): Promise<{ success: boolean; data?: string; error?: string }> => {
    setIsLoading(true);
    const result = await window.mainApi.invoke('msgLoadFile', filename);
    setIsLoading(false);
    return result;
  };

  const deleteFile = async (filename: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const result = await window.mainApi.invoke('msgDeleteFile', filename);
    setIsLoading(false);
    return result;
  };

  return [isLoading, saveFile, loadFile, deleteFile] as const;
}
