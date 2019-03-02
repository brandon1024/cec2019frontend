## Creating and Running Database Migrations

### Initial Setup
Make sure you have knex installed globally:
```
npm install knex -g
```

### Creating a new Migration
```
knex migrate:make log_table --knexfile config/db/knexfile.js
```

This will create a migrations directory and place a a migration file inside of it.

Each migration is expecting two functions on its API, up and down. `up` is called when the migration is applied, and `down` is called on a migration rollback. To make it easier to run rollbacks, your down function should 'undo' your up function.

### Running Migrations
To run a newly created migration, run the following:
```
knex migrate:latest --env development --knexfile config/db/knexfile.js
knex migrate:latest --env test --knexfile config/db/knexfile.js
knex migrate:latest --env production --knexfile config/db/knexfile.js
```
*knex migrate:latest will run all unrun migrations*
### Rollback a Migration
To rollback all migrations, run the following:
```
knex migrate:rollback --env development --knexfile config/db/knexfile.js
```
