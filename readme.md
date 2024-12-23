# jest-gremlin [![CircleCI](https://circleci.com/gh/shelfio/jest-gremlin/tree/master.svg?style=svg)](https://circleci.com/gh/shelfio/jest-gremlin/tree/master) ![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg) [![npm (scoped)](https://img.shields.io/npm/v/@shelf/jest-gremlin.svg)](https://www.npmjs.com/package/@shelf/jest-gremlin)

> Jest preset to run Gremlin server before tests

## Usage

### 1. Have installed docker-compatible container engine!
This plugin tested with [Docker](https://docs.docker.com/get-docker/) and [Podman](https://podman.io/), but it can work with any container engine that supports Docker CLI commands.

### 2. Install

```
$ yarn add @shelf/jest-gremlin --dev
```

### 3. Create `jest.config.js`

```js
module.exports = {
  preset: '@shelf/jest-gremlin',
};
```

If you have a custom `jest.config.js` make sure you remove `testEnvironment` property, otherwise it will conflict with the preset.

### 4. Create `jest-gremlin-config.js`

```js
import cwd from 'cwd';

module.exports = {
  port: 8182,
  protocol: 'ws',
  imageName: 'tinkerpop/gremlin-server', // or your custom prebuilt image
  imagePort: 8182, // port on which gremlin server is running inside the container
  containerName: 'gremlin-server', // or your custom container name that would be spin up
  maxTries: 10, // how many times to try to connect to gremlin server ()
  triesInterval: 1000, // interval between tries
  containerEngine: 'docker', // or 'podman' if you use podman - used in cli commands to start/stop container
};
```

### 5. PROFIT! Write tests

```js
it();
```

## Monorepo Support

By default the `jest-gremlin-config.js` is read from `cwd` directory, but this might not be
suitable for monorepos with nested [jest projects](https://jestjs.io/docs/configuration#projects-arraystring--projectconfig)
with nested `jest.config.*` files nested in subdirectories.

If your `jest-gremlin-config.js` file is not located at `{cwd}/jest-gremlin-config.js` or you
are using nested `jest projects`, you can define the environment variable `JEST_GREMLIN_CONFIG`
with the absolute path of the respective `jest-gremlin-config.js` file.

### Example Using `JEST_GREMLIN_CONFIG` in nested project

```js
// src/nested/project/jest.config.js
const path = require('path');

// Define path of project level config - extension not required as file will be imported
// via `require(process.env.JEST_GREMLIN_CONFIG)`
process.env.JEST_GREMLIN_CONFIG = path.resolve(__dirname, './jest-gremlin-config');

module.exports = {
  preset: '@shelf/jest-gremlin',
  displayName: 'nested-project',
};
```

## See Also

- [postgres-local](https://github.com/shelfio/postgres-local)
- [jest-elasticsearch](https://github.com/shelfio/jest-elasticsearch)
- [jest-dynamodb](https://github.com/shelfio/jest-dynamodb)

## Publish

```sh
$ git checkout master
$ yarn version
$ yarn publish
$ git push origin master --tags
```

## License

MIT © [Shelf](https://shelf.io)
