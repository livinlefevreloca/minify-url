var express = require('express');
var mongo = require('mongodb').MongoClient;
var validurl = require('check-valid-url');
var http = require('http');
var fs = require('fs');




var dbUrl = process.env.MONGO_URI;
var uri = process.env.BASE_URI;
var app = express();
console.log(uri);
console.log(dbUrl);

app.all("*", function(req, res, next) {
  //res.setHeader(200, { "Content-Type": "text/plain" });
  next();
});


app.get('/:id', function(req,res){
   var id = req.params.id;

    if(Number.isInteger(parseInt(id))){
	      mongo.connect(dbUrl,function(err,db){
	          var urls = db.collection('urls');
	          urls.find({_id: id}).toArray(function(err,data){
                 console.log(data[0])
		             if(err) {console.log(err); throw err;}
		             else if(data[0] === undefined){
		                  res.setHeader(200, { "Content-Type": "application/JSON" });
		                  res.json({'error': "url not found in DB"});
		                  res.end();
		                  db.close();
		                   }
                else{

		                 res.redirect(data[0].url)
		                 res.end();
		                 db.close();
	                   }
	              });
           });

		}
  else {
	    res.setHeader(200, { "Content-Type": "application/JSON" });
	    res.json({'error': "the Url given was incorrect"});
	    res.end()
     }


   });

app.get('/new/*', function(req, res){
	var url = req.params[0];
	console.log(url);
	if(validurl.isUrl(url)){
		mongo.connect(dbUrl,function(err,db){
			if(err){console.log(err); throw err;}
			var urls = db.collection('urls');
			urls.find().toArray(function(err, data){
				var key = Date.now().toString().slice(-4);
				var check = data.indexOf(key);
				while(check >= 0){
				key += 1;
				check = data.indexOf(key);
			}
      if(url.match(/^(http)(s)?(:\/\/)(www\.)/)){

      }
      else{url = 'https://www.' + url}
			urls.insert({'_id': key, 'url': url}, function(err,doc){
				if(err){console.log(err); throw err;}
				console.log(doc + " was added to urls");
				res.end("your new url is " + uri + key)
				db.close();

			});


		});
	});
	}
	else{
		res.setHeader(200, { "Content-Type": "application/JSON" });
		res.json({'error': 'The url supplied is not a valid url'});
}
});

app.get("*", function(request, response) {
  response.end("404");
});

http.createServer(app).listen(1337);
