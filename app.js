/**
 * 
 * App JS file for managing all the configurations required for the server endpoint. Also to manage below.
 * 
 *  - Errorhandling
 *  - Call respective routes
 *  - Load BodyParser
 *  
 */

// Load modules

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');

// Load 'products' routes module
const productRoutes = require('./search_api/routes/products');

// Load the right environment mongodb uri for the connection
let url = (process.env.NODE_ENV == "dev") ? process.env.MONGO_DEV_URI : process.env.MONGO_PROD_URI;

// mongoDB connection
mongoose.connect(url,{ useNewUrlParser: true}, (err) => {
    if (err) {
        console.log('Could Not Connect To MongoDb', err);
    } else {
        console.log('MongoDB Connection Successful');
    }
});

// Set the URLEncode and JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// Load all routes
app.use('/walmartproducts', productRoutes);

mongoose.Promise = global.Promise;

// Set appropriate Access contols for the API
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Hearders', 'Origin, Content-Type, Access, Authorization');

    if (request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'GET');
        return response.status(200).json({
            error: {
                message: 'Only GET Is Allowed For Search API'
            }
        });
    }
    next();
});

// Provide valid json response of wrong API call - 404 Status Code
app.use((request, response, next) => {
    const err = new Error('Requested resource could not be found');
    err.status = 404;
    err.validUrl = 'http://localhost:3000/walmartproducts/{pageNumber}/{pageSize}';
    next(err);
});

// Generic error handler
app.use((error, request, response, next) => {
    response.status(error.status || 500);
    response.json({
        error: {
            message: error.message,
            validUrl: error.validUrl,
            statusCode: error.status
        }
    });
    next();
});

module.exports = app;