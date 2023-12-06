'use strict';

/**
 * Middleware that will be used later in the API to manage the flow of requests
 */

const { origins } = require('../assets');

module.exports = Object.freeze({
    OAuthMiddleware: function(req, reply, done) {
        if (!origins.includes(req.headers.origin) && req.headers.authorization !== process.env._secretKey) return reply.code(401).send({ message: 'Unauthorized', code: 401 });
        else done();
    },
    CorsMiddleware: function(req, reply, done) {
        const { authorization, origin } = req.headers;
        
        if (origins.includes(origin)) {
            req.header('Access-Control-Allow-Methods', 'DELETE, POST, GET');
            req.header('Access-Control-Allow-Origin', origin);
            done();
        } else if (authorization) done();
        else return reply.code(403).send({ message: 'Connection is not secure', code: 403 });
    }
});
