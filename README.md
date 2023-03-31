
# Math learnig support web application - LearnMath
Following application supports high school students in learnig basics math issues. Website may also be a tool used by teachers to create exercises and tests, which then will be solved by students.

## Requirements

- Install Node.js
- Install MongoDB


## Built With

* ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
* ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
* ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
* ![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
* ![jQuery](https://img.shields.io/badge/jquery-%230769AD.svg?style=for-the-badge&logo=jquery&logoColor=white)
* ![mathquill](https://img.shields.io/badge/mathquill-mathquill-orange)


## Project structure

Folder name  | Contents
------------- | -------------
controllers | procedures called on given HTTP requests
models  | mongoose database models definitions
public  | public assets (js packages, images and stylesheets)
routes  | HTTP endpoints for db models 
utils  | backend and frontend error handling
views  | ejs views templates


## Local setup

After cloning repo, cd into learnMath directory, then install Node modules by:

```
npm-install
```

Then setup database, below command will connect and insert basic data into database:

```
node seeds.js
```

To start application execute:

```
nodemon server.js
```
## Basic scenario

Solving test (student user):

![levels](images/levels.png)
![chooseTest](images/chooseTest.png)
![testAttempt](images/testAttempt.png)

Creating math exercise for given branch (teacher user):

![createExercise1](images/createExercise1.png)
![createExercise2](images/createExercise2.png)