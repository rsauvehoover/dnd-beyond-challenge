# DDB Back End Developer Challenge

### Overview

This is my implementation of the hp management API for the DnD beyond backend developer challenge. It uses an in memory mongodb database [(mongodb-memory-server)](https://github.com/typegoose/mongodb-memory-server) to simulate having a database without having to spin up a local db to test/develop the API.

### Assumptions

- "Persist throughout the application's lifetime" means that persistence should only last so long as the service is running and reset when closed (i.e. persisent database not required) and since character info is initialized at startup, it should start with all the character data from provided in `data/`
- The provided hp in the character json is the maximum hp of the character, and the api does not need to calculate it on load as ordinarily max hp would depend on a number of unknown variables.

### Usage

- Character files can be added to the `data/` folder and will populate the database on startup.
- By default the api will run on `localhost:3000`, but the port can be set with the `PORT` environment variable
- For manual api use/testing the swagger page can be used at `localhost:3000/api-docs/`

#### Install

```bash
npm install
```

#### Local Development

Since the local database is an in-memory instance of mongodb, local development instance can simply be started with the following

```bash
npm run dev
```

#### Build and serve

```bash
npm run build
```

```bash
npm run start
```

#### Test

```bash
npm run test
```

## Api Endpoints

#### `GET /characters`

Returns a list of characters

##### response

```json
[
   {
      "name": "briv",
      "stats": [...],
      ...
   },
   ...
]
```

#### `GET /characters/{name}`

Return a specified character or not found if character doesn't exist

##### response

```json
{
   "name": "briv",
   "stats": [...],
   ...
}
```

#### `POST /characters/heal`

Post body takes character name and a heal value and returns the updated character object

##### body

```json
{
  "name": "briv",
  "value": 5
}
```

##### response

```json
{
   "name": "briv",
   "hitPoints": 20,
   ...
}
```

#### `POST /characters/dealDamage`

Post body takes character name and a list of damage instances to be applied sequentially and returns the updated character object

##### body

```json
{
  "name": "briv",
  "damageInstances": [
    {
      "type": "bludgeoning",
      "roll": 5
    }
  ]
```

##### response

```json
{
   "name": "briv",
   "hitPoints": 20,
   ...
}
```

#### `POST /characters/addTemporaryHp`

Post body takes character name and a temporary hp value and returns the updated character object

##### body

```json
{
  "name": "briv",
  "value": 5
}
```

##### response

```json
{
   "name": "briv",
   "temporaryHitPoints": 5,
   ...
}
```
