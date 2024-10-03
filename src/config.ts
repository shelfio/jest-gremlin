import {resolve} from 'path';
import cwd from 'cwd';
import getDebug from 'debug';

const debug = getDebug('jest-gremlin');

const DEFAULT_CONFIG_FILE_NAME = 'jest-gremlin-config.cjs';

type Config = {
  port: number;
  protocol: string;
  imageName: string;
  imagePort?: number;
  containerName?: string;
  maxTries?: number;
  triesInterval?: number;
};

export function getConfig(): Config {
  let config: Config = {
    port: 8182,
    protocol: 'ws',
    imageName: 'tinkerpop/gremlin-server',
    imagePort: 8182,
    containerName: 'gremlin-server',
    maxTries: 10,
    triesInterval: 1000,
  };

  try {
    const path = process.env.JEST_GREMLIN_CONFIG || resolve(cwd(), DEFAULT_CONFIG_FILE_NAME);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const importedConfig = require(path);
    debug.log(`Found config ${path}`, importedConfig);

    config = {config, ...importedConfig};
  } catch (e) {
    debug.log(`Did not found ${process.env.JEST_GREMLIN_CONFIG}, using default settings`, e);
    debug.log('Starting with default params', config);
  }

  return config;
}
