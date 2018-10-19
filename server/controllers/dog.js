// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

const Dog = models.Dog.DogModel;

// default fake data so that we have something to work with until we make a real Dog
const defaultData = {
  name: 'unknown',
  bedsOwned: 0,
};

// object for us to keep track of the last Dog we made and dynamically update it sometimes
let lastAdded = new Dog(defaultData);

const readAllDogs = (req, res, callback) => {
  Dog.find(callback);
};

const readDog = (req, res) => {
  const name1 = req.query.name;

  const callback = (err, doc) => {
    if (err) {
      return res.json({ err });
    }

    return res.json(doc);
  };

  Dog.findByName(name1, callback);
};

const hostPage3 = (req, res) => {
  res.render('page3');
};

const hostPage4 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    return res.render('page4', { dogs: docs });
  };

  readAllDogs(req, res, callback);
};

const getName = (req, res) => {
  res.json({ name: lastAdded.name });
};

const setName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.breed || !req.body.age) {
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }

  const name = `${req.body.firstname} ${req.body.lastname}`;

  // dummy JSON to insert into database
  const dogData = {
    name,
    breed: req.body.breed,
    age: req.body.age,
  };

  const newDog = new Dog(dogData);

  const savePromise = newDog.save();

  savePromise.then(() => {
    lastAdded = newDog;
    res.json({ name: lastAdded.name, breed: lastAdded.breed, age: lastAdded.age });
  });

  savePromise.catch(err => res.json({ err }));

  return res;
};


const searchName = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }

  return Dog.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    if (!doc) {
      return res.json({ error: 'No dogs found' });
    }

    const doc2 = doc;
    doc2.age++;
    const savePromise = doc2.save();

    return savePromise.then(() => res.json({
      name: doc2.name,
      age: doc2.age,
      breed: doc2.breed,
    })).catch(err2 => res.json({ err2 }));
  });
};

const updateLast = (req, res) => {
  lastAdded.age++;

  const savePromise = lastAdded.save();

  savePromise.then(() => res.json({
    name: lastAdded.name,
    age: lastAdded.age,
    breed: lastAdded.breed,
  }));

  savePromise.catch(err => res.json({ err }));
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

module.exports = {
  page3: hostPage3,
  page4: hostPage4,
  readDog,
  getName,
  setName,
  updateLast,
  searchName,
  notFound,
};
