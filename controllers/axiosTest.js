const Test =  require('../models/testModel')
const Branch =  require('../models/branch')
const Challenge =  require('../models/challenge')
var mongoose = require('mongoose');


timer = async(testId)=>{
    // console.log('id timer', testId)
    var objId = mongoose.Types.ObjectId(testId)
    const test = await Test.findById( objId).populate('exercises','description difficulty answers');
    console.log(test)
    var timeToSolve = 0
    test.exercises.forEach(ex => {
        timeToSolve += ex.difficulty*60;
    });
                 ///Second
    return timeToSolve
}



getTests = async(branchId, level)=>{
    var objId = mongoose.Types.ObjectId(branchId)
    var pendingChallenges = await Challenge.find({challengeStatus:'pending'})
    var pendingChallTests = []

    /// array of pending challenges tests
    for(let challenge of pendingChallenges){
        pendingChallTests.push(challenge.test)
    }

    console.log('pending tests', pendingChallTests)

    try{
        const branch = await Branch.findById( objId)
        .populate({
            path: 'tests',
            populate:{
                path: "level"
            }
        });

      

        const filteredTests = branch.tests.filter(test => test.level<=level)
        console.log( filteredTests)
        const responseTests = []
        for(let fT of filteredTests){
            var isPending = false;
            for(let pending of pendingChallTests){
                if(fT._id.equals(pending._id)){
                    isPending = true
                    break;
                }
            }
            if(isPending===false){
                responseTests.push(fT)
            }
        }

        console.log(responseTests)
        return responseTests;
    }
    catch(e){
        console.log(e)
    }
    
}



getPendingChallengesNumber = async(loginUser)=>{
    if(loginUser){
        const pendingForUser = await Challenge.find({
            $or: [
                {$and: [
                    {senderStatus: 'pending'},
                    {sender: loginUser}
                ]},
                {$and: [
                    {recieverStatus: 'pending'},
                    {reciever: loginUser}
                ]}
            ]
        })
       
        return pendingForUser.length
    }
    return null
    
}



module.exports = {timer, getTests, getPendingChallengesNumber}