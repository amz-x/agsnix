import { Field, ObjectType } from '@nestjs/graphql';
import { FileSystemItemType } from './filesystem.item.types';

@ObjectType({ description: 'fileSystemItem' })
export class FileSystemItem {

  @Field(type => String, { nullable: true })
  path?: string;

  @Field(type => String, { nullable: true })
  name?: string;

  @Field(type => String, { nullable: true })
  type?: FileSystemItemType;

  @Field(type => String, { nullable: true })
  mime?: string;

  @Field(type => Boolean, { nullable: true })
  read?: boolean;

  @Field(type => Boolean, { nullable: true })
  write?: boolean;

  @Field(type => Boolean, { nullable: true })
  execute?: boolean;

  @Field(type => Number, { nullable: true })
  size?: number;

  @Field(type => Date, { nullable: true })
  createdAt?: Date;

  @Field(type => Date, { nullable: true })
  modifiedAt?: Date;
}
