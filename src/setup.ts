import {execSync} from 'child_process';
import {createRequire} from 'module';
import gremlin from 'gremlin';
import type {getConfig as getConfigType} from './config';

const {AnonymousTraversalSource} = gremlin.process;
const {DriverRemoteConnection} = gremlin.driver;
const requireFromHere = createRequire(__filename);
const {getConfig} = requireFromHere('./config.cjs') as {getConfig: typeof getConfigType};

// eslint-disable-next-line complexity
module.exports = async function startGremlin() {
  const config = getConfig();
  const drc = new DriverRemoteConnection(`${config.protocol}://localhost:${config.port}/gremlin`);
  const g = AnonymousTraversalSource.traversal().withRemote(drc);

  execSync(
    `${config.containerEngine} run -d -p ${config.port}:${config.imagePort} --name ${config.containerName} ${config.imageName}`,
    {
      stdio: 'inherit',
    }
  );

  execSync(`${config.containerEngine} ps`, {
    stdio: 'inherit',
  });

  console.log('Waiting for TinkerPop server to be ready...');

  const isServerReady = async () => {
    try {
      // eslint-disable-next-line new-cap
      await g.V().limit(1).toList();

      return true;
    } catch {
      return false;
    }
  };

  let ready = false;
  let tries = 0;
  const maxTries = config?.maxTries || 10;

  while (!ready) {
    if (tries > maxTries) {
      throw new Error(`Exceeded max ${maxTries} tries, server is not ready.`);
    }

    ready = await isServerReady();
    tries++;
    if (!ready) {
      await new Promise(resolve => setTimeout(resolve, config?.triesInterval || 1000));
    }
  }

  return true;
};
