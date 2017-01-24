// Load required packages -------------------------------------------------------
var User = require('../models/user');

// Create endpoint /users/new for POST ----------------------------------------------
exports.postUser = (request, response) => {
  var user = new User({
    username: request.body.username,
    password: request.body.password,
    role: request.body.role
  });

  //save a new user -------------------------------------------------------------
  user.save(error => {
    if (error)
      return response.send(error);
    response.json({ message: 'A new user was added!' });
  });
};

// Create endpoint /users for GET -----------------------------------------------
exports.getUsers = (request, response) => {
  var query = User.find().select({"_id" : 0, "__v": 0, "password": 0});

  query.exec((error, users) => {
    if (error)
      return response.send(error);

    response.json(users);
  });
};

// Create endpoint /users/:username for GET -----------------------------------------------
exports.getUserByUsername = (request, response) => {
  var query = User.find( request.params.username ).select({ "__v": 0});

  query.exec((error, users) => {
    if (error)
      return response.send(error);

    response.json(users);
  });
};

// Create endpoint admin/users/:user_id for GET -----------------------------------------------
exports.getUserById = (request, response) => {
  var query = User.findOne({ _id: request.params.user_id }).select({ "__v": 0, "password": 0});

  query.exec((error, users) => {
    if (error)
      return response.send(error);

    response.json(users);
  });
};

// Create endpoint /users/:username for UPDATE -----------------------------------------------
exports.putUser = (request, response) => {
  // Use the user model to update a specific user ----------------------------
  User.findOne({ username: request.params.username }, (error, users) => {
    if (error)
      return response.send(error);

    // Update the password ---------------------------------------------------
    users.password = request.body.password;
    users.role = request.body.role;

    // Save the user and check for errors ------------------------------------
    users.save(error => {
      if (error)
        return response.send(error);

      response.json({ message: 'A user have been updated!', data:users });
    });
  });
};

// Create endpoint /products/:products_id for DELETE -----------------------------------------------
exports.deleteUser = (request, response) => {
  // Use the Product model to find and remove a specific product ---------------------------------------
  User.findOneAndRemove({ username: request.params.username }, error => {
    if (error)
      return response.send(error);

    response.json({ message: 'User have been removed!' });
  });
};