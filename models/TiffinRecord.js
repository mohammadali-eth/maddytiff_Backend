const mongoose = require('mongoose');

const TiffinRecordSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    tiffinType: {
        type: String,
        enum: ['Day', 'Night'],
        required: true
    },
    numberOfTiffins: {
        type: Number,
        required: true,
        default: 1
    },
    pricePerTiffin: {
        type: Number,
        required: true,
        default: 90
    },
    totalAmount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});



module.exports = mongoose.model('TiffinRecord', TiffinRecordSchema);
