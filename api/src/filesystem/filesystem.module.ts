import { Module } from '@nestjs/common';
import { DateScalar } from '../common/scalars/date.scalar';
import { FileSystemResolver } from './filesystem.resolver';
import { FileSystemService } from './filesystem.service';

@Module({
  providers: [FileSystemResolver, FileSystemService, DateScalar],
})
export class FileSystemModule {}
