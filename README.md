# Patrick Morton Todo App

## Installation

1. Install packages

```
npm i
```

For offline developmenty you will also need to have the [aws cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions) installed and the [aws sam cli](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html#install-sam-cli-instructions).

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
Notes: 

1. For offline development you will need to spin up the front end using `npm run dev` as it is deployed seperately.
2. Offline development still requires an internet connection to use auth services