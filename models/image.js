var mongoose = require('mongoose');
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Define our image schema
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var imageSchema = mongoose.Schema({
 	path: { type: String, required: true, trim: true }, // Contain the path of the image 
 	originalname: { type: String, required: true } // Contain the name of uploaded image/orginal name of the image before upload
});
 
module.exports = mongoose.model('Image', imageSchema);