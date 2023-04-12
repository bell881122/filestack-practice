var express = require('express');
var app = express();

app.get('/',function(req,res){
    // res.send('1234');
    res.send('<html><head></head><body><h1>hi!</h1></body></html>')
})

// 監聽 port
var port = process.env.PORT || 3000;
app.listen(port);