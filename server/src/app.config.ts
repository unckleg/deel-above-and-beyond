import { ConfigEnv } from './infrastructure/config';

const env: { [k: string]: ConfigEnv } = {
  development: {
    name: 'deel-service',
    prefix: 'api',
    port: 3001,
    sequelize: {
      database: 'account',
    },
  },
};

env.production = {
  ...env.development,
  port: 3001,
};

export const config: { [k: string]: ConfigEnv } = env;
