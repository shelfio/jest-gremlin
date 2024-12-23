import {execSync} from 'child_process';
import gremlin from 'gremlin';
import {getConfig} from './config';

const {DriverRemoteConnection} = gremlin.driver;
const {Graph} = gremlin.structure;

// eslint-disable-next-line complexity
module.exports = async function startGremlin() {
  const config = getConfig();
  const drc = new DriverRemoteConnection(`${config.protocol}://localhost:${config.port}/gremlin`);
  const graph = new Graph();
  const g = graph.traversal().withRemote(drc);

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
    } catch (e) {
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
