// Load modules

const mongoose = require('mongoose');

// Model for Product
const productSchema = mongoose.Schema ({
    _id: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId,
    productName: String,
    shortDescription: String,
    longDescription: String,
    price: String,
    productImage: String,
    reviewRating: Number,
    reviewCount: Number,
    inStock: Boolean
});

module.exports = mongoose.model('Product', productSchema);