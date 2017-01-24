var express = require('express');
var multer = require('multer');
var router = express.Router();
var mongoose = require('mongoose');
var Image = require('../models/image');
var fs = require('fs');

router.getImages = (callback, limit) => {
	Image.find(callback).limit(limit);
}
 
router.getImageById = (id, callback) => {
 	Image.findById(id, callback);
}
 
router.addImage = (image, callback) => {
 	Image.create(image, callback);
}

router.removeImage = (image, callback) => {
	Image.findByIdAndRemove(image, callback);
}


// Create endpoint /index/ for initial page for uploading or posting an image -------------------------------------------
exports.getIndex = ((request, response) => {
 	response.render('index.ejs');
});

// Create endpoint /index/ for uploading or posting an image ------------------------------------------------------------
exports.postIndex = ((request, response) => {
 	var path = request.files[0].path;
 	var imageName = request.files[0].originalname;
 	var imagepath = {};

	 	imagepath['path'] = path;
	 	imagepath['originalname'] = imageName;
		router.addImage(imagepath, error => {});
	
	response.send(request.files);
});

// Create endpoint /images/:id for getting a list of image available image ------------------------------------------------
exports.getImageData = ((request, response) => {
	router.getImages((error, genres) => {
		 if (error)
      		return response.send(error);
	
	response.json(genres);
	});
});
 
// Create endpoint /images/ for getting and displaying  an image ---------------------------------------------------------
exports.getImageDataById = ((request, response) => {
	router.getImageById(request.params.id, (error, genres) => {
		 if (error)
      		return response.send(error);

  	var my_name = genres.path;
    response.render('image.ejs',{ name:my_name });    

	});
});

// Create endpoint /image/:image_id for DELETE --------------------------------------------------------------------------
exports.deleteImage = (request, response) => {
  // Use the Image model to find and remove a specific image  -----------------------------------------------------------
	router.removeImage(request.params.id, (error, genres) => {
		if (error) {
      		return response.send(error);
		}
		else{
			var filePath = genres.path; 
	      	fs.unlink(filePath);

	    	response.json({ message: 'Image has been removed!' });
		}
	});
};


