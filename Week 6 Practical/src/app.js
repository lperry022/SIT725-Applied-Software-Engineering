require('dotenv').config();
const path = require('path');
const express = require('express');

const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static + views
app.use(express.static(path.join(__dirname, '..', 'public')));
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

// routes
const challengeRoutes = require('../routes/challenges');
app.use('/', challengeRoutes);

module.exports = app;
