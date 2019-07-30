var express = require('express')
var app = express()
const port = 3000;
var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://ut-edge.westeurope.cloudapp.azure.com:27017/undertaker"
// respond with "hello world" when a GET request is made to the homepage
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  var allowedOrigins = ['http://10.104.238.42:8086', 'http://localhost:8086'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


app.get('/', function (req, res) {
  res.send('hello world')
});


app.get('/stats', function (req, res) {
MongoClient.connect(dbUrl, function(err, db) {
    if (err) throw err;
    var avgarr = [];
    var dbo = db.db("undertaker");
    var query = {hostname: req.query.hostname, mac: req.query.mac};
    dbo.collection("parsed").find(query).sort({ TimeStamp:1}).toArray(function(err, result) {
      // var dateFirst = new Date(Date.parse(result[0].TimeStamp.split(' ')[0])).getDate();
      // avgarr.push({TimeStamp: dateFirst ,cpu: result[0].cpu, count: 1})
      
      result.forEach(element => {
        var date = new Date(Date.parse(element.TimeStamp)).getDate();
        console.log(date);
        var isFound = false;
        
        avgarr.forEach(avg => {
          
          if(date == avg.TimeStamp) {
            avg.cpu += element.cpu;
            avg.memory += element.memory;
            avg.bandwidth += element.bandwidth;
            avg.count += 1;
            isFound = true;
          }
        });
        if (!isFound) {
          avgarr.push({TimeStamp: date ,cpu: element.cpu,memory: element.memory,bandwidth: element.bandwidth,throughput: element.throughput, voltage: element.voltage, count: 1})
        }
      })
      avgarr = avgarr.map(avg => {
        return {cpu: avg.cpu/avg.count, memory: avg.memory/avg.count, bandwidth: avg.bandwidth/avg.count/100, throughput: avg.throughput/avg.count, voltage: avg.voltage/avg.count };
      })
      res.send(avgarr);
      db.close();
    });
  });
});

app.get('/machines', function (req, res) {
  MongoClient.connect(dbUrl, function(err, db) {
      if (err) throw err;
      var dbo = db.db("undertaker");
      dbo.collection("prediction").find({state: {$in: ['Suspicious', 'Idle']} }).limit(20).toArray(function(err, resultone) {
        
        dbo.collection("tagged").find({}).toArray(function(err, resultagged) {
        
        
          resultone =  resultone.map(element => {
                                                 var tagging = resultagged.find(p => (p.mac == element.mac && p.hostname == element.hostname));
                                                 if(tagging != null) {
                                                   element.tag = tagging.tag;
                                                 }
                                                 return element;})
          res.send(resultone);
          db.close();
        });
        db.close();
      });
    });
});

app.get('/updatetags', function (req, res) {
  MongoClient.connect(dbUrl, function(err, db) {
      if (err) throw err;
      var dbo = db.db("undertaker");
      var newvalues = { hostname: req.query.hostname, mac: req.query.mac,  whitelisted: req.query.whitelisted, correct: req.query.correct, tag: req.query.tag};
      dbo.collection("tagged").insertOne(newvalues,function(err, result) {
        db.close();
      });
    });
});


app.listen(port, (err) => {
    if (err) {
      return console.log('something bad happened', err)
    }
  
    console.log(`server is listening on ${port}`)
});



// Connect to the db
