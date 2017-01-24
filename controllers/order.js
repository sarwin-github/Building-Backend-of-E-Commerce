var Orders = require('../models/order');
var Product = require('../models/product');

// Create endpoint /orders/new for Post -----------------------------------------------------------------
exports.createOrder = (request, response) => {

	Orders.create({
		//Use session to give value to product_ID
			orderedProducts	: request.body.product_id,
			orderedDetails  : request.body.orderedDetails,
			userInfo		: request.user._id,
			status			: request.body.status,
			dateReceived	: request.body.dateReceived,
			totalPrice      : request.body.totalPrice
		}, error => {
   		 	if (error)
     		  return response.send(error);

      		response.json({ message: 'Order has been created'});
  	});
};

// Create endpoint /orders/ for get orders for current logged in user ----------------------------------
exports.getOrders = (request, response) => {
  // Use the order model to get all orders -------------------------------------------------------------
  var query = Orders.find({ userInfo: request.user._id })
  .populate('orderedProducts', `productName productDetails price 
  								category categoryType productImage`)
  .select({"__v": 0});

  query.exec((error, order) => {
    if (error)
      return response.send(error);

    response.json(order);
  });
};

// Create endpoint /orders/ for get orders for current logged in user ----------------------------------
exports.getOrderById = (request, response) => {
  // Use the order model to get all orders -------------------------------------------------------------
  var query = Orders.findById({ _id: request.params.order_id ,userInfo: request.user._id })
  .populate('orderedProducts', `productName productDetails price 
  								category categoryType productImage`)
  .select({"__v": 0, "userInfo": 0});

  query.exec((error, order) => {
    if (error)
      return response.send(error);

    response.json(order);
  });
};

//Add a product to an existing order
exports.updateToAnExistingOrder = (request, response) => {
	Orders.findByIdAndUpdate({ _id: request.params.order_id, userInfo: request.user._id }, 
		{ $push : { orderedProducts: request.body.product_id }}, (error) => {
			if (error)
	      		return response.send(error);
	});

	Orders.findById({ _id: request.params.order_id, userInfo: request.user._id }, (error, orders) => {
		    if (error)
		      return response.send(error);

  		var value = request.body.totalPrice;
    		// Update the existing order total price ------------------------------------------------------------
    	orders.totalPrice = value;
  
    		// Save the orders and check for errors -------------------------------------------------------------
	    orders.save(error => {
	      	if (error)
	        	return response.send(error);

	      	response.json({ message: 'Order price have been updated!', data:orders });
	    }); 
  	});
};


// Create endpoint /order/:order_id for DELETE ---------------------------------------------------------
exports.deleteOrder = (request, response) => {
  // Use the Order model to find and remove a specific order  ------------------------------------------
  Orders.findByIdAndRemove({ _id: request.params.order_id }, error => {
    if (error)
      return response.send(error);

    response.json({ message: 'Order has been removed!' });
  });
};


//FUCK MONGOOSE, THIS CODE IS NOT WORKING
exports.getTotal = (request, response) => {
	var aggregationPipe = [
	{"$unwind": "$products"},
		{ "$lookup": 
		    {
		        "from": "products",
		        "localField": "orderedProducts",
		        "foreignField": "_id",
		        "as": "orderedProducts_joined"
		    }},
		{ "$unwind": "$orderedProducts_joined" },
	{ "$group": 
    {
        "_id": "$orderedProducts_joined.userInfo",
        "total": { "$sum": "$orderedProducts_joined.price"}
    }}
	];

	Orders.aggregate(aggregationPipe).exec((error,result) => {
    // process results here
	 	if (error)
	      return response.send(error);
	    response.json(result);
	});
};