// Import the express library
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const expressFormData = require('express-form-data');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const UsersModel = require('./models/UsersModel');

// Import passport for authentication
const passport = require('passport');
// Import for JWT strategy
const JwtStrategy =  require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Referece a secret data for the jsonwebtoken
const jwtSecret = process.env.JWT_SECRET;

const passportJwtConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
}

// This function is what will read the contents (payload) of the jsonwebtoken
const passportJwt = (passport) => {
    // Configure passport to use passport-jwt
    passport.use(
        new JwtStrategy(
            passportJwtConfig, 
            (jwtPayload, done) => {

                // Extract and find the user by their id (contained jwt)
                UsersModel
                .findOne({ _id: jwtPayload.id })
                .then(
                    // If the document was found
                    (dbDocument) => {
                        return done(null, dbDocument);
                    }
                )
                .catch(
                    // If something went wrong with database search
                    (err) => {
                        return done(null, null);
                    }
                )
            }
        )
    )
};

passportJwt(passport);

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
// Also tell express to read HTTP form data
server.use(expressFormData.parse());

// Allow Cross-Origin Resource Sharing
server.use(cors());

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


// Configure for Cloudinary
cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
)

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
    passport.authenticate('jwt', {session:false}),
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