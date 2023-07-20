import { Field, ObjectType } from '@nestjs/graphql';
import { FileSystemItem } from './filesystem.item.model';
import { FileSystemNotifierActionType } from './filesystem.path.notifier.types';

@ObjectType({ description: 'FileSystemPathNotifier' })
export class FileSystemPathNotifier {
  @Field(type => String)
  path: string;

  @Field(type => String)
  action: FileSystemNotifierActionType;

  @Field(type => FileSystemItem, { nullable: true })
  result?: FileSystemItem;
}
