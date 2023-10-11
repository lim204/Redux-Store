const mongoose = require('mongoose');

const {Schema} = mongoose;


const Product = mongoose.model ('Product', productSchema);

module.exports = Product;