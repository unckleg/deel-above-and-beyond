import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '../config';

@Global()
@Module({})
export class ConfigModule {
  static forRoot(config = {}): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: ConfigService,
          useValue: new ConfigService(config),
        },
      ],
      exports: [ConfigService],
    };
  }
}
