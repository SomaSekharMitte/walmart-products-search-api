/**
 * 
 * Products routes JS file for managing all the routes related to search API 
 *  
 */
// Load modules
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../model/product');

router.get('/:pageNumber/:pageSize', (request, response, next) => {

    var pageNumber = request.params.pageNumber;
    var pageSize = request.params.pageSize;
    var query = {};

    if (pageNumber < 0 || pageNumber == 0) {
        errResponse = {
            'message': 'Invalid page number, should start with 1',
            'statusCode': 400,
            'validUrl': 'http://localhost:3000/walmartproducts/{pageNumber}/{pageSize}'
        };
        return response.json(errResponse);
    }

    if (!(pageSize >= 1 && pageSize <= 30)) {
        errResponse = {
            'message': 'Invalid page Size, should be between 1 and 30',
            'statusCode': 400,
            'validUrl': 'http://localhost:3000/walmartproducts/{pageNumber}/{pageSize}'
        };
        return response.json(errResponse);
    }

    // Parse and map all the query parameters to queryParams map
    const queryParams = Object.assign({}, ...Object.keys(request.query).map(objKey => {
        return {[objKey]: request.query[objKey]}
    }));

    var filterQuery = {};

    // Set skip and limit for server side pagination
    query.skip = pageSize * (pageNumber - 1);
    query.limit = parseInt(pageSize);

    // Perform the query string validation and amend the filterQuery for the final search criteria
    if (queryParams.search != undefined && queryParams.search.length > 0) {
        filterQuery = {'productName' : { '$regex' : queryParams.search, '$options' : 'i'}}
    }
    if (queryParams.inStock) {
        filterQuery = Object.assign(filterQuery, {'inStock' : queryParams.inStock});
    }
    if (queryParams.minReviewRating > 0) {
        filterQuery = Object.assign(filterQuery, 
            {'reviewRating' : { '$gte' : queryParams.minReviewRating }});
    }
    if (queryParams.maxReviewRating > 0) {
        filterQuery = Object.assign(filterQuery, 
            {'reviewRating' : { '$lte' : queryParams.maxReviewRating }});
    }
    if (queryParams.minPrice > 0) {
        filterQuery = Object.assign(filterQuery, 
            {'price' : { '$gte' : queryParams.minPrice }});
    }
    if (queryParams.maxPrice > 0) {
        filterQuery = Object.assign(filterQuery, 
            {'price' : { '$lte' : queryParams.maxPrice }});
    }
    if (queryParams.minReviewCount > 0) {
        filterQuery = Object.assign(filterQuery,
            {'reviewCount' : { '$gte' : queryParams.minReviewCount }});
    }
    if (queryParams.maxReviewCount > 0) {
        filterQuery = Object.assign(filterQuery, 
            {'reviewCount' : { '$lte' : queryParams.maxReviewCount }});
    }

    // Make a call to get all the products matching the criteria
    Product.find(filterQuery,{},query)
    .select()
    .exec()
    .then(productDocs => {
        const totalPrducts = productDocs.length; 
        // Customize the response I would want to show up in the response
        const docResponse = productDocs.map(doc => {
            return {
                productId: doc.productId,
                productName: doc.productName,
                shortDescription: doc.shortDescription,
                longDescription: doc.longDescription,
                price: String("$").concat((doc.price / 100).toFixed(2)),
                productImage: doc.productImage,
                reviewRating: doc.reviewRating,
                reviewCount: doc.reviewCount,
                inStock: doc.inStock
            }
        });

        response.status(200).json({
            products: docResponse,
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