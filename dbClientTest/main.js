
(async function () {
// import named exports
const { getDbClientSmacondi, closeAllDbClients } = require('db-client-smacondi');
const { ObjectId } = require('mongodb'); // <--- Importiere ObjectId
const connectionStringMap = { local: 'mongodb://localhost:27017'}
// Using the singleton pattern (recommended)
const dbClientSmacondi = getDbClientSmacondi(connectionStringMap);

// or load a dbClient by providing a clusterId (sync)
const clusterDbClient = dbClientSmacondi.getDbClientByClusterId('local')

console.warn(await clusterDbClient.deleteOne(
  'test',
  'history',
  { _id: new ObjectId('68fa7a081f8ea540164e90f1') }
));
console.warn(await clusterDbClient.find('test', 'history', {}));
console.warn('Done');
// Close all database connections when needed
await closeAllDbClients();

})();