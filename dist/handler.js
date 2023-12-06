'use strict';

const { readdirSync } = require('node:fs');
const path = require('node:path');

/**
 * Handler responsible for load routes of the API
 * @param {FastifyInstance} fastify  Encapsulated fastify instance
 * @param {Database} db  The database instance
 */
module.exports = function(fastify, db) {
    const folder = path.resolve('dist', 'routes');
    
    readdirSync(folder)
        .map((subfolder) => path.join(folder, subfolder))
        .forEach((subfolder) => {
            for (const file of readdirSync(subfolder)
                .filter((file) => path.extname(file) == '.js')
                .map((file) => path.join(subfolder, file))) {
                try {
                    const route = require(file);
                    
                    if (typeof route !== 'function') continue;
                    
                    route(fastify, db);
                    console.info(`[Logs] Successfully loaded route: ${path.basename(file, '.js')}`);
                } catch(e) {
                    console.error(`[Logs] [${file}] Detected an error:\n${e.stack || e}`);
                }
            }
        });
};
