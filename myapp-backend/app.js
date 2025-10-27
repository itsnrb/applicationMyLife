const express = require('express')
const app = express()
const port = 3000

// DB-Client initialisieren
const { getDbClientSmacondi, closeAllDbClients } = require('db-client-smacondi');
const connectionStringMap = { local: 'mongodb://localhost:27017' }
const dbClientSmacondi = getDbClientSmacondi(connectionStringMap);
const clusterDbClient = dbClientSmacondi.getDbClientByClusterId('local')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Beispiel-Endpunkt: Liste Collections
app.get('/collections', async (req, res) => {
  const collections = await clusterDbClient.listCollections('test');
  res.json(collections);
})

app.post('/history', express.json(), async (req, res) => {
  try {
    // req.body enthält die vom Frontend gesendeten Daten
    const result = await clusterDbClient.insertOne('test', 'history', req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});