var http = require('http');
var ecstatic = require('ecstatic')(__dirname);

var server = http.createServer(function (req, res) {
    if (/^\/[^\/.]+$/.test(req.url)) {
        req.url = '/';
    }
    ecstatic(req, res);
});
server.listen(5001);

console.log('http://localhost:5001');
