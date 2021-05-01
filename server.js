// Import the express library
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const productsRoutes = require('./routes/products');
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


// Any request that goes to http://www.myapp.com/product/
server.use(
    '/product',
    productsRoutes
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

server.listen(
    process.env.PORT || 3001,
    () => {
        console.log('connected to http://localhost:3001')
    }
);