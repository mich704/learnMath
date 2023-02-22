const mongoose = require('mongoose');
const Schema =  mongoose.Schema;
const User = require('./user');
const Result = require('./testResult')

const solvedTestSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    test: {
        type: Schema.Types.ObjectId,
        ref: "Test"
    }, 
    result: {
        type: Schema.Types.ObjectId,
        ref: "TestResult"
    } 
}, {timestamps: true});


solvedTestSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    await Result.deleteOne(...this.result);
    const results = await Result.find();
    //console.log(results)
    next();
});

const solvedTest = mongoose.model('solvedTest', solvedTestSchema);
module.exports = solvedTest;