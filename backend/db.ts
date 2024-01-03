import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'restaurant',
    password: 'Up@090859',
    port: 5432,
});

export {
    pool
};
