var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/digitalflashDB', function() {
//     console.log("DB connection established!!!");
// })

mongoose.connect(process.env.CONNECTION_STRING||'mongodb://localhost/flashcards');


var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
var Card = require("./models/cardModel")

app.get('/cards', function(req, res) {
    Card.find(function(error, data) {
        if (error) throw error;
        res.send(data)

    })
})

app.post('/cards', function(req, res) {
    Card.create(req.body, function(error, data) {
        if (error) throw error;
        res.send(data)
    })
})



app.put('/cards/:cardId', function(req, res) {
    var cardId = req.params.cardId
    Card.findByIdAndUpdate(req.body, { new: true }, function(error, data) {
        if (error) throw error;
        res.send(data)
    })
});



app.delete('/cards/:cardId', function (req, res) {
  var cardId= req.params.cardId;
  Card.findByIdAndRemove(cardId,function (error, data) {
    if (error) throw error;
      res.send(data);
    })
  })




app.listen(process.env.PORT || 3000);
