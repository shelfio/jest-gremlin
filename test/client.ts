import {log} from 'console';
import gremlin from 'gremlin';

export type NeptuneConnection = {
  g: gremlin.process.GraphTraversalSource<gremlin.process.GraphTraversal>;
  t: typeof gremlin.process.t;
  d: typeof gremlin.process.direction;
  m: typeof gremlin.process.merge;
  c: typeof gremlin.process.cardinality;
  s: typeof gremlin.process.statics;
  P: typeof gremlin.process.P;
  close: () => Promise<void>;
};
// eslint-disable-next-line require-await
export async function getClient(params: {
  host: string;
  port: number;
  protocol: 'ws' | 'wss';
}): Promise<NeptuneConnection> {
  log('Connecting to Neptune with params:', params);

  const neptuneConfig = {
    protocol: params?.protocol || 'wss',
    host: params.host,
    port: params.port,
    useIamAuth: true,
    region: 'eu-central-1',
  };

  log('Connecting to Neptune:', neptuneConfig);

  const {DriverRemoteConnection} = gremlin.driver;
  const {Graph} = gremlin.structure;

  const dc = new DriverRemoteConnection(
    `${neptuneConfig.protocol}://${neptuneConfig.host}:${neptuneConfig.port}/gremlin`,
    {}
  );
  const graph = new Graph();
  const g = graph.traversal().withRemote(dc);

  return {
    g,
    t: gremlin.process.t,
    d: gremlin.process.direction,
    m: gremlin.process.merge,
    c: gremlin.process.cardinality,
    s: gremlin.process.statics,
    P: gremlin.process.P,
    close: () => dc.close(),
  };
}
