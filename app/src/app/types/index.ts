export type FileSystemItem = {
  name: string;
  path: string;
  size: number;
  type: 'dir' | 'file';
  mime: string;
  read: boolean;
  write: boolean;
  execute: boolean;
  createdAt: Date | string;
  modifiedAt: Date | string;
};

export type FileSystemItemExtended = FileSystemItem & {
  size: string;
  createdAt: string;
  modifiedAt: string;
}

export type Query = {
  getInitialDirectoryPath: FileSystemItem;
  getPathDirectoriesAndFiles: FileSystemItem[];
};
