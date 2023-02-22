const express =  require('express');
const router =  express.Router({mergeParams: true}); // need to merge request params to get them from prefixed path in app.js

const User = require('../models/user')
const Branch = require('../models/branch')
const LevelPoint = require('../models/levelPoints')
const asyncHandler =  require('../utils/asyncHandler');
const ExpressError =  require('../utils/ExpressError')
const passport =  require('passport')  
const {isLoggedIn, isStudent} = require('../middleware.js');

router.get('/register', (req, res)=>{
    if(!req.user){ 
        res.render('register')
    }
    else{
        res.redirect('/')
    }
})

router.post('/register', async(req, res)=>{
    if(!req.user){ 
        try{
            const {email, username, password, role} =  req.body;
            const uniqueMail = await User.findOne({email: email});
            if(uniqueMail){
                req.flash('error', 'Ten adres email jest już zajęty.')
                return res.redirect('register')
                
            }
            var branches = await Branch.find({});
            const user = new User({email, username, role, stars:0, challenges:[]});
            for(let branch of branches){
                for(let i=1 ; i<=5 ; i++){
                    var count = String(i);
                    var lvlPoint = new LevelPoint({branch: branch, level: count, points: 0});
                    user.levelPoints.push(lvlPoint);
                    
                    await lvlPoint.save()
                }
            }

            //await user.save()
            
            const registeredUser = await User.register(user, password)  /// saves user and authenticates, hashes password etc.
            //registeredUser.role = role
            
            req.login(registeredUser, err => {
                if (err){
                    return req.flash('error', 'Nieprawidłowe dane użytkownika.');
                }
                req.flash('success', 'Witamy w learnMath');
             
                res.redirect('/');
            });
        }catch(e){
            if(e.message.includes('A user with the given username is already registered')){
                e = 'Ta nazwa użytkownika jest już zajęta!'
            }
            req.flash('error', `${e}`)
            res.redirect('register')
        } 
    }else{
        res.redirect('/')
    }

})

router.get('/login', async(req, res)=>{
    if(!req.user){ 
        res.render('login')
    }
    else{
        res.redirect('/')
    }
});

router.post('/login', passport.authenticate('local', {failureFlash: 'Podano nieprawidłowe dane logowania.', failureRedirect:'/login', keepSessionInfo: true}),async(req, res)=>{
    req.flash('success','Witamy ponownie!');  
    const prevPage = req.session.prevPage || '/branches';
    delete req.session.prevPage;
    User.updateLastLoginTime(req.user._id, Date.now())
    res.redirect(prevPage);
});

router.get('/logout', (req, res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "Do zobaczenia!");
        res.redirect('/');
    });
})

module.exports = router;