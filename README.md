# ThisNews (A News API)


## Background

**ThisNews** is a news API built on Node.JS trying to mimic the building of a real world backend service which should provide information to the front end archirecture.

In this API, user can have access to different articles, ratings and discussions just like Reddit. Functionalities of this API include the following:

* Fetch all articles available on the database
* Fetch articles by article_id and topic,
* Fetch comments of an article
* Post a comment to an article
* Delete a comment of an article
* Give an upvote to an article
* Generate a list of all authors
* Generate a list of all topics

ThisNews is built using Node.JS, Express and PostgreSQL



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





