const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const UsersModel = require('../models/UsersModel.js');
require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET;


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
            "address": req.body.address,
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
            async (dbDocument) => {
                // (3.a) If email already exists, reject the registration
                if(dbDocument) {
                    res.send("Sorry. An account with that email already exists");
                }
                // (3.b) If email is unique, proceed to step 4
                else {

                    // (4.a) If image is provided, upload to cloudinary
                    const theFiles = Object.values(req.files);
                    if( theFiles.length > 0 ) {
                        
                        // Upload to cloudinary
                       await cloudinary.uploader.upload(
                            theFiles[0].path,
                            (cloudinaryErr, cloudinaryResult) => {
                                if(cloudinaryErr) {
                                    console.log(cloudinaryErr)
                                }
                                else {
                                    // Append the URL of the image in newUsersModel
                                    newUsersModel.avatar = cloudinaryResult.url
                                }
                            }
                        )
                    }

                    // (4.b) Generate a salt with bcryptjs
                    bcryptjs.genSalt(
                        (err, theSalt) => {

                            console.log('theSalt', theSalt)

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

// http://www.myapp.com/user/login
router.post(
    '/login',
    (req, res) => {

        // (1) Capture data from client (e.g, Postman or Browser)
        const formData = {
            "email": req.body.email,
            "password": req.body.password
        }

        // (2) Check for email match in database
        UsersModel
        .findOne({ email: formData.email })
        // If MongoDB responds
        .then(
            (dbDocument) => {

                // (3.a) If email doesn't exists, reject login
                if(!dbDocument) {
                    res.send("Sorry. Wrong email or password");
                }
                // (3.b) If email does exist, retrieve the document
                else {
                    // (4) Check the password
                    bcryptjs
                    .compare(formData.password, dbDocument.password)
                    // If .compare() works
                    .then(
                        (isMatch) => {
                            // (5.a) If password is incorrect, reject the login
                            if(!isMatch) {
                                res.send("Sorry. Wrong email or password");
                            }
                            // (5.b) If password is correct, prepare to send the json web token
                            else {                            
                                // (6) Prepare the payload
                                const payload = {
                                    id: dbDocument.id
                                }

                                // (7) Send to client the json web token
                                jwt
                                .sign(
                                    payload,
                                    jwtSecret,
                                    (err, jsonwebtoken) => {
                                        res.json({
                                            firstName: dbDocument.firstName,
                                            lastName: dbDocument.lastName,
                                            email: dbDocument.email,
                                            avatar: dbDocument.avatar,
                                            jsonwebtoken
                                        });
                                    }
                                )
                            }
                        }
                    )
                    // If .compare() fails to compare
                    .catch(
                        () => {
                            console.log('error', error);
                            res.send('error');
                        }
                    )
                }
            }
        )
        // If MongoDB does not respond
        .catch(
            (error) => {
                console.log('error', error);
                res.send('error');
            }
        )

    }
)

module.exports = router;