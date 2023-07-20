import { NotFoundException } from '@nestjs/common';
import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';

// GraphQL Subscriptions
import { PubSub } from 'graphql-subscriptions';

// FileSystem Service, Models & Types
import { FileSystemService } from './filesystem.service';
import { FileSystemItem } from './models/filesystem.item.model';
import { FileSystemPathNotifier } from './models/filesystem.path.notifier.model';

const pubSub = new PubSub();

@Resolver(of => FileSystemItem)
export class FileSystemResolver {

  constructor(private readonly fileSystemService: FileSystemService) {}

  @Query(returns => FileSystemItem)
  async getInitialDirectoryPath(): Promise<FileSystemItem> {

    // Initial mount directory
    const fileSystemItemPath = await this.fileSystemService.getFileSystemPath('');
    if (!fileSystemItemPath || fileSystemItemPath === null) {
      throw new NotFoundException();
    }

    return fileSystemItemPath;
  }

  @Query(returns => [FileSystemItem])
  async getPathDirectoriesAndFiles(@Args('directoryPath') directoryPath: string, @Args('limit', { nullable: true }) limit?: number): Promise<FileSystemItem[]> {

    // Validate path
    const fileSystemItemPath = await this.fileSystemService.getFileSystemPath(directoryPath);
    if (!fileSystemItemPath || fileSystemItemPath === null) {
      throw new NotFoundException(directoryPath);
    }

    // Publish that the directory changed
    await this.fileSystemService.publishFileSystemNotifierData(pubSub, {
      path: fileSystemItemPath.path || directoryPath,
      action: 'changed',
      result: null
    });

    // Read directory content
    const results: FileSystemItem[] = [];
    const pathDirectoriesAndFilesIterator = this.fileSystemService.getPathDirectoriesAndFiles(fileSystemItemPath.path || directoryPath);
    for await (const pathDirectoryItem of pathDirectoriesAndFilesIterator) {

      /**
       * @TODO complete pub/sub approach to read directory content items of 50,000+
       */
      this.fileSystemService.publishFileSystemNotifierData(pubSub, {
        path: fileSystemItemPath.path || directoryPath,
        action: 'updated',
        result: pathDirectoryItem
      });

      results.push(pathDirectoryItem);
    }

    return results;
  }

  @Subscription(returns => FileSystemPathNotifier)
  fileSystemPathNotifier() {
    return pubSub.asyncIterator('fileSystemPathNotifier');
  }
}
