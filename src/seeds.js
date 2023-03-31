const mongoose = require('mongoose');
const Branch =  require('../models/branch');
const Exercise = require('../models/exercise');
const Test = require('../models/testModel');

const SolvedTest = require('../models/solvedTest');
const TestResult = require('../models/testResult');
const db = require('../models')
const roles = require('../utils/roles');
const { User } = require('../models');
const LevelPoint = require('../models/levelPoints');
const Level = require('../models/level');
const Challenge = require('../models/challenge');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mathApp1')
    .then(() =>{
        console.log("MONGO CONNECTION OPEN!")
    })
    .catch( err => {
        console.log("MONGO CONNECTION ERROR: ", err)
    })
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}




const branchesData = [
    {
        name: 'Trygonometria',
        description: 'Dział matematyki, którego przedmiotem badań są związki miarowe między bokami i kątami trójkątów oraz funkcje trygonometryczne. Trygonometria powstała i rozwinęła się głównie w związku z zagadnieniami pomiarów na powierzchni Ziemi oraz potrzebami żeglugi morskiej',
        exercises: []
    },
    {
        name: 'Kombinatoryka',
        description: 'Dział matematyki, pomagający odpowiedzidź na pytanie: "Na ile sposobów możemy wybrać pary w klasie 28 osobowej?".',
        exercises: []
    },
    {
        name: 'Wartość bezwzględna',
        description: 'To inaczej mówiąc, odległość danej liczby od zera. Wartość bezwzględna z 3 jest równa 3, analogicznie wartość bezwzględna z -3 jest równa 3. Zapisujemy ją w następujący sposób: |3|=|-3|=3.',
        exercises: []
    }
]


// const exercises = [
//     {
//         description: 'Ile jest liczb naturalnych czterocyfrowych o sumie cyfr równej 2 ?',
//     },
//     {
//         description: 'Wszystkich liczb naturalnych dwucyfrowych, które są podzielne przez 6 lub przez 10, jest: ',
//     },
//     {
//         description: 'Wartość bezwzględna z liczby -100 (|-100|) jest równa: ',
//     },
//     {
//         description: 'Cosinus kąta 60* jest równy: ',
//     }
// ]

// description:{
//     type: String,
//     required: true
// },
// answers:[{
//     type:String,
//     required: true
// }],
// solution:{
//     type: String,
//     required: true
// }

const trigExercises = [
    {
        description: 'sin(x) kąta 60°  ∂x √' ,
        answers: ['1','2','3','4'],
        solution: '1',
        difficulty:1,
    },
    {
        description: 'Dany jest trójkąt prostokątny o kątach ostrych α i ß. Wyrażenie 2 cos α − sin β jest równe:',
        answers: ['2\\sinβ', '\\cosα', '0', '2'],
        solution: '\\cosα',
        difficulty:1,
    },
    {
        description: 'sin kąta ostrego α jest równy \\frac{4}{5}. Wtedy cos tego kąta wynosi:',
        answers: ['\\frac{5}{4}', '\\frac{1}{5}', '\\frac{9}{25}', '\\frac{3}{5}'],
        solution: '\\frac{3}{5}',
        difficulty:3
    },
    {
        description: 'cos kąta ostrego α jest równy \\frac{1}{5}. Wtedy sin tego kąta wynosi:',
        answers: ['\\frac{2\\sqrt{6}}{5}', '\\frac{24}{25}', '\\frac{1}{5}', '\\frac{6}{25}'],
        solution: '\\frac{2\\sqrt{6}}{5}',
        difficulty:4
    },
    {
        description:'Kąt α jest ostry i \\frac{sinα}{cosα} + \\frac{cosα}{sinα} = 2. Oblicz wartość wyrażenia sinαcosα',
        answers: ['2', '\\frac{1}{5}', '\\frac{1}{2}', '\\frac{1}{3}'],
        solution: '\\frac{1}{2}',
        difficulty:4
    }

]


const createBranch = function(branch) {
    return db.Branch.create(branch).then(docBranch => {
      console.log("\n>> Created Branch:\n", docBranch);
      return docBranch;
    });
};

const createExercise = function(exercise) {
    return db.Exercise.create(exercise).then(docExercise => {
      console.log("\n>> Created Exercise:\n", docExercise);
      return docExercise;
    });
};

const addExerciseToBranch = async(branchId, exercise)=> {
    branch =  await Branch.findByIdAndUpdate(branchId)
    branch.exercises.push(exercise)
    return branch
}




const seedDB = async()=>{
    console.log(branchesData)
    await Branch.deleteMany({});
    await Exercise.deleteMany({});
    await Test.deleteMany({});
    await SolvedTest.deleteMany({});
    await TestResult.deleteMany({});
    await Challenge.deleteMany({});
    await Level.deleteMany({});
    await Branch.updateMany({}, {$set: {tests:[]}})
    
   for(let b of branchesData){
        var newBranch = new Branch({...b});
        ///console.log({...b})
        await newBranch.save()
   }

    const users =  await User.find({});

    for(let i = 1 ; i<=5 ; i++){
        var newLevel = new Level({level: i, starThreshold: i*10-10, tests: []})
        ///console.log(newLevel)
        await newLevel.save();
    }
    var branches = await Branch.find({});
    
    for(let user of users){
        user.stars = 0;
        user.levelPoints = []
        user.challenges = []
        user.levelPoints.forEach(async(element)=>{
            await LevelPoint.deleteOne({element})
        })
        ///console.log(user.levelPoints)
        for(let branch of branches){
            for(let i=1 ; i<=5 ; i++){
                var count = String(i);
                var lvlPoint = new LevelPoint({branch: branch, level: count, points: 0});
                user.levelPoints.push(lvlPoint);
                
                await lvlPoint.save()
            }
    
        }
        
        await user.save()
    }

  

    // for( let branch of  branches){
    //     const newBranch = new Branch(branch);
    //     await newBranch.save();
    // }
    
    var trigBranch = await db.Branch.find({name: "Trygonometria"})

    for( let ex of  trigExercises){
        ///console.log(ex)
        const newEx = new Exercise(ex);
        await newEx.save();
        console.log('NEW', newEx)
        await Branch.findByIdAndUpdate(trigBranch, {$push: {exercises: {...newEx}}})
    } 
}


seedDB()
    .then(()=>{
        mongoose.connection.close();
    })



