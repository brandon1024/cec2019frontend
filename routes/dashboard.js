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
    app.get('/stream', authenticate, function(req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        Stream.on("push", function(event, data) {
            res.write("event: " + String(event) + "\n" + "data: " + data + "\n\n");
        });
    });

    app.post('/update', function(req, res) {
        Stream.emit("push", "update", JSON.stringify(req.body));
        res.send(req.body);
    });

    app.post('/close', function(req, res) {
        Stream.emit("push", "close");
    });

    /* Register Router */
    app.use('/dashboard', router);
};
