// Importar apenas o Router
const { Router } = require('express');
// Importar o controller
const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

// Funções do controller: index, show, store, update, destroy

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);

routes.get('/search', SearchController.index);

module.exports = routes;