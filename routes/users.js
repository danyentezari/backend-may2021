const express = require('express');
const router = express.Router();
const UsersModel = require('../models/UsersModel.js');

 // http://www.myapp.com/user/add
router.post(
    '/add',
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


module.exports = router;