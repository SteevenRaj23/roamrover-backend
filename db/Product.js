const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    date: Number,
    details: String,
    imageUrl: String
});

module.exports = mongoose.model('Package', productSchema);