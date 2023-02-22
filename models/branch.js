const mongoose = require('mongoose');
const Schema =  mongoose.Schema;
const Exercise = require('./exercise')

const branchSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true
    },
    images:[
        {
            type: String
        }
    ],
    exercises:[
        {
            type: Schema.Types.ObjectId,
            ref: "Exercise"
        }
    ],
    tests:[
        {
            type: Schema.Types.ObjectId,
            ref: "Test"
        }
    ]
})

branchSchema.pre('save', function(next){
    this.name = this.name.trim();
    next()
})



branchSchema.post('findOneAndDelete', async function(doc){    /// delete all exercises post branch deletion
    if(doc){
        await Exercise.deleteMany({
            _id:{
                $in: doc.exercises
            }
        })
    }
})

module.exports = mongoose.model('Branch', branchSchema);