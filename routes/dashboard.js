/* Retrieve Router Handler */
const express = require('express');
const router = express.Router();
const https = require('https');
const EventEmitter = require('events');
const fs = require('fs');
const knex = require('../config/db/bookshelf').knex;

/* Debugger */
const debug = require('debug')('route-home');

module.exports = (app, passport) => {
    function authenticate(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/login')
    }

    /* Views */
    router.get('/', authenticate, function(req, res, next) {
        res.render('dashboard', {
            authenticated: req.isAuthenticated()
        });
    });


    /* API Endpoints */
    const Stream = new EventEmitter();
    app.get('/stream', function(req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        Stream.on("push", function(event, data) {
            res.write("event: " + String(event) + "\n" + "data: " + data + "\n\n");
        });
    });

    const instanceFile = '/tmp/instance.json';
    fs.watch(instanceFile, (event, filename) => {
        fs.readFile(instanceFile, {encoding: 'utf-8'}, function(err, contents) {
            if(!err) {
                Stream.emit("push", "update", JSON.stringify(JSON.parse(contents)));
            } else {
                Stream.emit("push", "close", err);
            }
        });
    });

    /* Register Router */
    app.use('/dashboard', router);
};
