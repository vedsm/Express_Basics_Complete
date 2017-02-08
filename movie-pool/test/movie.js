var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server');

var should = chai.should();

chai.use(chaiHttp);

describe('Movies', () => {
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
	})
})