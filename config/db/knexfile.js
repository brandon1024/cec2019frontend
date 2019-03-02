module.exports = {
    development: {
        client: 'mysql',
        connection: {
            host     : process.env.DB_HOST || '127.0.0.1',
            user     : process.env.DB_USER || 'root',
            password : process.env.DB_PASS || 'password',
            database : 'mcpfrontend',
            charset  : 'utf8'
        },
        pool: { min: 2, max: 10 },
        acquireConnectionTimeout: 10000,
        debug: false,
        migrations: {
            directory: './migrations',
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: './seeds/dev'
        }
    },
    test: {
        client: 'mysql',
        connection: {
            host     : process.env.DB_HOST || '127.0.0.1',
            user     : process.env.DB_USER || 'root',
            password : process.env.DB_PASS || 'password',
            database : 'mcpfrontendtest',
            charset  : 'utf8'
        },
        pool: { min: 2, max: 10 },
        acquireConnectionTimeout: 10000,
        debug: false,
        migrations: {
            directory: './migrations',
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: './seeds/test'
        }
    },
    production: {
        client: 'mysql',
        connection: {
            host     : process.env.DB_HOST || '127.0.0.1',
            user     : process.env.DB_USER || 'root',
            password : process.env.DB_PASS || 'password',
            database : 'mcpfrontendprod',
            charset  : 'utf8'
        },
        pool: { min: 2, max: 10 },
        acquireConnectionTimeout: 10000,
        debug: false,
        migrations: {
            directory: './migrations',
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: './seeds/prod'
        }
    }
};