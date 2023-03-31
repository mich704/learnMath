const express =  require('express');
const router =  express.Router({mergeParams: true}); // need to merge request params to get them from prefixed path in app.js

const Branch = require('../models/branch')
const asyncHandler =  require('../utils/asyncHandler');
const ExpressError =  require('../utils/ExpressError');
const {isLoggedIn, isStudent,isAdmin} = require('../src/middleware.js');
const branchController = require('../controllers/branches.js')

const { branchSchema} = require('../src/schemas.js');

const validateBranch = (req, res, next) =>{  
    const {error} = branchSchema.validate(req.body)
    console.log(branchSchema.validate(req.body).value)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}




router.route('/:id/section/:subtemplate')
    .get(  asyncHandler(branchController.getSubtemplate))

router.route('/')
    .get(asyncHandler(branchController.index))
    .post(isLoggedIn, validateBranch, isAdmin,asyncHandler(branchController.create))



router.get('/tests', isLoggedIn, asyncHandler(branchController.indexTests));

router.get('/new', isLoggedIn, isAdmin, branchController.createForm)


router.get('/:id/edit', isLoggedIn, isAdmin, asyncHandler(branchController.updateForm));
router.route('/:id')
    .get(asyncHandler(branchController.show))
    .put(isLoggedIn, isAdmin, validateBranch, asyncHandler(branchController.update))
    .delete(isLoggedIn, isAdmin, asyncHandler(branchController.delete));

router.get('/:id/:page', asyncHandler(branchController.show))



module.exports = router;