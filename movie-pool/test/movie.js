var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server');

var should = chai.should();

chai.use(chaiHttp);

var databaseFile = "./database.json";
var fs = require('fs');

describe('Movies', () => {
	beforeEach((done) => {
		//we need to set a default value for databaseFile
		var databaseData = {
			"TheShawshankRedemption":{
				movieName : "TheShawshankRedemption",
				year : 1994,
				actor : "Morgan Freeman",
				owner : "Ved"
			},
			"TheGodfather":{
				movieName : "TheGodfather",
				year : 1972,
				actor : "Al Pacino",
				owner : "Ved"
			},
			"TheDarkKnight":{
				movieName : "TheDarkKnight",
				year : 2008,
				actor : "Heath Ledger",
				owner : "Ved"
			},
			"TheFightClub":{
				movieName : "TheFightClub",
				year : 1999,
				actor : "Brad Pitt",
				owner : "Ved"
			}
		}

		fs.writeFileSync(databaseFile,JSON.stringify(databaseData));
		done();
	})

	describe('/GET movies', () => {
		it('it should GET all the movies', (done) => {
			chai.request(server)
				.get('/movies')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					done();
				})
		})
	})

	describe('/POST movies', () => {
		it('it should POST a movie', (done) => {
			var movie = {
				movieName:"Titanic",
				actor:"Leo"
			}
			chai.request(server)
				.post('/movies')
				.send(movie)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('success');
					res.body.should.have.property('success').eql(true);
					done();
				})
		});
		it('it should not POST a movie without a movieName', (done) => {
			var movie = {
				actor:"Robert Dowry Jr"
			}
			chai.request(server)
				.post('/movies')
				.send(movie)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				})
		})
	});

	describe('/GET movies/:movieName', () => {
		it('it should GET a movie by the given movieName', (done) => {
			chai.request(server)
				.get('/movies/TheDarkKnight')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('movie');
					/*
					movieName : "TheDarkKnight",
					year : 2008,
					actor : "Heath Ledger",
					owner : "Ved"
					*/
					res.body.movie.should.have.property('movieName');
					res.body.movie.should.have.property('movieName').eql('TheDarkKnight');
					res.body.movie.should.have.property('year');
					res.body.movie.should.have.property('year').eql(2008);
					res.body.movie.should.have.property('actor');
					res.body.movie.should.have.property('actor').eql('Heath Ledger');
					res.body.movie.should.have.property('owner');
					res.body.movie.should.have.property('owner').eql('Ved');
					done();
				})
		})
	});
	describe('/DELETE movies/:movieName', () => {
		it('it should DELETE a movie by the given movieName(TheGodfather)', (done) => {
			chai.request(server)
				.delete('/movies/TheGodfather')
				.end((err, res) => {
					res.should.have.status(200);
					var databaseData = JSON.parse(fs.readFileSync(databaseFile).toString());
					if(! databaseData.hasOwnProperty('TheGodfather')){
						done();
					}
				})
		})
	});
	describe('/PUT movies/:movieName', () => {
		it('it should PUT i.e. update a movie with the new details passed', (done) => {
			chai.request(server)
				.put('/movies/TheFightClub')
				.send({movieName : "TheFightClub",year : 1999,actor : "Brad Pitt",owner : "Manasvi"})
				.end((err, res) => {
					res.should.have.status(200);
					var databaseData = JSON.parse(fs.readFileSync(databaseFile).toString());
					if(databaseData["TheFightClub"].owner=="Manasvi"){
						done();
					}	
				})
		})
	})
})