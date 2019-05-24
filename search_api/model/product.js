
/**
 * 
 * Products model/schema JS file mapped to products collection in MongoDB
 *  
 */
// Load modules

const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);

const Currency = mongoose.Types.Currency;

// Model for Product
const productSchema = mongoose.Schema ({
    _id: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId,
    productName: String,
    shortDescription: String,
    longDescription: String,
    price: { type : Currency },
    productImage: String,
    reviewRating: Number,
    reviewCount: Number,
    inStock: Boolean
});

module.exports = mongoose.model('Product', productSchema);