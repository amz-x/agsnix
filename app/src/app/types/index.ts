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
};

export type FileSystemPathNotifier = {
  path: string;
  action: string;
  result: FileSystemItem | null;
};

export type Query = {
  getInitialDirectoryPath: FileSystemItem;
  getPathDirectoriesAndFiles: FileSystemItem[];
};

export type Subscription = {
  fileSystemPathNotifier: FileSystemPathNotifier;
};
