import {resolve} from 'path';
import cwd from 'cwd';

const DEFAULT_CONFIG_FILE_NAME = 'jest-gremlin-config.cjs';

type Config = {
  port: number;
  protocol: string;
  imageName: string;
  imagePort?: number;
  containerName?: string;
};

export function getConfig(): Config {
  let config: Config = {
    port: 8182,
    protocol: 'ws',
    imageName: 'tinkerpop/gremlin-server',
    imagePort: 8182,
    containerName: 'gremlin-server',
  };

  try {
    const path = process.env.JEST_GREMLIN_CONFIG || resolve(cwd(), DEFAULT_CONFIG_FILE_NAME);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const importedConfig = require(path);
    console.log(`Found config ${path}`, importedConfig);
    config = importedConfig as Config;
    if (!config.imageName) {
      config.imageName = 'gremlin-server';
    }
  } catch (e) {
    console.warn(`Did not found ${process.env.JEST_GREMLIN_CONFIG}, using default settings`, e);
    console.log('Starting with default paras', config);
  }

  return config;
}
