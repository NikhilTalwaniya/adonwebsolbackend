const express = require('express')
const app = express()
const path = require('path')
const morgan = require('morgan');
const cors = require('cors')
const indexRouter = require('./router/index');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');    
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.charset = 'utf-8'
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'))

app.use(cors())

app.use('/', indexRouter)

app.all('*', (req, res, next)=>{
    const err = new Error(`Requested URL ${req.path} not found`)
    err.statusCode = 404;
    next(err)
})  
  
app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success:0,
      message:err.message,
      stack:err.stack
    })
})

const port = process.env.PORT || 3000
app.listen(port)
console.log(`Server Started at ${port}`);