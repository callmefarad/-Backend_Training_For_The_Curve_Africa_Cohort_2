const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
    records: [
        {
            type: Schema.Types.ObjectId, ref: 'Record'
        }
    ]
}, {timestamps: true} );

module.exports = mongoose.model('User', userSchema);