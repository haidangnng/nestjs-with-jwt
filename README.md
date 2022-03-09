----------
# Getting started

## Installation

Clone the repository

    git clone git@github.com:haidangnng/nestjs-with-jwt.git

Switch to the repo folder

    cd nestjs-with-jwt
    
Install dependencies
    
    npm install

Copy config file and set JsonWebToken secret key

    cp src/config.ts.example src/config.ts
    
----------

##### Prisma

----------

To run the example with Prisma checkout branch `prisma`, remove the node_modules and run `npm install`

Create a new mysql database with the name `nestjsrealworld-prisma` (or the name you specified in `prisma/.env`)

Copy prisma config example file for database settings

    cp prisma/.env.example prisma/.env

Set mysql database settings in prisma/.env

    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

To create all tables in the new database make the database migration from the prisma schema defined in prisma/schema.prisma

    npx prisma migrate dev --name init

Now generate the prisma client from the migrated database with the following command

    npx prisma generate

The database tables are now set up and the prisma client is generated. For more information see the docs:

- https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project-typescript-mysql


----------

## NPM scripts

- `npm start` - Start application
- `npm run start:watch` - Start application in watch mode
- `npm run start:prod` - Build application

----------
## Start application

- `npm start`
- Test api with `http://localhost:3000/api` in your favourite browser
