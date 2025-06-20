const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password required only if not OAuth user
        }
    },
    googleId: {
        type: String,
        sparse: true
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 