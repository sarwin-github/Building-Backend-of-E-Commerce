var mongoose = require('mongoose');
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Define our user schema
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var ProductSchema = new mongoose.Schema({
	userInfo		: String,
	productName 	: { type: String, required: [true, '{ Product Name is Required }']}, //Could be product name or brand
	productDetails	: { type: String, required: [true, '{ Product Details is Required }']}, //Product Details
	productImage	: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' }, //Product Image from Image Schema/Model
	category 		: { type: String, required: [true, '{ Category is Required }']}, //Product Category could be category for men or women
	categoryType	: String, //Category type not always required, could be category for men, men's apparel
	stocks			: { type: Number, required: [true, '{ Product Stocks is Required }']}, //How many stocks does this product have
	price			: { type: Number, required: [true, '{ Price is Required }']} //Price of the product
});

// Export the Mongoose model ----------------------------------------------
module.exports = mongoose.model('Product', ProductSchema);