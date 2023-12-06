'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Main file responsible for starting the Server
 * @type {require('fastify').FastifyInstance} Instance of Fastify
 * @contributors emptydev1, ghostzinn07 (EGM Player Team.)
 * @see https://github.com/egmplayer/egmplayer-api
 */
const { EGMPlayerDatabase } = require('./structures/Database');
const { resolve } = require('node:path');
const fastify = require('fastify')({ logger: false });
const db = new EGMPlayerDatabase();

// Plugins
fastify.register(require('@fastify/static'), { root: resolve('dist/public') });
fastify.register(require('@fastify/url-data'));
fastify.register(require('@fastify/sensible'));
fastify.register(require('@fastify/formbody'), {
    extended: true,
    multipart: true,
    formidable: { maxFileSize: 100 * 1024 * 1024 }
});

// Setup
fastify.addHook('onRequest', function(req, reply) {
    if (req.method !== 'POST' || typeof req.body === 'object') return;
    
    try { JSON.parse(req.body); } catch {
        return reply.code(400).send({
            message: 'Invalid body',
            code: 400
        });
    }
});
require('dotenv').config();
require('./handler')(fastify, db);
[ 'unhandledRejection', 'uncaughtException' ]
    .forEach((event) =>
        process.on(event, (e) => console.error(`[${event}] Detected an error: ${e.stack || e}`))
    );
fastify.setNotFoundHandler(function(req, reply) {
    return reply.code(404).send({
        message: `Cannot ${req.method} ${req.url}`,
        code: 404
    });
});

// Initializing server
fastify.listen({ port: process.env._port, host: '0.0.0.0' }, function(err, address) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    
    console.info(`[Logs] Server is listening on address ${address}.`);
});
