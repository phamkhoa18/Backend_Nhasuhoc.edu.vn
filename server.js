const express = require('express');
const dotenv = require('dotenv') ;
const cors = require('cors') ;
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose') ;
const port = process.env.HOST || 8888;
const path = require('path') ;

// use FILE.js more
const Utils = require('./Utils') ;
// use router
const UsersRouter = require('./routers/UsersRouter');
const MenusRouter = require('./routers/MenusRouter');
const CategoriesRouter = require('./routers/CategoriesRouter');
const NewsRouter = require('./routers/NewsRouter');
// config
dotenv.config() ;
app.use(morgan('common'));
app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// use uploads static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// CONNECT DATABASE 
mongoose.connect('mongodb://localhost:27017/NHASUHOC').then(() => {
    console.log('Connect database thành công');
}) 
.catch((err) => {
        console.log('Connect thất bại');
});

// config router 

app.use('/' , Utils.validateRequest , UsersRouter);
app.use('/' , Utils.validateRequest , MenusRouter);
app.use('/' , Utils.validateRequest , CategoriesRouter);
app.use('/' , Utils.validateRequest , NewsRouter) ;


app.listen(port , () => {
   console.log(`Server run: ` + port );
})