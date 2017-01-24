var mongoose = require('mongoose');
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Define our order schema
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var OrderSchema = new mongoose.Schema({
	orderedProducts	: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // The ID of the product ordered
	orderedDetails	: String, // Contain the details of the order
	userInfo		: { type: String, unique: true }, // Contain the ID of the logged in user
	status 			: { type: String, required: [true, 'Status is required']}, // Contain the status of orders
	dateOrdered		: { type: Date, default: Date.now }, // Contain the date of the order
	dateReceived 	: Date, // If there's a shipping option, this will contain the date that the order was received
	totalPrice 		: Number, // contain total price of the order
	//paymentMethod: { type: String, required: [true, 'Method of payment is required']},
});

module.exports = mongoose.model('Order', OrderSchema);