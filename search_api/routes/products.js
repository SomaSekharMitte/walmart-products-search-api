/**
 * Products routes JS file for managing all the routes related to search API 
 */
// Load modules
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const productSearchController = require('../controllers/products');

router.get('/:pageNumber/:pageSize', productSearchController.products_get_by_filter_conditions);

module.exports = router;