var MongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb');

var url = 'mongodb://localhost:27017/examen';
 
MongoClient.connect(url, function(err, db) {
 
var cursor = db.collection('datos').find();
 
cursor.each(function(err, doc) {
 
console.log(doc);
 
});
});