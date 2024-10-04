import {getClient} from './client';

describe('insertNodeAndCheckPresence', () => {
  it('should insert a node and confirm its presence in the database', async () => {
    // Establish a connection to the Gremlin server
    const {g} = await getClient({
      port: 8182,
      host: 'localhost',
      protocol: 'ws',
    });

    // Define the node details to be inserted
    const nodeId = '1';
    const accountData = {
      accountId: 'test-account-id',
      subdomain: 'test-subdomain',
      syncedAt: new Date().toISOString(),
    };

    // Insert the node into the graph
    await g
      .addV('account')
      .property('id', nodeId)
      .property('accountId', accountData.accountId)
      .property('subdomain', accountData.subdomain)
      .property('syncedAt', accountData.syncedAt)
      .next();

    // Retrieve the newly inserted node by its id
    // eslint-disable-next-line new-cap
    const result = await g.V().valueMap().toList();

    // Check that the node's properties match the expected values
    expect(result[0]).toEqual(
      new Map([
        ['id', [nodeId]],
        ['accountId', [accountData.accountId]],
        ['subdomain', [accountData.subdomain]],
        ['syncedAt', [expect.any(String)]], // Allow flexibility in the syncedAt format
      ])
    );
  });
});
