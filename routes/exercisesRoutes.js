const express =  require('express');
const Exercise  = require('../models/exercise');
const router =  express.Router({mergeParams: true});
const exerciseController = require('../controllers/exercises')
const {isLoggedIn, isStudent} = require('../middleware.js');
const ExpressError =  require('../utils/ExpressError');
const Branch = require('../models/branch')
const asyncHandler =  require('../utils/asyncHandler');

const { exerciseSchema} = require('../schemas.js');

const validateExercise = (req, res, next) =>{  
    console.log(req.body)
    const {error} = exerciseSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}
router.route('/')
    .post(asyncHandler(exerciseController.create))


router.get('/newExercise', isLoggedIn, isStudent,  asyncHandler(async(req, res)=>{
    const id = req.originalUrl.split('/')[2];
    const branch = await Branch.findById(id) 
    res.render('exercises/new', {branch})
}))


router.get('/:exerciseId/edit',isLoggedIn, isStudent,  asyncHandler(exerciseController.updateForm));
router.delete('/:exerciseId',isLoggedIn, isStudent,  asyncHandler(exerciseController.delete));

router.put('/:exerciseId',isLoggedIn, isStudent, asyncHandler(exerciseController.update));

module.exports = router;
