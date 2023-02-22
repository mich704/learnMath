const mongoose = require('mongoose');
const Test = require('./testModel');
const Schema =  mongoose.Schema;


const exerciseSchema = new Schema({
    branch:{
        type: Schema.Types.ObjectId,
        ref: "Branch"
    },
    difficulty: Number, 
    description:{
        type: String,
        required: true
    },
    answers:[{
        type:String,
        required: true
    }],
    solution:{
        type: String,
        required: true
    },
    image:{
        type: Schema.Types.ObjectId,
        ref: "Image"
    }
})

exerciseSchema.pre('findOneAndDelete', async function(next){
    const toDelete = await Exercise.findById(this.getQuery())
    const tests = await Test.find({})
    tests.forEach(async(element)=>{
        console.log('forech',element.exercises, toDelete, element.exercises.includes(toDelete._id))
        if(element.exercises.includes(toDelete._id)){
            element.exercises.remove(toDelete);
            await element.save();
        }
        if(element.exercises.length==0){
            await Test.deleteOne(element);
            console.log('REMOVED TEST')
        }
    })
    //console.log('exercise del hook', tests)

    next();
});

exerciseSchema.pre('save', function(next) {
    //console.log(this.answers.includes(this.solution))
    

    if(this.answers.includes(this.solution) === false){
        //console.log(this, 'Wartość rozwiązania nie zawiera się w możliwych odpowiedziach!')
       
        throw new mongoose.Error.ValidationError
    }
    else if(this.answers.length != 4 ){
        //console.log(this, 'Podaj co namjniej 4 odpowiedzi')
        Exercise.deleteOne(this)
        throw new mongoose.Error.ValidationError
    }
    else if(new Set(this.answers).size !== this.answers.length){
        throw new mongoose.Error.ValidationError
    }
    else{
        // space formatting, needed in mq inputs
        this.description = this.description.split(/\s+/)
        var newDesc = ''
        for(let word of this.description.split(/\s+/)){
            if(word.includes(`\\\\`)){
                word.replace(`\\\\` , '\\ ')
                //console.log(word)
            }
            else{
                word+='\\ '
            }
            //console.log(word, word.includes(`\\\\`))
            newDesc+=word
        }
        this.description = newDesc
        this.description = this.description.replaceAll(`\\\\`, `\\`)
    }
    next()
})

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;