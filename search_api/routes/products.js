// Load modules
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../model/product');


router.get('/:pageNumber/:pageSize', (request, response, next) => {

    for (const key in request.query) {
        //console.log("Got Query Params: Key: ", key, "and Value: " ,request.query[key]);
    }

    var pageNumber = request.params.pageNumber;
    var pageSize = request.params.pageSize;
    var query = {};

    if (pageNumber < 0 || pageNumber == 0) {
        errResponse = {
            'message': 'Invalid page number, should start with 1',
            'statusCode': 404,
            'validUrl': 'http://localhost:3000/walmartproducts/{pageNumber}/{pageSize}'
        };
        return response.json(errResponse);
    }

    if (!(pageSize >= 1 && pageSize <= 30)) {
        errResponse = {
            'message': 'Invalid page Size, should be between 1 and 30',
            'statusCode': 404,
            'validUrl': 'http://localhost:3000/walmartproducts/{pageNumber}/{pageSize}'
        };
        return response.json(errResponse);
    }

    const queryParams = Object.assign({}, ...Object.keys(request.query).map(objKey => {
        return {[objKey]: request.query[objKey]}
    }));

    let filterQuery = {};

    const regEx = new RegExp();

    query.skip = pageSize * (pageNumber - 1);
    query.limit = parseInt(pageSize);

    const num = Product.countDocuments().then((err, count) => {
        return count;
    });

    Product.estimatedDocumentCount().then(count =>{
        return count;
    });

   // Make a call to get all the products matching the criteria
    Product.find({ 'productName' : { '$regex' : queryParams.search, '$options' : 'i'}, 
                    'inStock' : queryParams.inStock,
                   'reviewRating' : { '$gte' : queryParams.minReviewRating , '$lte' : queryParams.maxReviewRating },
                   'price' : { '$gte' : queryParams.minPrice, '$lte' : queryParams.maxPrice }
                 }
                 ,{},query)
    .exec()
    .then(docs => {
        const totalPrducts = docs.length;
        response.status(200).json({
            products: [
                docs
            ],
            totalProducts: totalPrducts,
            pageNumber: Number(request.params.pageNumber),
            pageSize: Number(request.params.pageSize),
            statusCode: 200
        });
    }).catch(err => {
        console.log('Error caught in the products retrival', err);
    });
});

module.exports = router;