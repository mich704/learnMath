const express =  require('express');
const router =  express.Router({mergeParams: true});
const {isLoggedIn, preventSolveRepeat, isStudent, repeatSolveThreshold, checkStarsAmount} = require('../src/middleware.js');
const asyncHandler =  require('../utils/asyncHandler');
const testController = require('../controllers/tests.js')
const {timer}  = require('../controllers/axiosTest.js')


router.delete('/:testId', isLoggedIn, isStudent, asyncHandler(testController.delete));

router.route('/')
    .get(isLoggedIn, asyncHandler(testController.index))
    .post(isLoggedIn, isStudent, asyncHandler(testController.createTest))

    
router.route('/:testId/solve')
    .get(isLoggedIn, repeatSolveThreshold, checkStarsAmount, asyncHandler(testController.createSolvedTest))


router.get('/:testId/solve/:solvedId/summary', isLoggedIn, testController.summaryForm)

router.get('/:testId/solve/:solvedId/:name', async(req, res)=>{
    var name = req.params.name
    var func = eval(name)(req.params.testId)
    var x = await func
    return res.send(JSON.stringify(x))
})


router.route('/:testId/solve/:solvedId')
    .get(isLoggedIn, repeatSolveThreshold, checkStarsAmount, asyncHandler(testController.solveForm))
    .post(isLoggedIn, preventSolveRepeat, repeatSolveThreshold, checkStarsAmount, asyncHandler(testController.solve));


router.route('/:testId')
    .get(isStudent,  asyncHandler(testController.show))


module.exports = router;