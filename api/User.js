const express = require('express');
const router = express.Router();

//mongodb user model
const User = require('./../models/User');

//Password Handler
const bcrypt = require('bcrypt');

//SignUp
router.post('/signup', (req, res) => {
    let { name, mail, pass, pnum } = req.body;

    if (name == "" || pass == "" || mail == "" || pnum == "") {
        res.json({
            status: "FAIL",
            message: "Empty Input Fields!"
        });
    }

    name = name.trim();
    mail = mail.trim();
    pass = pass.trim();
    pnum = pnum.trim();

    if (!/^[a-zA-Z ]*$/.test(name)) {
        return res.json({
            status: 'FAILED',
            message: "Invalid name created",
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(mail)) {
        res.json({
            status: 'FAILED',
            message: "Invalid mail created",
        })
    } else if (pnum.length !== 10 || !/^\d+$/.test(pnum)) {
        return res.json({
            status: 'FAILED',
            message: "Invalid phone number",
        });
    } else if (pass.length < 5) {
        res.json({
            status: 'FAILED',
            message: "Password is too short!",
        })
    } else {
        //Checking if use already exists
        User.find({ name }).then(result => {
            if (result.length) {
                // A user with this UserName already exists
                res.json({
                    status: "FAILED",
                    message: "A user with this UserName already exists",
                })
            } else {
                // Try to create new User

                // Password Handling
                const saltRounds = 10;
                bcrypt.hash(pass, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        name, mail, pass: hashedPassword, pnum,
                    });
                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "SignUp Successful",
                            data: result,
                        })
                    })
                        .catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while saving user account!"
                            })
                        })
                })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while hashing password!"
                        })
                    })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing user!"
            })
        })
    }
})

//SignIn
router.post('/signin', (req, res) => {
    let { name, pass } = req.body;
    name = name.trim();
    pass = pass.trim();

    if (name == "" || pass == "") {
        res.json({
            status: "FAILED",
            message: "Empty Credentials!"
        })
    } else {
        //Check if user exists
        User.find({ name })
            .then(data => {
                if (data.length) {
                    //User exists
                    const hashedPassword = data[0].pass;
                    bcrypt.compare(pass, hashedPassword).then(result => {
                        if (result) {
                            //Password match
                            res.json({
                                status: "SUCCESS",
                                message: "SignIn successful!",
                                data: data
                            })
                        } else {
                            res.json({
                                status: "FAILED",
                                message: "Invalid password entered!"
                            })
                        }
                    })
                        .catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while comparing passwords!"
                            })
                        })
                } else {
                    res.json({
                        status: "FAILED",
                        message: "Invalid Credentials entered!"
                    })
                }
            })
            .catch(err => {
                res.json({
                    status: "FAILED",
                    message: "An error occurred while checking for existing user!"
                })
            })
    }
})

module.exports = router;