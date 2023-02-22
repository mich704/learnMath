const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const testResultSchema = new Schema({
    answers:[{
        type: String
    }],
    points: {
        type: Number,
        require: true
    },
    maxScore:{
        type: Number,
        require: true
    },
    score:{
        type: Number,
        require: true
    },
    summary:[
        {
            type: String,
            require: true
        }
    ]
});



const TestResult = mongoose.model('TestResult', testResultSchema);

module.exports = TestResult;
    