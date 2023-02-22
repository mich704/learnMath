const express =  require('express');
const app = express();
const path =  require('path');
var methodOverride = require('method-override')
const ejsMate =  require('ejs-mate') // partials
const ExpressError =  require('./utils/ExpressError')
const session = require('express-session');
const flash =  require('connect-flash');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');

const User = require('./models/user')

const passport =  require('passport')  
const LocalStrategy =  require('passport-local')  

const branches = require('./routes/branchesRoutes');
const exercises = require('./routes/exercisesRoutes');
const auth = require('./routes/authRoutes');
const testsRoutes = require('./routes/testsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const challengesRoutes = require('./routes/challengesRoutes');

const ROLES =  require('./utils/roles');
const {getPendingChallengesNumber} = require('./controllers/axiosTest')

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true})) /// needed to get POST method body data
app.use(mongoSanitize());

app.use(methodOverride('_method'))
app.use(express.static( path.join(__dirname, 'public')));

const sessionConfig ={
    secret: 'genericSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //week milliseconds
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());                                        // login sessions

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(async(req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.loginUser = req.user;
    console.log(req.query)
    res.locals.userRoles = ROLES;
  
    next();
})

app.use('/', auth);
app.use('/users', usersRoutes);
app.use('/users/:userId/challenges', challengesRoutes);
app.use('/branches/:id/tests', testsRoutes);
app.use('/branches', branches);
app.use('/branches/:id/exercises', exercises);


app.get('/getPendingChallengesNumber', async(req, res)=>{
    var name = 'getPendingChallengesNumber'
    if(res.locals.loginUser){
        var func = eval(name)(res.locals.loginUser)
        console.log(res.locals.loginUser.username)
        var x = await func
        console.log('xd', x)
        return res.send(JSON.stringify(x))
    }

})


app.get('/', (req, res)=>{
    //res.send(parser.latexParser.parse("hello \\author[opt]{name}"))
   
    res.render('home')
})


app.all('*', (req, res, next)=>{    
    next(new ExpressError('Page Not Found!', 404))
})


app.use((err, req, res, next)=>{
    const {statusCode = 500} =  err;
    if(err.message == null) err.message = "Coś poszło nie tak!" 
    
    res.status(statusCode).render('error', {err})
})


module.exports = app;