const { func } = require('joi');
const mongoose = require('mongoose');
const Schema =  mongoose.Schema;
const User = require('./user')


const challengeSchema = new Schema({
    test: {
        type: Schema.Types.ObjectId,
        ref: "Test",
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reciever:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    senderStatus: {
        type: String,
        enum: ['pending', 'done'],
        default: 'pending',
        required: true
    },
    recieverStatus: {
        type: String,
        enum: ['pending', 'done'],
        default: 'pending',
        required: true
    },
    challengeStatus:{
        type: String,
        enum: ['pending', 'done'],
        default: 'pending',
        required: true
    },
    senderPoints:{
        type: Number,
        default: 0,
        required: true
    },
    recieverPoints:{
        type: Number,
        default: 0,
        required: true
    },
});

challengeSchema.methods.getUserPoints = function getUserPoints(user){
    if(user._id.equals(this.reciever._id)){
        return this.recieverPoints
    }
    else if(user._id.equals(this.sender._id)){
        return this.senderPoints
    }
}

challengeSchema.methods.setUserPoints = function setUserPoints(user, solved){
    if(user._id.equals(this.reciever._id)){
        this.recieverPoints = solved.result.points
    }
    else if(user._id.equals(this.sender._id)){
        this.senderPoints = solved.result.points
    }
    else{
        return mongoose.MongooseError('User not declared in challenge')
    }
}

challengeSchema.methods.getUserStatus =  function getUserStatus(user){
    if(user._id.equals(this.reciever._id)){
        return this.recieverStatus
    }
    else if(user._id.equals(this.sender._id)){
        return this.senderStatus
    }
    else{
        return mongoose.MongooseError('User not declared in challenge')
    }
}


challengeSchema.methods.setUserStatus =  function setUserStatus(user, status){
    if(user._id.equals(this.reciever._id)){
       this.recieverStatus = status
    }
    else if(user._id.equals(this.sender._id)){
        this.senderStatus =  status
    }
    else{
        return mongoose.MongooseError('User not declared in challenge')
    }
}


challengeSchema.methods.getRival =  function getRival(user){
    if(user._id.equals(this.reciever._id)){
        return this.sender
    }
    else if(user._id.equals(this.sender._id)){
        return this.reciever
    }
    else{
        return mongoose.MongooseError('User not declared in challenge')
    }
}


challengeSchema.methods.groupChallenges = function groupChallenges(login){
    const pendingChallenges = [];   /// did not completed by user
    const activeChallenges = [];    /// did not completed by rival
    const doneChallenges = [];      /// completed by both users
    for(let chall of login.challenges){
        var rival = chall.getRival(login)
        
        var myStatus =  chall.getUserStatus(login)
        var rivalStatus =  chall.getUserStatus(rival)
        console.log(myStatus, rivalStatus, rival)


        if(chall.challengeStatus !== 'done'){
            if(myStatus === 'pending'){
                pendingChallenges.push(chall)
            }
            else if(rivalStatus === 'pending'){
                activeChallenges.push(chall)
            }
        }
        else{
            doneChallenges.push(chall)
        }

    }

    return {pendingChallenges, activeChallenges, doneChallenges}
}


challengeSchema.pre('save', async function(next) {
    if(this.senderStatus === 'done' && this.recieverStatus === 'done'){
        this.challengeStatus = 'done'
    
        if(this.senderPoints > this.recieverPoints){
            var senderUser = await User.findById(this.sender)
            senderUser.stars += (this.senderPoints- this.recieverPoints);
            console.log('PRE', senderUser.stars)
            await senderUser.save()
            console.log('POST', senderUser.stars)
        }
        else if(this.senderPoints < this.recieverPoints){
            var recieverUser = await User.findById(this.reciever)
            recieverUser.stars += (this.recieverPoints- this.senderPoints);
            console.log('PRE', recieverUser.stars)
            await recieverUser.save()
            console.log('POST', recieverUser.stars)
        }
        
    }
    next();
});





const Challenge = mongoose.model('Challenge', challengeSchema);
module.exports = Challenge;