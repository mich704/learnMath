

const mongoose = require('mongoose');


const Exercise = require('../models/exercise');
const Test = require('../models/testModel');
const Challenge = require('../models/challenge');
const DB = 'mongodb://localhost:27017/'

describe('Test Exercise Model', () => {
    let connection;
    let db;
  
    beforeAll(async () => {
        await mongoose.connect(DB);
    });

    test('should create exercise succesfully', async () => {
        const newExercise=  new Exercise({
            "difficulty" : 3,
            "description" : "test\\",
            "answers" : [ "1", "2", "3", "4" ],
            "solution" : "1"
        })
       
        await newExercise.save();
        expect(newExercise._id).toBeDefined()
        await Exercise.deleteOne(newExercise)
    })
   
    test('should fail to create exercise without required solution field', async () => {
        let err
        try{
            const newExercise=  new Exercise({
                "difficulty" : 3,
                "description" : "test\\ ",
                "answers" : [ "1", "2", "3", "4" ]
            })

            var saved = await newExercise.save();
        }
        catch(error){
            err = error
        }
        expect(err.constructor.name).toBe('ValidationError')  
    })

    test('should fail to create exercise with duplicate answers', async () => {
        let err
        try{
            const newExercise=  new Exercise({
                "difficulty" : 3,
                "description" : "test\\",
                "answers" : [ "1", "1", "3", "4" ],
                "solution" : "1"
            })

            var saved = await newExercise.save();
        }
        catch(error){
            err = error
        }
        expect(err.constructor.name).toBe('ValidationError')  
    })

    test('should fail to create exercise with invalid solution', async () => {
        let err
        try{
            const newExercise=  new Exercise({
                "difficulty" : 3,
                "description" : "test\\ ",
                "answers" : [ "1", "2", "3", "4" ],
                "solution": '12'
            })
            const saved = await newExercise.save();
        }
        catch(error){
            err = error
        }
        
        expect(err.constructor.name).toBe('ValidationError')   
    })

    test('should fail to create exercise with invalid answers number different than 4', async () => {
        let err
        try{
            const newExercise=  new Exercise({
                "difficulty" : 3,
                "description" : "test\\ ",
                "answers" : [ "1", "2", "3", "4", "5" ],
                "solution": ['1']
            })
            await newExercise.save();
        }
        catch(error){
            err = error
        }
        
        expect(err.constructor.name).toBe('ValidationError')   
    })

    afterAll( async () =>{
        await mongoose.connection.close()
    });
});


describe('Testing testModel', () => {
    let connection;
    let db;
  
    beforeAll(async () => {
        await mongoose.connect(DB);
    });

    test('should fail to create test with no exercies defined', async () => {
        let err
        try{
            const newTest=  new Test({})
            await newTest.save();
        }
        catch(error){
            err = error
        }
        
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)   
    })


    afterAll( async () =>{
        await mongoose.connection.close()
    });
});

describe('Testing Challenge Model', () => {
  
    beforeAll(async () => {
        await mongoose.connect(DB);
    });

    test('should fail to create challenge without sender', async () => {
        let err
        try{
            const newChallenge=  new Challenge({
                  "test" : '639bac332b082799a34a8035',
                    "senderStatus" : "pending",
                     "recieverStatus" : "pending",
                      "challengeStatus" : "pending",
                       "senderPoints" : 0,
                        "recieverPoints" : 0
            })
            await newChallenge.save();
        }
        catch(error){
            err = error
        }
        
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)   
    })


    afterAll( async () =>{
        await mongoose.connection.close()
    });
});

