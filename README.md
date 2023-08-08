# Patrick Morton Todo App

## Installation

1. Install packages

```
npm i
```

2. Copy example env files and remove `.example` suffix

e.g.
```
cp .env.development.example .env.development
```

## Build

### Vue Frontend

Run
```
npm run build:{env}
```

## Deploy

### Serverless backend

Run
```
deploy:{env}
```
Note: for offline development you will need to spin up the front end using `npm run dev` as it is deployed seperately.