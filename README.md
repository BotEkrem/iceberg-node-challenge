# Iceberg Node Challenge
## Installation
```shell
# Fetch from Git
git clone https://github.com/BotEkrem/iceberg-node-challenge.git
cd ./iceberg-node-challenge

# docker-compose 
cd docker
docker-compose up --build # you can run with -d flag after successfully built

# Project
cp .env-example .env
npm install
# If you don't have installed ts-node and nodemon, please run "npm install -g ts-node nodemon" before

# Sample Data to DB
npm run generate

# Sync DB to ElasticSearch
npm run elastic-sync

# To purge all ElasticSearch Indices (optional)
npm run elastic-purge

# Finally, to start the app
npm start
```

## ORM and Raw Query
I used ORM in the Auth module and Raw Query in other modules. I thought it would be better for information if you saw both. You can see them in `modules` folder.

## Postman Documentation
You can find Postman Collection file in `documentation` folder.