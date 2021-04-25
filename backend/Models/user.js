const mongoose = require('mongoose');
const uniqueEmail = require('mongoose-unique-validator');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema({
    email: {
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true,
        validate: [isEmail, "Invalid Email"]
    },
    password: {
        type: String, 
        required: true,
    }
});

userSchema.plugin(uniqueEmail);

module.exports = mongoose.model('Users', userSchema);