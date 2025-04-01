import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { JournalModule } from './journal/journal.module';

@Module({
  imports: [AuthModule, JournalModule],
})
export class AppModule {}
