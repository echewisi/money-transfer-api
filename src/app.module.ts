import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisConfigModule } from './database/redis.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module'; // DatabaseModule import
import { AuthModule } from './authentication/auth.module'; // AuthModule import
import { UsersModule } from './users/users.module'; // UsersModule import
import { TransfersModule } from './transfers/transfer.module'; // TransfersModule import

@Module({
  imports: [
    RedisConfigModule, //redis config module
    DatabaseModule, // Database for TypeORM
    AuthModule, // Authentication module
    UsersModule, // Users-related logic module
    TransfersModule, // Transfers-related logic module
    CacheModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
