var express = require('express');
var path = require('path');
var ytdl = require('ytdl-core');
var fs = require('fs');
var ejs = require('ejs');
var portNum = 3000;

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

app.get('/d', function (req, res) {
    var filename = req.query.v;
    var vidUrl = 'http://www.youtube.com/watch?v=' + filename;
    ytdl.getInfo(vidUrl, function(err, info){
        fs.stat(path.join(__dirname, 'public', 'video', filename + '.webm'), function(err, stat){
            if (err == null){
                // file already exists
                console.log('file exists');
                res.sendStatus(200);
            } else if (err.code == 'ENOENT'){
                // file does not exist
                // download the file
                var video = ytdl(vidUrl, { quality: 43 });
                video.pipe(fs.createWriteStream(path.join(__dirname, 'public', 'video', filename + '.webm')));
                video.on('response', function(resp){
                    resp.on('end', function(){
                        res.sendStatus(200);
                    });
                });
            } else {
                console.log('error: ', err.code);
                res.status(404).send('Not found');
            }
        });
    });
});

app.get('/view', function (req, res) {
    res.render('view0', {vid:('video/' + req.query.v+'.webm')});
});

app.listen(portNum, function(){
	console.log('Server started on port ' + portNum);
});
