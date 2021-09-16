// // VALIDATION
const Joi = require('@hapi/joi')
const { Schema } = require('mongoose')

// Register Validation
const registerValidation = (data) =>{
    const schema = Joi.object({
        name: Joi.string().max(255).equired(),
        username: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(8).max(24).required()
    })

    return Joi.validate(data, schema)
}

// Login Validation
const loginValidation = (data) =>{
    const schema = Joi.object({
        name: Joi.string().max(255),
        username: Joi.string().max(16),
        email: Joi.string().required().email(),
        password: Joi.string().min(8).max(24).required()
    })

    return Joi.validate(data, schema)
}



module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
