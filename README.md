# GARYSUM888's Northcoders News API


## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).


## Steps to run this project locally


1. Clone this repo to your local environment (https://github.com/garysum88/BE-NC-News.git). Change directory to this repo in the command line interface terminal.


2. Create .env.test and .env.developement. for the name of database name, it can be any database. However, you need to make sure that the names must match with the names specified in db/setup.sql

    .env.test: 

    ```
    PGDATABASE=database_name_here
    ```

    .env.development: 

    ```
    PGDATABASE=database_name_here
    ```


3. Execute the following in CLI to execute the database     set-up and seeding process...

    ```
    npm run setup-dbs
    npm run seed
    ```





