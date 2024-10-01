import {resolve} from 'path';
import cwd from 'cwd';

const DEFAULT_CONFIG_FILE_NAME = 'jest-gremlin-config.cjs';

type Config = {
  port: number;
  protocol: string;
  imageName: string;
  imagePort?: number;
}

export function getConfig(): Config {
  let config: Config = {
      port: 8182,
      protocol: 'ws',
      imageName: 'tinkerpop/gremlin-server',
      imagePort: 8182,
  }

  try {
    const path = process.env.JEST_GREMLIN_CONFIG || resolve(cwd(), DEFAULT_CONFIG_FILE_NAME);
    const importedConfig = require(path);
    console.log(`Found config ${path}`, importedConfig);
    config = (importedConfig as Config);
  } catch (e) {
    console.warn(`Did not found ${process.env.JEST_GREMLIN_CONFIG}, using default settings`, e);
    console.log('Starting with default paras', config);
  }

  return config;
}
