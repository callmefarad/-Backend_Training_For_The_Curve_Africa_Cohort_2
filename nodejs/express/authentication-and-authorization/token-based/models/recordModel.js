const mongoose = require( 'mongoose' );

const recordSchema = new mongoose.Schema( {
    math: {
        type: Number,
        required: ["Score is required", true]
    },
    english: {
        type: Number,
        required: ["Score is required", true]
    },
}, { timestamps: true } );

const recordModel = mongoose.model( 'record', recordSchema );

module.exports = recordModel;