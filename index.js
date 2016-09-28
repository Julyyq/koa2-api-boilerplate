
/**
 * Module dependencies.
 */

const responseTime = require('koa-response-time');
const ratelimit = require('koa-ratelimit');
const compress = require('koa-compress');
const logger = require('koa-logger');
const router = require('koa-router');
const load = require('./lib/load');
const redis = require('redis');
const Koa = require('koa');

/**
 * Environment.
 */

const env = process.env.NODE_ENV || 'development';

/**
 * Expose `api()`.
 */

module.exports = api;

/**
 * Initialize an app with the given `opts`.
 *
 * @param {Object} opts
 * @return {Application}
 * @api public
 */

function api(opts) {
  opts = opts || {};
  const app = new Koa();

  // logging

  if ('test' != env) app.use(logger());

  // x-response-time

  app.use(responseTime());

  // compression

  app.use(compress());

  // rate limiting

  app.use(ratelimit({
    max: opts.ratelimit,
    duration: opts.duration,
    db: redis.createClient()
  }));

  // routing

  app.use(router(app));

  // boot

  load(app, __dirname + '/api');

  return app;
}
