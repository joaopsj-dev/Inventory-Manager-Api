import { registerAs } from '@nestjs/config';

import { join } from 'path';

export default registerAs('database-prod', () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined');
  }

  return {
    type: 'postgres',
    url: databaseUrl,
    entities: [join(__dirname, '../**/*.entity.js')],
    synchronize: true,
    ssl: {
      rejectUnauthorized: false,
    },
  };
});
