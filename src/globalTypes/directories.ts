namespace Directories {
  export type Type = 'folder' | 'file';
  export type Role = 'user' | 'admin';

  export type Entity = {
    type: Type;
    id: number;
    parentId: number | null;
    title: string;
    isOpened: boolean;
    children?: number[];
  };

  export type ExtendedEntity = {
    isOpened: boolean;
  } & Entity;
}
