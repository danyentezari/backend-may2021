// Import mongoose
const mongoose = require('mongoose');


// Creating the schema
const ProductsSchema = new mongoose.Schema(
    {
        brand: {
            type: String,
            required: true
        },
        model: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }
);

// Create the model
const ProductsModel = mongoose.model('products', ProductsSchema);

module.exports = ProductsModel;