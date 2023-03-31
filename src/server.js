const mongoose = require('mongoose');
const app = require('./app')
const DB = 'mongodb://localhost:27017/mathApp1'

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(DB)
    .then(() =>{
        console.log("MONGO CONNECTION OPEN!")
        console.log("http://localhost:3000")
    })
    .catch( err => {
        console.log("MONGO CONNECTION ERROR: ", err)
    })
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

app.listen(3000, ()=>{
  console.log("Listening at port 3000...")
})