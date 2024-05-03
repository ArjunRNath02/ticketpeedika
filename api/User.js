const express = require('express');
const router = express.Router();

//mongodb user model
const User = require('./../models/User');

//Password Handler
const bcrypt = require('bcrypt');

//SignUp
router.post('/signup', async (req, res) => {
    let { name, mail, pass, pnum } = req.body;

    if (name == "" || pass == "" || mail == "" || pnum == "") {
        return res.json({
            status: "FAILED",
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
    }
    try {
        //Checking if user already exists
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.json({
                status: "FAILED",
                message: "A user with this UserName already exists",
            });
        }

        // Password Handling
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(pass, saltRounds);

        // Create new User
        const newUser = new User({
            name,
            mail,
            pass: hashedPassword,
            pnum,
        });

        // Save user and set userId
        await newUser.save();
        newUser.userId = newUser._id;
        await newUser.save();

        res.json({
            status: "SUCCESS",
            message: "SignUp Successful",
            data: newUser,
        });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({
            status: "FAILED",
            message: "An error occurred while saving user account!",
        });
    }
});


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
                            const user = data[0]; // Get the first user from the data array
                            res.json({
                                status: "SUCCESS",
                                message: "SignIn successful!",
                                data: {
                                    userId: user._id, // Corrected line
                                    name: user.name,
                                    mail: user.mail,
                                    pnum: user.pnum,
                                    pass: user.pass,
                                },
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