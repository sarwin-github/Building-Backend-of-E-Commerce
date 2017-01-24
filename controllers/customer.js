var mongoose = require( 'mongoose' );
var Customer = mongoose.model( 'Customer' );

// Create endpoint admin/customer for getAllCustomers ----------------------------------------------------------------------------
exports.getAllCustomers = (request, response) => {
  var query = Customer.find({}).select({"__v": 0});

  query.exec((error, customers) => {
    if (error)
      return response.send(error);

    response.json(customers);
  });
};

// Create endpoint /customer/new for postCustomer ----------------------------------------------------------------------------
exports.postCustomer = (request, response) => {
	var customerAddress = [];

	// Set Customer Properties for customer address ----------------------------------------------------------------
	customerAddress.push(
	{
  		streetAddress	: request.body.streetAddress,
  		city			: request.body.city,
  		state 			: request.body.state,
  		country 		: request.body.country,
  		zip 			: request.body.zip
	});

  	 var customer = new Customer();
 	
 	// Set Customer Properties for adding new customer ----------------------------------------------------------
    	customer.userInfo = request.user._id; //Value should come from session
    	customer.firstName = request.body.firstName;
    	customer.lastName = request.body.lastName;
    	customer.birthday = request.body.birthday;
    	customer.age = request.body.age;
    	customer.email = request.body.email;
    	customer.customerAddress = customerAddress;

  // Save the customer and check for errors ----------------------------------------------------------------------
  customer.save(error => {
    if (error)
      return response.send(error);

    response.json({ message: 'A new customer was added!', data: customer });
  });
};


// Create endpoint /products/:product_id for PUT ----------------------------------------------------------
exports.putCustomer = (request, response) => {
  // Use the Product model to update a specific product ---------------------------------------------------
  Customer.findById({ userInfo: request.user._id, _id: request.params.customer_id }, (error, customer) => {
    if (error)
      return response.send(error);

	var customerAddress = [];

	// Set Customer Properties for customer address ----------------------------------------------------------------
	customerAddress.push(
	{
  		streetAddress	: request.body.streetAddress,
  		city			: request.body.city,
  		state 			: request.body.state,
  		country 		: request.body.country,
  		zip 			: request.body.zip
	});

    // Update the existing customer -----------------------------------------------------------------------
      customer.firstName = request.body.firstName;
      customer.lastName = request.body.lastName;
      customer.birthday = request.body.birthday;
      customer.age = request.body.age;
      customer.email = request.body.email;
      customer.customerAddress = customerAddress;

    // Save the customer and check for errors ------------------------------------------------------------
    customer.save(error => {
      if (error)
        return response.send(error);

      response.json({ message: 'A Customer have been updated!', data:customer });
    });
  });
};

// Create endpoint /customer/profile for getTheLoggedInUser -----------------------------------------------
exports.getTheLoggedInUser = (request, response) => {
  var query = Customer.find({ userInfo: request.user._id }).select({"__v": 0});

  query.exec((error, customers) => {
    if (error)
      return response.send(error);

    response.json(customers);
  });
};


// Create endpoint /customer/:customer_id for DELETE -----------------------------------------------------
exports.deleteCustomer = (request, response) => {
  // Use the Customer model to find and remove a specific product ----------------------------------------
  Customer.findByIdAndRemove({ _id: request.params.customer_id }, error => {
    if (error)
      return response.send(error);

    response.json({ message: 'Customer have been removed!' });
  });
};