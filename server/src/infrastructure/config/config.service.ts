import { v4 as uuid } from 'uuid';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';

export interface Config {
  id: string;
  env: string;
  name: string;
  prefix: string;
  port: number;
  sequelize: SequelizeConfig;
}

export interface SequelizeConfig {
  dialect: Dialect;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  autoLoadModels: boolean;
  synchronize: boolean;
  models: [];
}

export interface SequelizeEnv {
  database?: string;
  user?: string;
  password?: string;
  host?: string;
  port?: string;
  uri?: string;
  credentials?: {
    uri?: string;
  };
}

export interface ConfigEnv {
  name: string;
  prefix: string;
  port: number;
  sequelize?: SequelizeEnv;
}

export class ConfigService {
  private readonly config: Config;

  constructor(envs: { [k: string]: ConfigEnv }) {
    if (!envs) {
      throw new Error('No Service Config provided');
    }
    const envKey = process.env.PROD_ENV || 'development';
    const env: ConfigEnv = envs[envKey];
    if (!env) {
      throw new Error(`No Service Config for ${envKey} environment provided`);
    }

    // Sequelize
    const sequelize: SequelizeConfig = {
      dialect: (process.env.DB_DIALECT as Dialect) || 'sqlite',
      host: process.env.DB_HOSTNAME || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'deel',
      autoLoadModels: true,
      synchronize: true,
      models: [],
    };

    this.config = {
      id: uuid(),
      name: env.name || '',
      port: +process.env.PORT || env.port || 3000,
      prefix: process.env.PREFIX || env.prefix || '',
      env: process.env.NODE_ENV || 'development',
      sequelize,
    };
  }

  public getConfig(): Config {
    return this.config;
  }

  public getEnvironment(): string {
    return this.config.env;
  }

  public getSequelize(): SequelizeModuleOptions {
    return this.config.sequelize;
  }

  public getPort(): number {
    return this.config.port;
  }

  public getPrefix(): string {
    return this.config.prefix;
  }
}
