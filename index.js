var express = require('express');
var mongo = require('mongodb').MongoClient;
var validurl = require('check-valid-url');
var crypto = require('crypto');


var dbUrl = "mongodb://localhost:27017/minifyurl";
var uri = "http://localhost:8000/";
var app = express();



app.get('/:id' function(req,res){
	var id = req.param.id;
	if(Number.isInteger(parseInt(id)){
		mongo.connect(dbUrl,function(err,db){
		var urls = db.collection('urls');
		urls.find({_id: id}).toArray(function(err,data){
			if(err) {console.log(err); throw err;}
			res.writeHead(302,{'Location': data[0].url});
			res.end()
			db.close();
		});
	});

			}
	else {
		res.json({'error': "the Url was not found in the DB"});
		res.end()
	}


			)})

app.get('new/:url' function(req, res){
	var url = req.param.url;
	if(validurl.isUrl(url)){
		mongo.connect(dbUrl,function(err,db){
			if(err){console.log(err); throw err;}
			var urls = db.collection('urls');
			urls.find().toArray(function(err, data){
				var key = Date.now().toString().splice(-4);
				var check = data.indexOf(key);
				while(check >= 0){
				key += 1;
				check = data.indexOf(key);
			}
			urls.insert({'_id': key, 'url': url}, function(err,doc){
				if(err){console.log(err); throw err;}
				console.log(doc + " was added to urls");
				db.close();
			});


		});
	});
	}
	else{res.json({'error': 'The url supplied is not a valid url'});
}
});
