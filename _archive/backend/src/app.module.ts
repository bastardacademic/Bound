import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { JournalModule } from './journal/journal.module';
import { MessagingModule } from './messaging/messaging.module';
import { ModerationModule } from './moderation/moderation.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    AuthModule,
    JournalModule,
    MessagingModule,
    ModerationModule,
    UserModule,
  ],
})
export class AppModule {}
