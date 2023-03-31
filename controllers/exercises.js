const Exercise  = require('../models/exercise');
const Branch  = require('../models/branch');
const Image  = require('../models/image');
const multer = require('multer');
const fs =  require('fs')
var path = require('path');
const { exerciseSchema} = require('../src/schemas.js');
const ExpressError =  require('../utils/ExpressError');

const validateExercise = (req, res) =>{  
    const {error} = exerciseSchema.validate(req.body)

    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
       return;
    }
}
const Storage =  multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/exercises');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
})

const upload = multer({
    storage: Storage
}).single('image')

module.exports.create = async(req, res)=>{
    const branch = await Branch.findById(req.params.id);
   
    upload(req, res, async(err)=>{
        if(err){
            req.flash('error', `${err}`);
        }else if(req.file){                     /// if image in request, add image to exercise
            const newImg = new Image({
                name: req.file.originalname,
                data: req.file.filename
            })
            console.log(newImg)
            newImg.save()
            .then(async()=>{
                const exercise = new Exercise({...req.body.exercise, image:newImg});
                if(exercise.answers.includes(exercise.solution)){
                    branch.exercises.push(exercise);
                    await exercise.save();
                    await branch.save();
                    req.flash('success', 'Stworzono nowe zadanie!');
                }
                else{
                    req.flash('error', 'Wybierz rozwiązanie wśród odpowiedzi!');
                }
                res.redirect(`/branches/${branch._id}`);
                req.body.exercise.image = newImg;
                validateExercise(req, res)
            })
            .catch(err=>console.log(err));
        }
        else{                                       /// if image not in request, skip image creating
            const exercise = new Exercise({...req.body.exercise});
            if(exercise.answers.includes(exercise.solution)){
                branch.exercises.push(exercise);
                await exercise.save();
                await branch.save();
                req.flash('success', 'Stworzono nowe zadanie!');
            }
            else{
                req.flash('error', 'Wybierz rozwiązanie wśród odpowiedzi!');
            }
            res.redirect(`/branches/${branch._id}`);
            validateExercise(req, res)
        }
        
    })

    
}

module.exports.updateForm = async(req, res)=>{
    const id = req.originalUrl.split('/')[2];
    const branch = await Branch.findById(id) 
    let exercise =  await Exercise.findById(req.params.exerciseId)
    .populate({
        path :  "image",
        populate: "name"
    });
    if(exercise===null){
        req.flash('error', `Nie można znaleźć tego zadania!`);
        res.redirect('/exercises')
    }
    res.render('exercises/edit', {exercise, branch})
}

module.exports.update = async(req, res)=>{
    

    upload(req, res, async(err)=>{
        
        if(err){
            console.dir(err)
            req.flash('error',err);
        }else if(req.file){
            
            const newImg = new Image({
                name: req.file.originalname,
                data: req.file.filename
            })
            console.log(newImg)
            newImg.save()
            .then(async()=>{
                const exercise =  await Exercise.findByIdAndUpdate(req.params.exerciseId, {...req.body.exercise});
                exercise.image = newImg;
                exercise.save();
                
            })

        }else{
            
            const exercise =  await Exercise.findByIdAndUpdate(req.params.exerciseId, {...req.body.exercise});
            exercise.image = undefined;
            await exercise.save()
        }
    })

    const id = req.originalUrl.split('/')[2];
    const branch = await Branch.findById(id) 
    req.flash('success', 'Edytowano zadanie!');
    res.redirect(`/branches/${branch._id}`)
}


module.exports.delete = async(req, res)=>{
    const {id, exerciseId} = req.params;
    const branch = await Branch.findByIdAndUpdate(id, {$pull: {exercises: exerciseId}});
    await Exercise.findByIdAndDelete(exerciseId);
    res.redirect(`/branches/${id}`);
}

module.exports.deleteImgField = async(req, res)=>{
    
    var splits = req.originalUrl.split('/');
    var index = splits.findIndex(object => {
        return object === 'deleteImgField';
      });
    var exerciseId = splits[index-1]
    const exercise =  await Exercise.findById(exerciseId)
    exercise.image = undefined;
    await exercise.save()
    console.log(exercise)
    res.redirect('back')

}
