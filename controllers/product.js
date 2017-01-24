var Product = require('../models/product');
var Image = require('../models/image');

// Create endpoint /products/new for Post ---------------------------------------------------------------
exports.postProduct = function(request, response) 
{
  var product = new Product();

  // Set Product Properties for adding new product ------------------------------------------------------
  product.productName = request.body.productName; 
  product.productDetails = request.body.productDetails;
  product.category = request.body.category;
  product.categoryType = request.body.categoryType;
  product.stocks = request.body.stocks;
  product.price = request.body.price;
  product.userInfo = request.user._id;
  product.productImage = request.body.image_id;

  // Save the product and check for errors --------------------------------------------------------------
  product.save(error => {
    if (error)
      return response.send(error);

    response.json({ message: 'A new Product was added!', data: product });
  });
};

// Create endpoint /products for GET --------------------------------------------------------------------
exports.getProducts = (request, response) => {
  // Use the Product model to get the all products ------------------------------------------------------
  var query = Product.find({}).select({/*"_id" : 0,*/ "__v": 0});

  query.exec((error, products) => {
    if (error)
      return response.send(error);

    response.json(products);
  });
};


// Create endpoint /products/:product_id for Get using product_id parameter -----------------------------
exports.getProduct = (request, response) => {
  // Use the Product model to get the all products ------------------------------------------------------
  var query = Product.find({ _id: request.params.product_id })
  .select({"__v": 0, "userId": 0});

  query.exec((error, product) => {
    if (error)
      return response.send(error);

    response.json(product);
  });
};

// Create endpoint /products/:product_id for PUT --------------------------------------------------------
exports.putProduct = (request, response) => {
  // Use the Product model to update a specific product -------------------------------------------------
  Product.findById({ _id: request.params.product_id }, (error, product) => {
    if (error)
      return response.send(error);

    // Update the existing product quantity -------------------------------------------------------------
    product.productName = request.body.productName;
    product.productDetails = request.body.productDetails;
    product.category = request.body.category;
    product.categoryType = request.body.categoryType;
    product.stocks = request.body.stocks;
    product.price = request.body.price;
    product.productImage = request.body.image_id;

    // Save the product and check for errors ------------------------------------------------------------
    product.save(error => {
      if (error)
        return response.send(error);

      response.json({ message: 'A Product have been updated!', data:product });
    });
  });
};

// Create endpoint /products/:products_id for DELETE -----------------------------------------------
exports.deleteProduct = (request, response) => {
  // Use the Product model to find and remove a specific product ---------------------------------------
  Product.findByIdAndRemove(request.params.product_id, error => {
    if (error)
      return response.send(error);

    response.json({ message: 'Product have been removed!' });
  });
};