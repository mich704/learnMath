const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const imageSchema = Schema({
    name:{
        type: String,
        required: true
    },
    image:{
        data: Buffer,
        contentType: String
    }
})

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;