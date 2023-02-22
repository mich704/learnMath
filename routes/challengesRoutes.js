const express =  require('express');
const router =  express.Router({mergeParams: true});

const User = require('../models/user')
const Branch = require('../models/branch')
const Challenge  = require('../models/challenge')
const Test  = require('../models/testModel')
const {isLoggedIn} = require('../middleware.js');


router.get('/', isLoggedIn, async(req, res)=>{
    const login = await User.findOne(res.locals.loginUser)
    .populate({
        path: 'challenges',
        populate:{
            path: 'test',
            populate: {
                path:'branchId',
                select: 'name'
            }    
        }
    })
    .populate({
        path: 'challenges',
        populate:{
            path: 'sender' ,
            select: 'username'
        }
    })
    .populate({
        path: 'challenges',
        populate:{
            path: 'reciever' ,
            select: 'username'
        }
    })
   
    var pendingChallenges, activeChallenges , doneChallenges;
    if(login.challenges.length >0 ){
        var groupedChallenges = login.challenges[0].groupChallenges(login)
       
        pendingChallenges = groupedChallenges['pendingChallenges']
        activeChallenges = groupedChallenges['activeChallenges']
        doneChallenges = groupedChallenges['doneChallenges']
    
        res.render('users/challenges/challenges', { login: login, pendingChallenges: pendingChallenges, activeChallenges: activeChallenges, doneChallenges: doneChallenges})
    }else{
        pendingChallenges = []
        activeChallenges = []
        doneChallenges = []
        res.render('users/challenges/challenges', { login: login, pendingChallenges: pendingChallenges, activeChallenges: activeChallenges, doneChallenges: doneChallenges})
    }
})


router.get('/:recieverId/newForm', isLoggedIn, async(req, res)=>{
    var branches = await Branch.find({}).populate('tests')
    branches =  branches.filter(b => b.tests.length>0)  /// pass only branches containing tests
    const sender = await User.findOne(res.locals.loginUser)
    

    const reciever = await User.findById(req.params.recieverId)
    const maxChallengeLvl = Math.floor(Math.min(sender.stars, reciever.stars)/10+1);  /// minimal level of 2 users, stars/10+1
    console.log(req.branchId)
    res.render('users/challenges/new', {branches: branches, reciever: reciever, maxChallengeLvl: maxChallengeLvl})
})


router.post('/', isLoggedIn, async(req, res)=>{
    const sender = await User.findOne(res.locals.loginUser)
    .populate({
        path: 'challenges',
        populate:{
            path: 'test',
            populate: {
                path:'branchId',
                select: 'name'
            }    
        }
    })
    .populate({
        path: 'challenges',
        populate:{
            path: 'sender',
            select: 'username'   
        }
    })
    .populate({
        path: 'challenges',
        populate:{
            path: 'reciever',
            select: 'username'   
        }
    });

    var testId = req.body.testId
    
    try{
        const reciever = await User.findById(req.body.recieverId);
        const test = await Test.findById(testId);

        const challenge =  new Challenge({test: test, sender: sender, reciever: reciever, recieverStatus:"pending", senderStatus:"pending", challengeStatus:"pending"})
        await challenge.save();

        sender.challenges.push(challenge)
        reciever.challenges.push(challenge)
    
        await sender.save()
        await reciever.save()
        var pendingChallenges, activeChallenges , doneChallenges;
        if(sender.challenges.length >0 ){
            var groupedChallenges = sender.challenges[0].groupChallenges(sender) 
            pendingChallenges = groupedChallenges['pendingChallenges']
            activeChallenges = groupedChallenges['activeChallenges']
            doneChallenges = groupedChallenges['doneChallenges']
        }
        req.flash('success', `Wyzwano użytkownika ${reciever.username}!`);
        res.redirect('/')
    }
    catch(e){
        req.flash('error', 'Podano nieprawidłowe dane.')
        const students = await User.find({role:'Uczeń'})
        res.render('users/challenges/challengeUserRank', { students})
    }
});

router.get('/:recieverId/newForm/:branchId/:level/:name',isLoggedIn,  async(req, res)=>{
    var name = req.params.name
    var func = eval(name)(req.params.branchId, req.params.level)
    var x = await func
    return res.send(JSON.stringify(x))
})

router.get('/challengeUserRank', isLoggedIn, async(req, res)=>{
    const students = await User.find({role:'Uczeń'})

    res.render('users/challenges/challengeUserRank', { students})
});


module.exports = router;