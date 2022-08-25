var express = require('express');
var app = express();

//임시 DB
// let comments = [];


const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
  });

class Comments extends Model {}

Comments.init({
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Comments' // We need to choose the model name
});
// the defined model is the class itself
console.log(Comments === sequelize.models.Comments); // true

(async () => {
    await Comments.sync();})();
    // Code here


// req.body 쓸 때 위에 실행
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

//get - READ
app.get('/', async function(req, res) {
    const comments = await Comments.findAll();
    res.render('index',{comments : comments});
});

//post - CREATE
app.post('/create',  async function(req, res) {
    console.log(req.body)
    
    const { content } = req.body

    // Create a new user
    const jane = await Comments.create({ content, content });


//DB에 넣기
    res.redirect('/');
  });

//post - UPDATE
app.post('/update/:id',  async function(req, res) {
    console.log(req.params)
    console.log(req.body)
    const { id } = req.params
    const { content } = req.body
    
    await Comments.update({content: content}, { 
        where: {
          id: id
        }
      });

//DB에 넣기
    res.redirect('/');
  });


// post - DELETE
app.post('/delete/:id',  async function(req, res) {
    console.log(req.params)
    const { id } = req.params
    
    await Comments.destroy({
        where: {
          id: id
        }
      });

//DB에 넣기
    res.redirect('/');
  });

app.listen(3000);
console.log('Server is listening on port 3000');