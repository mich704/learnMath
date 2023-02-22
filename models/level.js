const mongoose = require('mongoose');
const Schema =  mongoose.Schema;


const levelSchema = new Schema({
    level: {
        type: Number,
        required: true
    },
    starThreshold: {
        type: Number,
        required: true
    },
    tests:[
        {
            type: Schema.Types.ObjectId,
            ref: "Test"
        }
    ]
});


const Level = mongoose.model('Level', levelSchema);
module.exports = Level;