//SQL related info: first table called todo's

const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const Sequelize = require('sequelize');

const server = express();

server.engine('mustache', mustache ());
server.set('views', './views');
server.set('view engine', 'mustache');
//now we can access req.body from forms with bodyparser
server.use(bodyparser.urlencoded({extended: true }));

//**********LIST SCHEMA**************//

const db = new Sequelize('todolistsql', 'savannahlowder', '', {//savannahlowder comes from "role name"...get into db by saying psql puppycare and \du
	dialect: 'postgres',//npm install pg
});
//run create db "todolistsql" in terminal

const List = db.define('list', {
	title: Sequelize.STRING,
	completed: Sequelize.BOOLEAN
});

//Synchronize the 'list' schema with the db, meaning make sure all table exist and have right fields
List.sync().then(function () {
	console.log('list model syncd');
//***comment List.create out after you run it bc it will keep adding if you dont**//
	// List.create({
	// 	title: 'Clean apartment',
	// 	completed: true,
	// });
	// List.create({
	// 	title: 'Wash car',
	// 	completed: false,
	// });
	// List.create({
	// 	title: 'Yoga class',
	// 	completed: false,
	// });
	// List.create({
	// 	title: 'Cook dinner',
	// 	completed: false,
	// });
});
//***********END LIST SCHEMA**********//

server.get('/', function (req, res) {
	//get all dogs and render them on page
	List.findAll({ //you could do just "find" or "findOne" or "findAll" here to list all dogs on homepage
		// where: { //this is really powerful(there are lots of things you can do here)
		// 	checked_in: true //this will list only checked in dogs on home page
		// }
}).then(function (done) {
	res.render('list', {
		// stuff: [], //todo: get info from db
		//**comment stuff: [] out after you do list.create above and use stuff:done like below instead
		stuff: done,
		});
	});
});

//**********Task 1: add a new todo to the db via a form***********
server.get('/add', function(req, res) {
	res.render('add');
});

server.post('/check', function(req, res) {
	// console.log(req.body);
	List.create({
		title: req.body.title,
		// breed: req.body.breed,
		// weight: parseInt(req.body.weight),//parseInt bc weight comes back as a string even though we said input type number on add.mustache
		completed: false,
	}).then(function () {
		//wait until insert is finished then redirect
		res.redirect('/');
	});
});

//*****Task 2: toggle their completed status******

server.post('/complete/:stuff_id', function (req, res) {
	const id = req.params.stuff_id;

	//update(what-to-update, which-to-update)
	List.update({
		completed: true
	}, {
		where: {
			id: id,
		},
	}).then(function() {
		res.redirect('/');
	});
});

server.post('/notcomplete/:stuff_id', function (req, res) {
	const id = req.params.stuff_id;

	//update(what-to-update, which-to-update)
	List.update({
		completed: false
	}, {
		where: {
			id: id,
		},
	}).then(function() {
		res.redirect('/');
	});
});

server.listen(5000);
console.log("yeet");
