const csvtojson = require('csvtojson');
const mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/examen";
var dbConn;
const express = require('express');
const app = express();
mongodb.MongoClient.connect(url, {
    useUnifiedTopology: true,
}).then((client) => {
    console.log('DB Connected!');
    dbConn = client.db();
}).catch(err => {
    console.log("DB Connection Error: ${err.message}");
});
// CSV file name
const fileName = "datasets-worldometer.csv";
var arrayToInsert = [];

csvtojson().fromFile(fileName).then(source => {
    // Fetching the all data from each row
    for (var i = 0; i < source.length; i++) {
         var oneRow = {
            country: source[i]["Country/Region"],
            continent: source[i]["Continent"],
            population: source[i]["Population"],
            totalCases: source[i]["TotalCases"],
            totalDeaths: source[i]["TotalDeaths"],
            totalRecovered: source[i]["TotalRecovered"],
            activeCases: source[i]["ActiveCases"]
         };
         arrayToInsert.push(oneRow);
     }
     //inserting into the table “employees”
     var collectionName = 'datos1';
     var collection = dbConn.collection(collectionName);
     
    var cursor = collection.find().sort({totalCases:-1}).limit(5);
     collection.insertMany(arrayToInsert, (err, result) => {
         if (err) console.log(err);
         if(result){
             console.log("Import CSV into database successfully.");
         }
     });
 
});
app.listen(3000, function() {
    console.log('listening on 3000')
  })
  app.get('/', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("examen");
        var mysort = { totalCases: 1 };
        dbo.collection("datos").find().limit(5).sort(mysort).toArray(function(err, result) {
          if (err) throw err;
          res.send(result);
          db.close();
        });
      });
  })
