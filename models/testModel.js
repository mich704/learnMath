const mongoose = require('mongoose');
const solvedTest = require('./solvedTest');
const Schema =  mongoose.Schema;
const User = require('./user');
const Challenge = require('./challenge');
const Level = require('./level');

const testSchema = new Schema({
    author:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    exercises:[{
        type: Schema.Types.ObjectId,
        ref: "Exercise",
        required: true
    }],
    level:{
        type: Number,
        required: true
    }, 
    branchId:{
        type: Schema.Types.ObjectId,
        ref: "Branch"
    },
    starThreshold:{
        type: Number
    },
    maxScore: {
        type: Number
    }
    
    
}, {timestamps: true});


testSchema.pre('save',  function(next){
    //console.log("pre delete hook", this.getQuery())
    this.starThreshold = this.level*10;
    this.maxScore = this.exercises
    .reduce((accumulator, object) => {
        return accumulator + object.difficulty;
    }, 0);
    console.log('saving test maxScore', this.maxScore)
    next()
});

testSchema.pre('findOneAndDelete', async function(next){
    //console.log("pre delete hook", this.getQuery())
    const toDelete = await Test.findById(this.getQuery())
    const users = await User.find({}).populate('solvedTests challenges')
    const level = await Level.findOne({level: toDelete.level});
    const tests = await Test.find()
    const challenges = await Challenge.find()
    level.tests.remove(toDelete);
    level.save();
    console.log('level tests after delete', level.tests)
    await Challenge.deleteMany({test: toDelete})
    await Challenge.deleteMany({test: {$nin: [...tests]}})
    
    /// delete tests saved in user object
    users.forEach(async(user) => {
        user.tests.remove(toDelete)
        
        /// delete challenges containing deleted test
        user.challenges.forEach(async(challenge) =>{
            if(!challenges.includes(challenge)){
                user.challenges.remove(challenge);
            }
            if(challenge.test.equals(toDelete._id)){
                user.challenges.remove(challenge);
            }
        });
        await user.save()

        user.solvedTests.forEach(async(solved) =>{
            ///console.log(solved.test._id.equals(toDelete._id))
            if(solved.test.equals(toDelete._id)){
                user.solvedTests.remove(solved);
            }
            await solvedTest.deleteOne(solved)
        })
        await user.save()
    });
    next();
})

testSchema.pre('deleteMany', async function(next) {
    console.log('deleteMany')
    await solvedTest.deleteMany()
  
    // users.forEach(user => {
    //     user.tests.length = 0;
    // });

    next()
})

const Test = mongoose.model('Test', testSchema);

module.exports = Test;