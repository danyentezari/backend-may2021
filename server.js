// Import the express library
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');

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

// Any request that goes to http://www.myapp.com/user/
server.use(
    '/user',
    usersRoutes
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


server.listen(
    process.env.PORT || 3001,
    () => {
        console.log('connected to http://localhost:3001')
    }
);