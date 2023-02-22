const mongoose = require('mongoose');
const Schema =  mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');



const userSchema = new Schema({
    email:{
        type: String,
        require: true
    },
    username:{
        type: String,
        require: true
    },
    password:{ /// needs hashing!
        type: String,
        require: true
    },
    tests:[
        {
        type: Schema.Types.ObjectId,
        ref: "Test"
        }
    ],
    solvedTests:[
        {
            type: Schema.Types.ObjectId,
            ref: "solvedTest"
        }
    ],
    role: {
        type: String,
        enum: ['Admin', 'Nauczyciel', 'Uczeń'],
        default: 'Uczeń'
    },
    stars:'number',
    levelPoints: [
        {
            type: Schema.Types.ObjectId,
            ref: "LevelPoint"
        }
    ],
    challenges:[
        {
            type: Schema.Types.ObjectId,
            ref: "Challenge"
        }
    ],
    lastLoginTime:{
        Type: Date
    }
}, {timestamps: true});

userSchema.plugin(passportLocalMongoose);  // adds password, username and makes sure they are unique etc., hashes and salts pass


userSchema.statics.updateLastLoginTime = async function(userId, currentTime) {
    await User.findOneAndUpdate({_id: userId }, {'lastLoginTime': currentTime});
};

userSchema.pre('save', async function(next){
    console.log(this._id)
    const user =  await User.findById(this._id)
    //console.log(user)
    
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;