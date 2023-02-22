const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const levelPointSchema = new Schema({
    branch:{
        type: Schema.Types.ObjectId,
        ref: 'Branch'
    },
    level: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    }
});

const LevelPoint = mongoose.model('LevelPoint', levelPointSchema);

module.exports = LevelPoint;