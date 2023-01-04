import { Module } from '@nestjs/common';
import { config } from './app.config';
import { ConfigService } from './infrastructure/config';
import { ConfigModule } from './infrastructure/ioc';
import { DatabaseModule } from './infrastructure/ioc/database.module';
import { AuthModule } from './infrastructure/ioc/auth.module';
import { ProfileModule } from './infrastructure/ioc/profile.module';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot(config), ProfileModule, AuthModule],
  providers: [
    {
      provide: 'CONFIG',
      useValue: new ConfigService(config).getConfig(),
    },
  ],
})
export class AppModule {}
