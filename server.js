const {MongoClient,ObjectID} = require('mongodb');
const ejs = require('ejs');
const bp = require('body-parser');
var express = require('express');
var app = express();

app.set('view engine','ejs');
app.use(bp.urlencoded({extended : true}));

app.get('/',(req,res) => {
    MongoClient.connect('mongodb://localhost:27017/Task',(err,db) => {
        if(err) {
            console.log('Unable to Connect with MongoDB ',err);
        }
        db.collection('comment').find().toArray().then((docs) => {
            res.render('form.ejs',{ docs : docs});
        });
    });
});

app.post('/submitcomment',(req,res) => {
    var _comment = req.body.comment;
    MongoClient.connect('mongodb://localhost:27017/Task',(err,db) => {
        if(err) {
            console.log('Unable to Connect with Database ',err);
        }
        console.log('Connected to MongoDB');
        db.collection('comment').insertOne({comment : _comment}).then((docs) => {
            console.log('Added Comment Successfully in Comment Collection');
            console.log('JSON Format is ',docs.ops);
            console.log('String Format is ',JSON.stringify(docs.ops,undefined,2));
            res.redirect('back');
        });
    });
});
app.get('/edit/:id',(req,res) => {
    var id = req.params.id;
    MongoClient.connect('mongodb://localhost:27017/Task',(err,db) => {
        if(err) {
            console.log('Unable to connect with MongoDB ',err);
        }
        db.collection('comment').find({_id : new ObjectID(id)}).toArray().then((docs) => {
            res.render('update.ejs',{ id : id ,docs : docs});            
        },(err) => {
            console.log(err);
        });
    });
});

app.post('/editcomment/:id',(req,res) => {
    var id = req.params.id;
    var com = req.body.com;
    MongoClient.connect('mongodb://localhost:27017/Task',(err,db) => {
        if(err) {
            console.log('Unable to connect with MongoDB ',err);
        }
        db.collection('comment').findOneAndUpdate(
            { _id : new ObjectID(id)},
            { $set : { comment : com}},
            { returnOriginal : false },(err,result) => {
                if(err) {
                    console.log('Error in Updating the comment ',err);
                }
                console.log('Updation Successfull');
                res.redirect('/');
            }
        );
    });
});

app.get('/deletecomment/:id',(req,res) => {
    var id = req.params.id;
    MongoClient.connect('mongodb://localhost:27017/Task',(err,db) => {
        if(err) {
            console.log('Unable to Connect with MongoDB ',err);
        }
        db.collection('comment').deleteOne({_id : new ObjectID(id)}).then((docs) => {
            console.log('Delete Successfull');
            res.redirect('back');
        },(err) => {
            console.log('Error in deleting docs from MongoDB');
        })
    });
});

app.listen(2000);