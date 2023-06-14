const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: true
    }
}, { timestamps: true } )

const studentModel = mongoose.model( 'studentprofile', studentSchema );
module.exports = studentModel;