const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    logoName: {
        type: String, // Identifier for the logo icon/image on frontend
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Location', LocationSchema);
