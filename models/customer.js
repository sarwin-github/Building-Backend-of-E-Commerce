// Load required packages
var mongoose = require('mongoose');
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Regex for email validation
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var validateEmail = function(email) {
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Define our address schema
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var AddressSchema = new mongoose.Schema({
	streetAddress	: { type: String, required: [true, 'State/Province is required']}, // Contain the street address 
	city			: String, // Contain City, it is not always required such as province (i.e. Lucban Quezon)
	state 			: { type: String, required: [true, 'State/Province is required']}, // Contain province or state
	country 		: { type: String, required: [true, 'Country name is required']}, // Contains the name of the country
	zip 			: { type: String, required: [true, 'ZIP Code is required']} // Contain ZIP code 
});
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Define our customer schema
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var CustomerSchema = new mongoose.Schema({
	userInfo	: { type: String, trim: true, unique: true }, // Contain the ID of the logged in user
  	firstName	: { type: String, required: [true, 'First name is required']}, // Contain the first name of the customer/user
  	lastName	: { type: String, required: [true, 'Last name is required']}, // Contain the last name of the customer/user
  	birthday	: { type: Date, required: true }, // Contain the date of birth
  	age			: { type: Number, required: true }, // Contain the age of the customer/user
  	email 		: { type: String, trim: true, lowercase: true, // Contain the email of the user with email validation/regex
	        		unique: true, required: [true, 'Email address is required'],
	        		validate: [validateEmail, 'Please fill a valid email address'],
	        		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
				},
	customerAddress		: [AddressSchema] // Contain the address of the user from Address schema
});


CustomerSchema.virtual('fullName').get(()=>{
	return this.firstName + ' ' + this.lastName; 
});

// Export the Mongoose model
var Customer = mongoose.model('Customer', CustomerSchema);
