import {execSync} from 'child_process';
import gremlin from 'gremlin';
import {getConfig} from './config';

const {DriverRemoteConnection} = gremlin.driver;
const {Graph} = gremlin.structure;

module.exports = async function startGremlin() {
  const config = getConfig();
  const drc = new DriverRemoteConnection(`${config.protocol}://localhost:${config.port}/gremlin`);
  const graph = new Graph();
  const g = graph.traversal().withRemote(drc);

  execSync(`docker run -d -p ${config.port}:${config.imagePort} ${config.imageName}`, {
    stdio: 'inherit',
  });

  console.log('Waiting for TinkerPop server to be ready...');

  const isServerReady = async () => {
    try {
      await g.V().limit(1).toList();

      return true;
    } catch (e) {
      return false;
    }
  };

  let ready = false;
  let tries = 0;

  while (!ready) {
    ready = await isServerReady();
    tries++;
    console.debug(`Attempt ${tries}: Server is${ready ? '' : ' not'} ready.`);
    if (!ready) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return true;
};
