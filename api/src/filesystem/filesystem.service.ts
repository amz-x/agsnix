import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

// Models & Types
import { FileSystemItem } from './models/filesystem.item.model';
import { FileSystemPathNotifier } from './models/filesystem.path.notifier.model';
import { FileSystemItemType } from './models/filesystem.item.types';

// Node.js Modules & Functions
import { isAbsolute, normalize, parse } from 'node:path';
import { access, constants, opendir, stat } from 'node:fs/promises';
import { Stats } from 'node:fs';

// Mime Type Lookup
import { lookup } from 'mime-types';

@Injectable()
export class FileSystemService {

  private API_DOCKER_ACTIVE = process.env.API_DOCKER_ACTIVE ? true : false;
  private API_CONTAINER_MOUNT_DIR = process.env.API_CONTAINER_MOUNT_DIR || '/host';
  private API_HOST_MOUNT_DIR = process.env.API_HOST_MOUNT_DIR || '/';

  /**
   * Filesystem Path for API
   */
  pathDirectoryNormalized(path: string): string {
    if (this.API_DOCKER_ACTIVE && !path.startsWith(this.API_CONTAINER_MOUNT_DIR)) {
      if (path === this.API_HOST_MOUNT_DIR) {
        return normalize(`${this.API_CONTAINER_MOUNT_DIR}`);
      }

      if (path.startsWith(this.API_HOST_MOUNT_DIR)) {
        return normalize(`${this.API_CONTAINER_MOUNT_DIR}${path.substring(this.API_HOST_MOUNT_DIR.length)}`);
      }

      return normalize(`${this.API_CONTAINER_MOUNT_DIR}${path}`);

    } else {
      return normalize(`${path}`);
    }
  }

  /**
   * Filesystem Path for APP
   */
  pathDirectoryFormatted(path: string): string {
    if (this.API_DOCKER_ACTIVE && path.startsWith(this.API_CONTAINER_MOUNT_DIR)) {
      return normalize(`${this.API_HOST_MOUNT_DIR}${path.substring(this.API_CONTAINER_MOUNT_DIR.length)}`);
    } else {
      return normalize(`${path}`);
    }
  }


  /**
   * Validates the directory path
   */
  pathDirectoryValid(path: string): boolean {
    // Validate
    if (path && typeof path === 'string' && path.length > 0) {
      return true;
    }

    return false;
  }

  /**
   * Validates that the directory exists and is absolute
   */
  pathDirectoryExistsAndAbsolute(path: string): boolean {
    // Validate
    if (this.pathDirectoryValid(path)) {
      return isAbsolute(this.pathDirectoryNormalized(path));
    }

    return false;
  }

  /**
   * Lookup the content-type associated with a file
   */
  getMimeTypeFromExt(filename: string): string {
    const mimeType = lookup(filename);
    if (mimeType === false) {
      return 'unknown';
    }

    return mimeType;
  }

  /**
   * Access Permissions
   *
   * @see [fs.constants]
   *
   * | Description | Mode           |
   * |-------------|----------------|
   * | READ        | constants.R_OK |
   * | WRITE       | constants.W_OK |
   * | EXECUTE     | constants.X_OK |
   *
   */
  private async getAccessPermissionByMode(path: string, mode: number): Promise<boolean> {
    try {
      await access(path, mode);
      return true;
    } catch (ex) {
      return false;
    }
  }

  /**
   * Stats information, basic wrapper for async stat function
   */
  private async getStats(path: string): Promise<Stats | null> {
    try {
      return await stat(path, { bigint: false });
    } catch (ex) {
      return null;
    }
  }

  /**
   * Publish Filesystem Notifier Data
   */
  async publishFileSystemNotifierData(pubSub: PubSub, data: FileSystemPathNotifier): Promise<void> {
    return pubSub.publish('fileSystemPathNotifier', {
      fileSystemPathNotifier: { ...data }
    });
  }

  /**
   * Basic file system path information
   */
  async getFileSystemPath(path: string): Promise<FileSystemItem | null> {

    // Defaults
    if (path === '') {
      path = this.API_HOST_MOUNT_DIR;
    }

    // Validate
    if (!this.pathDirectoryExistsAndAbsolute(path)) {
      return null;
    }

    // Path Normalized
    const pathNormalized = this.pathDirectoryNormalized(path);

    // Path Directory
    const pathParsed = parse(pathNormalized);
    if (pathParsed.ext === '') {
      return {
        path: this.pathDirectoryFormatted(pathNormalized),
        name: pathParsed.name,
      };
    }

    return null;
  }

  /**
   * An AsyncGenerator which retrieves all directories and files for provided directory path
   */
  async *getPathDirectoriesAndFiles(directoryPath: string): AsyncGenerator<FileSystemItem> {
    // Read directory content
    const directoryEntries = await opendir(this.pathDirectoryNormalized(directoryPath));
    for await (const directoryEntry of directoryEntries) {

      const pathDirectoryItemPath = directoryEntry.path;
      const pathDirectoryItemType = directoryEntry.isDirectory() ? 'dir' : 'file' as FileSystemItemType;
      const pathDirectoryItemMime = this.getMimeTypeFromExt(pathDirectoryItemPath);
      const pathDirectoryItemPathFormatted = this.pathDirectoryFormatted(pathDirectoryItemPath);
      const pathDirectoryItemPermissions = {
        read:     await this.getAccessPermissionByMode(pathDirectoryItemPath, constants.R_OK),
        write:    await this.getAccessPermissionByMode(pathDirectoryItemPath, constants.W_OK),
        execute:  await this.getAccessPermissionByMode(pathDirectoryItemPath, constants.X_OK),
      };
      const pathDirectoryItemStats = await this.getStats(pathDirectoryItemPath);

      // Build result item
      const pathDirectoryItem: FileSystemItem = {
        name:       directoryEntry.name,
        path:       pathDirectoryItemPathFormatted,
        type:       pathDirectoryItemType,
        mime:       pathDirectoryItemMime,
        read:       pathDirectoryItemPermissions.read,
        write:      pathDirectoryItemPermissions.write,
        execute:    pathDirectoryItemPermissions.execute,
        size:       pathDirectoryItemStats !== null ? pathDirectoryItemStats.size  : null,
        createdAt:  pathDirectoryItemStats !== null ? pathDirectoryItemStats.ctime : null,
        modifiedAt: pathDirectoryItemStats !== null ? pathDirectoryItemStats.mtime : null
      };

      yield pathDirectoryItem;
    }
  }
}
