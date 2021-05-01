// Import the express library
const express = require('express');
const mongoose = require('mongoose');
const ProductsModel = require('./models/ProductsModel.js');
const UsersModel = require('./models/UsersModel.js');

// express() will return an object with methods for server operations
const server = express();

// Connect to MongoDB
const connectionString = process.env.DB_CONNECTION_STRING;

const connectionConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// Configure express to read body in HTTP
server.use( express.urlencoded({ extended: false }) );
server.use( express.json() );

mongoose
.connect(connectionString, connectionConfig) // Promise
.then( // When resolved...
    () => {
        console.log('Connected to database')
    }
)
.catch( // When rejected...
    (error) => {
        console.log('database error', error)
    }
);

server.get(
    '/',                                // Same as, for example, http://www.myapp.com/
    (req, res) => {
        res.send('<h1>Welcome Home!</h1>');
    }
);

server.get(
    '/about',
    (req, res) => {
        res.send('<h1>About Us</h1>');
    }
);

server.get(
    '/contact',
    (req, res) => {
        res.send('<h1>Contact Us</h1>')
    }
);

// Example of reading parameters in URL
server.get(
    '/inventory',
    (req, res) => {
        let product = req.query.product;
        let price = req.query.price;
        res.send("You searched for " + product + " under " + price + " AED")
    }
);

/*
 * For mongoose methods, see https://mongoosejs.com/docs/api/model.html
 */
server.post(
    '/add-product',
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

server.post(
    '/add-user',
    (req, res) => {

        // 1. Capture data from client (e.g, Postman or Browser)
        const formData = {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "email": req.body.email,
            "password": req.body.password,
            "contactNumber": req.body.contactNumber,
            "address": req.body.address
        }

        // 2. Upload the data to MongoDB
        const newUsersModel = new UsersModel(formData)
        
        newUsersModel
        .save() // Promise
        .then( // When promise is resolved...
            (dbDocument) => {
                res.send(dbDocument)
            }
        )
        .catch( // When promise is rejected...
            (error) => {
                res.send(error)
            }
        )

    }
);

server.post(
    '/register',
    (req, res) => {
        res.json(
            {
                data: "123"
            }
        )
    }
);

server.get(
    '/product',
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

server.post(
    '/update-product',
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

server.listen(
    3001,
    () => {
        console.log('connected to http://localhost:3001')
    }
);