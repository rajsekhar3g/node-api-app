module.exports = function(server,restify,restifyValidator){
    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.bodyParser());
    server.use(restify.plugins.queryParser());
    server.use(restifyValidator);

    server.use(restify.plugins.authorizationParser());
    server.use(function(req,res,next){
    var ipWhitelist = ['111.222.333.444'];
    var ip = req.headers['x-forwarded-for']||req.connection.remoteAddress;
if(ipWhitelist.indexOf(ip)===-1)   { 
var response = {
    'status': 'failure',
    'data': 'You must specify a valid API key'
};
res.setHeader('content-type', 'application/json');
res.writeHead(403);
res.end(JSON.stringify(response));
return next();
}
return next();
});


    server.use(function(req, res, next) {
		var apiKeys = {
			'user1': 'maje92mal10qteu82m20sm201wq'
		};
		if (typeof(req.authorization.basic) === 'undefined' || !apiKeys[req.authorization.basic.username] || req.authorization.basic.password !== apiKeys[req.authorization.basic.username]) {
			var response = {
				'status': 'failure',
				'data': 'You must specify a valid API key'
			};
			res.setHeader('content-type', 'application/json');
			res.writeHead(403);
			res.end(JSON.stringify(response));
			return next();
		}
		return next();
	});

    server.use(restify.plugins.throttle({
        rate:1,
        burst:2,
        xff:true
    }));
}
