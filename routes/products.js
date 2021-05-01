const express = require('express');
const router = express.Router();
const ProductsModel = require('../models/ProductsModel.js');

/*
 * For mongoose methods, see https://mongoosejs.com/docs/api/model.html
 */

 // http://www.myapp.com/product/add
router.post(
    '/add',
    (req, res) => {

        // 1. Capture data from client (e.g, Postman or Browser)
        const formData = {
            "brand": req.body.brand,
            "model": req.body.model,
            "price": req.body.price
        }
        
        // 2. Upload the data to MongoDB

        // Instantiating an object for this data specifically
        const newProductsModel = new ProductsModel(formData);

        newProductsModel
        .save() //  Promise
        .then( //resolved...
            (dbDocument) => {
                res.send(dbDocument);
            }
        )
        .catch( //rejected...
            (error) => {
                res.send(error)
            }
        );
    }
);

// http://www.myapp.com/product/find
router.get(
    '/find',
    (req, res) => {

        // Use the Mongo Model for Products to find a product
        ProductsModel
        .find(
            { model: 'iPhone 12'}
        )
        // If the item is found in the database...
        .then(
            (dbDocument) => {
                res.send(dbDocument);
            }
        )
        // If the item is NOT found in the database...
        .catch(
            (error) => {
                console.log('mongoose error', error);
            }
        );
    }
);

// http://www.myapp.com/product/update
router.post(
    '/update',
    (req, res) => {

        ProductsModel
        .findOneAndUpdate(
            { 'model': 'iPhone 12' },
            {
                $set: {
                   'price': 3800 
                }
            }
        )
         // If the item is found in the database...
         .then(
            (dbDocument) => {
                res.send(dbDocument);
            }
        )
        // If the item is NOT found in the database...
        .catch(
            (error) => {
                console.log('mongoose error', error);
            }
        );

    }
);

// Export the routes
module.exports = router;