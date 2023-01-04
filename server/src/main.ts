import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { config } from './app.config';
import { ConfigService } from './infrastructure/config';
import { HttpExceptionFilter } from './infrastructure/rest/http-exception.filter';
import { ValidationPipe } from './infrastructure/rest/validation.pipe';
import { DatabaseSeeder } from './infrastructure/database/seeder/DatabaseSeeder';

async function bootstrap() {
  const configService = new ConfigService(config);
  const app = await NestFactory.create(AppModule);

  // Seed the database
  const seeder = await app.resolve<DatabaseSeeder>(DatabaseSeeder);
  await seeder.seed();

  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 50000,
    }),
  );
  app.use(
    rateLimit({
      windowMs: 1000 * 60 * 60,
      max: 1000, // 1000 requests por windowMs
      message: '⚠️  Too many request created from this IP, please try again after an hour',
    }),
  );

  // REST Global configurations
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.setGlobalPrefix(configService.getPrefix());

  const options = new DocumentBuilder()
    .setTitle(`Deel - Above & Beyond`)
    .setDescription('Deel - Above & Beyond')
    .setVersion('v1')
    .addApiKey({ type: 'apiKey', name: 'profile_id', in: 'header' }, 'Profile-ID')
    .build();

  // Swagger-OpenAPI
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  Logger.log('Mapped {/api, GET} Swagger api route', 'RouterExplorer');

  await app.listen(configService.getPort());

  Logger.log(`${configService.getConfig().name} (${configService.getConfig().id}) running on port ${configService.getPort()}`);
}

bootstrap();
