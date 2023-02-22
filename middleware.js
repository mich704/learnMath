const Test =  require('./models/testModel')
const solvedTest =  require('./models/solvedTest')
const User =  require('./models/user');


const isLoggedIn =  (req, res, next)=>{
    if(!req.isAuthenticated()){  
        req.session.prevPage = req.originalUrl;         
        req.flash('error', 'Musisz być zalogowany!');
        return res.redirect('/login');                          /// return to avoid ' Cannot set headers after they are sent to the client' ERROR
    }
    next();
}


const isAdmin = (req, res, next)=>{
    console.log("ROLA", res.locals.loginUser.role != 'Admin')
    if(res.locals.loginUser.role != 'Admin'){
        req.session.prevPage = req.originalUrl;         
        req.flash('error', 'Nie masz uprawnień aby wykonać tą operację!');
        return res.redirect( 'back');    
    }
    next();
}


const isStudent = (req, res, next)=>{
    if(res.locals.loginUser.role === 'Uczeń'){
        req.session.prevPage = req.originalUrl;         
        req.flash('error', 'Nie masz uprawnień nauczyciela/admina, aby wykonać tą operację!');
        return res.redirect( 'back');    
    }
    next();
}


const repeatSolveThreshold = async(req, res, next)=>{
    var latestSolve = null;
    const login = await User.findOne(res.locals.loginUser).populate('solvedTests')
    const toSolve =  await Test.findById(req.params.testId);

    for(var i= login.solvedTests.length-1 ; i>=0 ; i--){
        if(login.solvedTests[i].test.equals(toSolve._id)){
            latestSolve = login.solvedTests[i];
            break;
        }
    }
    if(latestSolve){
        const total =  new Date().getTime()- new Date(latestSolve.updatedAt).getTime();
        const hours = (Math.floor((total)/1000))/3600;
        var minutes = Math.floor(hours * 60)
        if(minutes < 60 && login.role === "Uczeń"){   
            req.flash('error', `Ponowne rozwiązanie testu będzie możliwe za ${60 - minutes} min `);
            return res.redirect( 'back');    
        }
    }
    next()
}


const checkStarsAmount = async(req,res,next)=>{
    const login = await User.findOne(res.locals.loginUser)
    .populate({
        path: 'solvedTests',
        populate:{
            path: 'result test'
        }
    })

    const toSolve =  await Test.findById(req.params.testId);

    const starsScoredOnLevel = login.solvedTests
    .filter(solvedTest => solvedTest.test.level === toSolve.level)    
    .reduce((accumulator, object) => {
        return accumulator + object.result.points;
    }, 0);

    if(toSolve && login.stars<toSolve.starThreshold && toSolve.level > 1 && login.role === 'Uczeń'){
        req.flash('error', `Aby rozwiązać ten test, musisz zdobyć następującą ilość gwiazdek: ${toSolve.starThreshold-login.stars}.`);
        return res.redirect( 'back');   
    }
    
    next()
}


const preventSolveRepeat = async(req,res,next)=>{
    const toSolve = await solvedTest.findById(req.params.solvedId).populate('result')
    console.log('FOUND SOLVE', toSolve.result.answers)
    if(toSolve.result.answers.length>0){
        req.flash('error', `Nie możesz powrócić do menu tego podejścia`);
        res.redirect('/');
        next()
    }    
    next()
}

module.exports = {isLoggedIn, preventSolveRepeat, isStudent, repeatSolveThreshold, isAdmin, checkStarsAmount}
