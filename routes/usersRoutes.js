const express =  require('express');
const router =  express.Router({mergeParams: true});
const User = require('../models/user')
const Branch = require('../models/branch')
const {isLoggedIn} = require('../middleware.js');



router.get('/:userId',isLoggedIn, async(req, res)=>{
    const loginUser = await User.findOne(res.locals.loginUser)
    .populate('tests solvedTests')
    .populate({
        path: 'tests',
        populate: {
            path: 'exercises'
        }
    })
    .populate({
        path: 'solvedTests',
        populate:{
            path: 'test',
            populate:{
                path: 'level branchId'
            }
        }
    })
    .populate({
        path: 'solvedTests',
        populate:{
            path: 'result',
            populate:{
                path: 'score'
            }
        }
    });
    const urlUser = await User.findById(req.params.userId).populate('tests solvedTests', 'test exercises');
    if(!loginUser._id.equals(urlUser._id) && loginUser.role === 'Uczeń'){
       
        req.flash('error', 'Nie masz uprawnień by wyświetlić ten profil!');
    }
    const students = await User.find({role: 'Uczeń'})
    .sort({'stars':-1})
    .select(['email','username','stars'])

    res.render('users/profile', {loginUser, urlUser, students})
})

router.get('/:userId/progress', isLoggedIn, async(req, res)=>{
    const branches = await Branch.find({});
    res.render('users/progress', {branches})
})


router.get('/:userId/progress/:branchId',isLoggedIn, async(req, res)=>{
    const loginUser = await User.findOne(res.locals.loginUser)
    .populate('tests solvedTests')
    .populate({
        path: 'tests',
        populate: {
            path: 'exercises branchId'
        }
    })
    .populate({
        path: 'solvedTests',
        populate:{
            path: 'test',
            populate:{
                path: 'level branchId',
            }
        }
    })
    .populate({
        path: 'solvedTests',
        populate:{
            path: 'result',
            populate:{
                path: 'score'
            }
        }
    })
    .populate({
        path: 'levelPoints'
    });
    const branch = await Branch.findById(req.params.branchId)
    console.log(branch.name)
    try{
        console.log( loginUser.solvedTests)
        loginUser.solvedTests.sort((a,b)=>(a.test.level - b.test.level));
        var solvedOnBranch = loginUser.solvedTests.filter(solvedTest => solvedTest.test.branchId._id.equals(branch._id))  
    } 
    catch(e){
        console.log(e)
    }   
   
    const urlUser = await User.findById(req.params.userId).populate('tests solvedTests', 'test exercises');
    res.render('users/branchProgress', {loginUser, branch, solvedOnBranch})
});


router.get('/:userId/edit',isLoggedIn, async(req, res)=>{
    const loginUser = await User.findOne(res.locals.loginUser)
    res.render('users/edit', {loginUser})
})

router.put('/:userId',isLoggedIn, async(req, res)=>{
    delete req.body['role']
    const loginUser = await User.findOneAndUpdate(res.locals.loginUser, req.body)
    
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'Pomyślnie zmieniono dane, zaloguj się ponownie!');
        res.redirect('/');
    });

});

module.exports = router;