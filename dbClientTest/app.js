const express = require('express')
const app = express()
const port = 3000

// DB-Client initialisieren
const { getDbClientSmacondi, closeAllDbClients } = require('db-client-smacondi');
const connectionStringMap = { local: 'mongodb://localhost:27017' }
const dbClientSmacondi = getDbClientSmacondi(connectionStringMap);
const clusterDbClient = dbClientSmacondi.getDbClientByClusterId('local')
const cors = require('cors');

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Beispiel-Endpunkt: Liste Collections
app.get('/collections', async (req, res) => {
  const collections = await clusterDbClient.listCollections('test');
  res.json(collections);
})

app.post('/history/:id', express.json(), async (req, res) => {
  debugger;
  console.log('Received body:', req.body);
  try {
    const id = req.params.id;
    const data = { ...req.body, id }; // id aus URL ins Objekt übernehmen
    const result = await clusterDbClient.insertOne('test', 'history', data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/data', express.json(), async (req, res) => {
  try {
    const data = await clusterDbClient.find('test', 'history', {});
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/delete/:id', async (req, res) => {
  console.log('Delete request for id:', req.params.id);
  try {
    const id = req.params.id;
    const result = await clusterDbClient.deleteOne('test', 'history', { id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})