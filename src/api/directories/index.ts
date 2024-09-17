// Internal
import { DirectoriesTreeMock } from '@/mocks/directories';

export const fetchDirectoriesTree = (): Promise<Directories.Entity[]> =>
  new Promise((resolve) =>
    setTimeout(() => resolve(DirectoriesTreeMock), 1000)
  );
