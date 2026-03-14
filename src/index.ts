import {resolve} from 'path';

module.exports = {
  globalSetup: resolve(__dirname, './setup.cjs'),
  globalTeardown: resolve(__dirname, './teardown.cjs'),
};
