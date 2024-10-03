import {execSync} from 'child_process';
import gremlin from 'gremlin';
import getDebug from 'debug';
import {getConfig} from './config';

const debug = getDebug('jest-gremlin');
const {DriverRemoteConnection} = gremlin.driver;
const {Graph} = gremlin.structure;

module.exports = async function startGremlin() {
  const config = getConfig();
  const drc = new DriverRemoteConnection(`${config.protocol}://localhost:${config.port}/gremlin`);
  const graph = new Graph();
  const g = graph.traversal().withRemote(drc);

  execSync(
    `docker run -d -p ${config.port}:${config.imagePort} --name ${config.containerName} ${config.imageName}`,
    {
      stdio: 'inherit',
    }
  );

  execSync(`docker ps`, {
    stdio: 'inherit',
  });

  debug.log('Waiting for TinkerPop server to be ready...');

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
    debug.log(`Attempt ${tries}: Server is${ready ? '' : ' not'} ready.`);
    if (!ready) {
      await new Promise(resolve => setTimeout(resolve, config?.triesInterval || 1000));
    }
  }

  return true;
};
