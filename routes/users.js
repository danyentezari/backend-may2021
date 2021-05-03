const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const UsersModel = require('../models/UsersModel.js');

 // http://www.myapp.com/user/add
router.post(
    '/add',
    (req, res) => {

        // (1) Capture data from client (e.g, Postman or Browser)
        const formData = {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "email": req.body.email,
            "password": req.body.password,
            "contactNumber": req.body.contactNumber,
            "address": req.body.address
        }

        // (2) Create instance of UsersModel
        const newUsersModel = new UsersModel(formData);

        // (3) Check if email exists
        UsersModel
        .findOne(
            { email: formData.email}
        )
        // If MongoDB connection works
        .then(
            (dbDocument) => {
                // (3.a) If email already exists, reject the registration
                if(dbDocument) {
                    res.send("Sorry. An account with that email already exists");
                }
                // (3.b) If email is unique, proceed to step 4
                else {
                    // (4) Generate a salt with bcryptjs
                    bcryptjs.genSalt(
                        (err, theSalt) => {

                            // (5) Hash the password with the salt
                            bcryptjs.hash(
                                formData.password,
                                theSalt,
                                (err, hashedPassword) => {
                                    // (6) Replace the original password with encrypted version
                                    newUsersModel.password = hashedPassword;

                                    // (7) Save the registration details
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
                            )
                        }
                    )
                }
            }
        )

        // If MongoDB connection does not work
        .catch(
            (error) => {
                console.log('error', error);
                res.send('error')
            }
        )
    }
);


module.exports = router;