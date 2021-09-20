const router = require("express").Router();
// const bcrypt = require('bcryptjs/dist/bcrypt')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { route } = require("express/lib/application");
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");
const { has } = require("@hapi/joi/lib/types/array");
const { valid } = require("@hapi/joi");
const cors = require("cors");

//
// REGISTER
router.post("/register", async (req, res) => {
  // VALIDATE USER DATA
  
      console.log(req.body)
    const { error } = registerValidation(req.body);
    if (error) return res.status(200).send(error.details[0].message);

    // Checking if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist)
      return res.status(200).send({
        message: "email already exist",
        code: -1,
      });

    // checking if the username is already in the database
    const usernameExist = await User.findOne({ username: req.body.username });
    if (usernameExist)
      return res.status(200).send({
        message: "username already exist",
        code: -1,
      });

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    
    try {
    const savedUser = await user.save();
    res.send({
      user: user._id,
      message: "Register user berhasil",
      body: {
        name: user.name,
        username: user.username,
        email: user.email,
        password: true,
      },
      code: 1,
    });
  } catch (err) {
      console.log(err)
    res.status(500);
    res.send({
      code: -1,
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  // VALIDATE USER DATA

  const { error } = loginValidation(req.body);
  if (error)
    return res.status(200).send(error.details[0].message, {
      code: -1,
    });

  // Checking if the email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(200).send({
      message: "Email is not found",
      code: -1,
    });
  // PASSWORD IS CORRECT
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(200).send({
      message: "Invalid Password",
      code: -1,
    });

  // PASSWORD CONFIRMATION
  const confirmPass = await bcrypt.compare(req.body.password, user.password);
  if (!confirmPass)
    return res.status(200).send({
      message: "Password is not same",
      code: -1,
    });

  // Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  // res.header('auth-token', token).send(token)
  res.send({
    user: user._id,
    message: "Berhasil Login",
    body: {
      name: user.name,
      username: user.username,
      email: user.email,
      password: true,
    },
    "auth-token": token,
    code: 1,
  });

  console.log("Logged in");
});

module.exports = router;
