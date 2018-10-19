const controllers = require('./controllers/index.js');
const dogControllers = require('./controllers/dog.js');

const router = (app) => {
  app.get('/page1', controllers.page1);
  app.get('/page2', controllers.page2);
  app.get('/page3', dogControllers.page3);
  app.get('/page4', dogControllers.page4);
  app.get('/getName', controllers.getName);
  app.get('/findByName', controllers.searchName);
  app.get('/getNameDog', dogControllers.getName);
  app.get('/findByNameDog', dogControllers.searchName);

  app.get('/', controllers.index);

  app.get('/*', controllers.notFound);

  app.post('/setName', controllers.setName);
  app.post('/updateLast', controllers.updateLast);

  app.post('/setNameDog', dogControllers.setName);
  app.post('/updateLastDog', dogControllers.updateLast);
};

// export the router function
module.exports = router;
