'use strict';

var should = require('should');
var through = require('through2');
var EventEmitter = require('events').EventEmitter;
var session = require('session-cache')('sessionify-test');

var sessionify = require('./');

describe('sessionify', function () {
  describe('async functions', function () {
    it('should bind async functions', function (done) {
      var fn = function (next) {
        session.get('foo').should.eql('bar');
        next();
      };
      session.run(function () {
        session.set('foo', 'bar');
        fn = sessionify(fn, session);
        fn(done);
      });
    });
  });

  describe('event emitters', function () {
    it('should bind event emitters', function (done) {
      var App = function () {
        EventEmitter.call(this);
      };
      require('util').inherits(App, EventEmitter);
      var app = new App();
      app.once('test', function () {
        session.get('foo').should.eql('bar');
        done();
      });

      session.run(function () {
        session.set('foo', 'bar');
        app = sessionify(app, session);
        app.emit('test');
      });
    });
  });

  describe('streams', function () {
    it('should bind streams', function (done) {
      var stream = through.obj(function (data, enc, next) {
        session.get('foo').should.eql('bar');
        this.push(data);
        next();
      });
      stream.on('finish', done);
      stream.on('error', done);

      session.run(function () {
        session.set('foo', 'bar');
        stream = sessionify(stream, session);
        stream.write({});
        stream.end();
      });
    });
  });
});
