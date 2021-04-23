const mongoose = require('mongoose');
const uniqueEmail = require('mongoose-unique-validator');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema({
    email: {
        type: String, 
        required: true, 
        unique: true,
        validate: [isEmail, "Enter a valid email address"],
    },
    password: {
        type: String, 
        required: true, 
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "The password must contain at least 8 characters including an uppercase, a lowercase, a number and a special character"]
    }
});

userSchema.plugin(uniqueEmail);

module.exports = mongoose.model('Users', userSchema);