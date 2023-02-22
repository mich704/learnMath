const Test  = require('../models/testModel');
const Branch = require('../models/branch')
const TestResult = require('../models/testResult')
const User = require('../models/user');
const solvedTest = require('../models/solvedTest');
const level = require('../models/level');
const Level = require('../models/level');
const Challenge = require('../models/challenge');


const markTest =  function(answers,test){
    var points = 0;
    var summary = []
    if(answers.length >0){
        for (var i = 0; i < test.exercises.length; i++) {
            var correct = test.exercises[i].solution;
            ///console.log(typeof test.exercises[i].di)
            var toCheck = answers[i];
            if(toCheck === null){
                summary.push('źle')
            }
            if(correct===toCheck){
               
                points+=test.exercises[i].difficulty;
                summary.push('dobrze')
            }else{
                ///console.log('INCORRECT!',correct, toCheck)
                summary.push('źle')
            }
        }
    }
    else{
        for (var i = 0; i < test.exercises.length; i++) {
            summary.push('źle')
        }
    }

   

    var maxScore = test.maxScore;

    var score = (points/maxScore).toFixed(3);
    return {answers, points, maxScore, score, summary};
}



module.exports.index = async(req,res)=>{
    const allTests =  await Test.find({})

    allTests.forEach(async(element) => {
        console.log(element.exercises.length)
        if(element.exercises.length==0){
            await Test.deleteOne(element)
        }
    });

    const id = req.originalUrl.split('/')[2];
    const branch = await Branch.findById(id).
    populate({
        path: 'tests',
        options: {sort: {level:1}},
        populate: {
            path: 'exercises'
        }
    })
    var testStarsMap = {}; /// map of test difficulty and quantity of tests of that difficulty
    const loginUser = await User.findOne(res.locals.loginUser)
    .populate('username tests solvedTests', 'test testResult')
    .populate('levelPoints');
    const tests = branch.tests;
  
    for(let i=1; i<=5 ; i++){
        ///console.log(i,' TESTS ' ,testStarsMap[`stars${i}`] = tests.filter(x => x.level==i))
        var testsOnLevel = tests.filter(x => x.level==i).length
        var maxScoreSumOnLevel = tests.filter(x => x.level==i)
        .reduce((accumulator, object) => {
            return accumulator + object.maxScore;
        }, 0);
        testStarsMap[`stars${i}`] = [testsOnLevel, maxScoreSumOnLevel]
        //console.log('testStarsMap', testStarsMap)
        //console.log(loginUser.levelPoints)
    }

    res.render('testsViews/index', {branch, loginUser, testStarsMap})
}


module.exports.createTest = async(req, res)=>{
    if(req.body.exNumber > 0){
        const id = req.originalUrl.split('/')[2];
        const branch = await Branch.findById(id).
        populate({
            path: 'exercises',
            populate: {
                path: 'solution'
            }
        });
        const array =  branch.exercises.filter(ex=>ex.difficulty <= req.body.level)
        const shuffled = array.sort(() => 0.5 - Math.random());

        // Get sub-array of first n elements after shuffled
        let exercises = shuffled.slice(0, req.body.exNumber);

        if(exercises.length===0){
           req.flash('error', 'Brak zadań o podanej trudności, nie stworzono testu!');
           res.redirect('back')
        }
        const test =  new Test({exercises: exercises, level: req.body.level, branchId: branch._id})

        const level =  await Level.findOne({'level':test.level}).populate('tests')
        console.log('LEVEL', level)
        
        level.tests.push(test);
        
        branch.tests.push(test)
        await level.save()
        await test.save()
        await branch.save()
        //console.log('LEVEL TESTS', level.tests)
       // await level.save()
        req.flash('success', 'Stworzono nowy test!');
        res.redirect(`tests/${test._id}`)
    }
    else{
        req.flash('error', 'Podaj liczbę zadań!');
        res.redirect(`/`);
    }
    
    //exercises.slice(0, req.body.exNumber)
    //res.send(test)
    
}

const preventSolveRepeat = async(req,res)=>{
    const toSolve = await solvedTest.findById(req.params.solvedId).populate('result')
    if(toSolve.result.answers.length>0){
      
        return false;
    }    
    return true
}

module.exports.solveForm = async(req, res)=>{

    var canSolve = await preventSolveRepeat(req,res)

    if(canSolve){
        const ID = req.originalUrl.split('/')[2];
        const branch = await Branch.findById(ID);
        const id =  req.params.testId;
        const test = await Test.findById( id).populate('exercises','description difficulty answers');
        var timeToSolve = 0
        test.exercises.forEach(ex => {
            timeToSolve += ex.difficulty*60;
        });
        var solvedId =  req.params.solvedId

        var startTime = Date.now()
        var startDate = new Date(startTime);
        var endDate = new Date(startTime);
        timeToSolve = 10                   ///Seconds
        endDate.setSeconds(endDate.getSeconds() + parseInt(timeToSolve));

        //console.log(startDate, endDate)
        /// seconds
        res.render('testsViews/solve', {branch, test, solvedId, timeToSolve, startTime})
    }else{
        req.flash('error', `Nie możesz powrócić do menu tego podejścia`);
        var branchId =  req.params.id
        res.redirect(`/branches/${branchId}/tests`)
    }
    
    //res.send({test})
}

module.exports.createSolvedTest = async(req, res)=>{
    const ID = req.params.id
    const id =  req.params.testId;

    const test = await Test.findById( id)
    var answers = [];
   
    const result =  new TestResult() 
    const solved = new solvedTest({test, result})
    await result.save()
    await solved.save()

    res.redirect(req.originalUrl+'/'+solved._id)
}

const updateChallenge = async(user, test, solved)=>{
  
    const toUpdate =  await Challenge.findOne({test: test});
    
    if(toUpdate && (user.equals(toUpdate.sender) || user.equals(toUpdate.reciever)) ){
        toUpdate.setUserPoints(user, solved)
        console.log(solved.result.points)
        toUpdate.setUserStatus(user, 'done')

        toUpdate.save()
        console.log('AFTERSAVE', toUpdate.challengeStatus)
        if(toUpdate.challengeStatus === 'done'){
            
            console.log('DONE', user.stars)
            

        }
        console.log('POINTS ', toUpdate.getUserPoints(user))
        console.log('UPDATE CHALLENGE', toUpdate)
    }
    
}

module.exports.solve = async(req, res)=>{
    
    // const ID = req.params.id
    const id =  req.params.testId;

    const test = await Test.findById( id).populate('exercises','description difficulty answers solution');
    
    var answers = []
    
    
    for(let i = 0 ; i < test.exercises.length; i++){
        const answer =  req.body[`answer${i}`]
        console.log(answer)
        answers.push(answer ? answer : null);
    }
    // /// marking test and saving solved test object
    const helper = markTest(answers,test);
    // const result =  new TestResult(helper) 
    // console.log(result, 'res')
    // await result.save()
    const solved = await solvedTest.findById(req.params.solvedId).populate('result')
    
    solved.result = helper;
    
    solved.result.save()
    solved.save()
    // console.log("new solved", solved)
    const login = await User.findOne(res.locals.loginUser).populate('tests solvedTests', 'test testResult' )
    .populate('levelPoints')
    login.tests.push(test)
    login.solvedTests.push(solved)
    const lvl = String(test.level)

    await updateChallenge(login, test, solved);
   
    const points = solved.result.points
    // // console.log('LEVEL', String(test.level-1), 'pOINTS SCORED', points)

    // // /// update points scored on certain test level
    login.levelPoints[String(test.level-1)].points += points
    // // console.log('lvlPoints', login.levelPoints[String(test.level-1)])

    await login.levelPoints[String(test.level-1)].save()
    await login.save()
   
    //res.send(solved.result)
    
   res.redirect(req.originalUrl+`/summary`)
}




module.exports.summaryForm =  async(req,res)=>{
    const test = await Test.findById(req.params.testId)
    const solved = await solvedTest.findById(req.params.solvedId)
    .populate({
        path: 'test',
        populate: {
            path: 'exercises',
            populate:{
                path: 'difficulty'
            }
        }
    })
    .populate('result')
    
    try{
        const user = await User.findById(res.locals.loginUser).populate('stars');
    
        var i = 0
        //console.log(user.stars)
        for( let ex of solved.test.exercises){
            //console.log(solved.result.summary[i])
            if(solved.result.summary[i]==='dobrze'){
            // console.log(user.stars, ex.difficulty)
                user.stars += ex.difficulty;
            }
            
            i+=1;
        }
        await user.save()
    
        //res.send(solved)
    
        res.render('testsViews/summary', {solved})
    }
    catch(e){
        req.flash('error', e)
        res.redirect('/')
    }
    
}


module.exports.show = async (req, res)=>{
    const id =  req.params.testId;
    const test = await Test.findById( id).populate({
        path: 'exercises',
        populate: {
            path: 'solution'
        }
    });
    var currentUrl = req.originalUrl
    res.render('testsViews/show', {test, currentUrl})
}

module.exports.delete = async(req, res)=>{
    const {id, testId} = req.params;
    await Branch.findByIdAndUpdate(id, {$pull: {tests: testId}});
    await Test.findByIdAndDelete(testId);
    req.flash('success', 'Usunięto test!');
    res.redirect(`back`);
}
