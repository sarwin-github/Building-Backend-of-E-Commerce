//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set needed modules 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var express = require('express')
  , mongoose = require('mongoose')
  , multer = require('multer') 
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , passport = require('passport')
  , http = require('http')
  , path = require('path')
  , customerViewModel = require('./models/customer')
  , customerController = require('./controllers/customer')
  , userController = require('./controllers/user')
  , productController = require('./controllers/product')
  , orderController = require('./controllers/order')
  , authController = require('./controllers/auth')
  , imageController = require('./controllers/image');

// Multer set uploaded image destination --------------------------------------------------------------------------------
var storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, './public/images')},
  filename: (request, file, callback) => {
    callback(null, file.originalname);
}});

// Connect to the MongoLab MongoDB -------------------------------------------------------------------------------------
var mongoConnectionLocal = 'mongodb://localhost/CustomerAppSample';
var mongoConnectionOnline = 'mongodb://adminsar:2937e76da330592664c4debba7f93a9a@ds157268.mlab.com:57268/auctiondb';
var upload = multer({ storage: storage });
mongoose.Promise = global.Promise;
mongoose.connect(mongoConnectionOnline, (error, database) => { if(error) { console.log(error); }});

var app = express();
app.set('port', process.env.PORT || 3003);
app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').__express);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'Secret Session Key', 
    saveUninitialized: true,
    resave: true
  }));

// Set Passport
app.use(passport.initialize());

var router = express.Router();
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set Routes for customers
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.route('/admin/customers').get( authController.isAuthenticated, 
                                customerController.getAllCustomers); // Get all customers

router.route('/customer/profile').get(authController.isAuthenticated, 
                                 customerController.getTheLoggedInUser); // Get the logged in customer

router.route('/customer/new').post( authController.isAuthenticated, 
                              customerController.postCustomer);  // Create new customer action

router.route('/customer/edit/:customer_id').put( authController.isAuthenticated, 
                                            customerController.putCustomer);  // Update customer action

router.route('/customer/delete/:customer_id').delete( authController.isAuthenticated, 
                                            customerController.deleteCustomer);  // Delete customer action
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set Routes for users
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.route('/admin/users').get( authController.isAuthenticated, 
                            userController.getUsers); // Get all users

router.route('/admin/users/:user_id').get( authController.isAuthenticated, 
                                     userController.getUserById); // Get a user using user_id as parameter

router.route('/users/new').post( userController.postUser );  // Create new user action

router.route('/users/:username').put( authController.isAuthenticated, 
                                userController.putUser)  // Update user password and role using username as parameter
                                .get( authController.isAuthenticated, 
                                userController.getUserByUsername)  // Display user details based on username parameter
                                .delete( authController.isAuthenticated, 
                                userController.deleteUser);  // Delete a user using username as parameter
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set Routes for products
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.route('/products').get( productController.getProducts ); // Get list of products
router.route('/products/:product_id').get( productController.getProduct ); // Get product using product Id as parameter
router.route('/products/new').post( authController.isAuthenticated, 
                             productController.postProduct);  // Create new product

router.route('/products/:product_id').put( authController.isAuthenticated, 
                                     productController.putProduct)  // Update a product
                                     .delete( authController.isAuthenticated, 
                                     productController.deleteProduct); // Delete a product
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set Routes for Orders
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.route('/orders/new').post( authController.isAuthenticated, 
                           orderController.createOrder); // Create new order

router.route('/orders/').get( authController.isAuthenticated, 
                        orderController.getOrders);  // Get all orders by the logged in user

router.route('/orders/:order_id').get( authController.isAuthenticated, 
                                 orderController.getOrderById) // Get an order using order Id as parameter
                                 .delete( authController.isAuthenticated, 
                                 orderController.deleteOrder)
                                 .put( authController.isAuthenticated,
                                 orderController.updateToAnExistingOrder); // Delete an order using order Id as parameter
router.route('/orders/total').get( authController.isAuthenticated, orderController.getTotal); // Not yet working
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set Routes for images
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.route('/index').get( imageController.getIndex ); // Get Index Page
router.route('/index').post(upload.any(), imageController.postIndex ); // Post image on Index Page
router.route('/images').get( imageController.getImageData ); // Get all Images in json format
router.route('/images/:id').get( imageController.getImageDataById ) // Get an Image using image ID as a parameter in json format
                           .delete( imageController.deleteImage ); // Remove an Image using image ID as parameter

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set router initial path/root
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.use('/', router);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});