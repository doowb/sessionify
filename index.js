/*!
 * sessionify <https://github.com/doowb/sessionify>
 *
 * Copyright (c) 2014-2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = sessionify;

/**
 * Bind a function, EventEmitter, or Stream to the provided session object
 * with an optional context.
 *
 * @param  {Function|EventEmitter|Stream} `fn` Object to bind to.
 * @param  {Object} `session` session-cache object to bind with.
 * @param  {Object} `context` Optional context to bind to the sesssion.
 * @return {*} Bound object
 * @api public
 */

function sessionify (fn, session, context) {
  if (!session) {
    throw new Error('sessionify expects a session-cache object as `session`');
  }

  var bind = session.bind;
  if (typeof fn === 'object' && fn.on) {
    bind = session.bindEmitter;
  }

  if (context) {
    bind.call(session, fn, context);
  } else {
    bind.call(session, fn);
  }
  return fn;
};
