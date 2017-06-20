var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
var server = require('../../../server.js');
var async = require('async');
var Retrospective = require('../../../models/retrospective.js');
var _ = require('underscore');

const request = require('supertest');

chai.should();

// beforeEach whipe out the database (runs for each test)
// before runs only once at the start of the suite.
// beforeEach runs the function before each spec
beforeEach(function(callback){

	// Clears the DB before each test is ran
    Retrospective.remove({}, callback);

});


// Test suite for the endpoint /api/retrospectives
describe('GET /api/retrospectives', function(){

  it('should return back a retrospective', function(done){

  	var retrospective = new Retrospective({
      title: 'testing',
      sprintNumber: '',
      sprintTimer: '4',
      isVotable: false,
      isTimeboxed: false,
      displayThoughtPreference: 'personal',
      userId: '',
      roomCode: 'f975e30'
    });

    retrospective.save(function(err,retrospective){

    	if(err) return done(err);

    	 request(server)
	      .get('/api/retrospectives/')
	      .set('Accept', 'application/json')
	      .expect('Content-Type', /json/)
	      .expect(200, function(err, res){
          _.each(res.body, (retrospective) => {
            // console.log('retrospective', retrospective);
            retrospective.should.have.property('_id', retrospective._id);
  	       	retrospective.should.have.property('title', retrospective.title);
  	       	retrospective.title.should.be.a('string');
  	       	retrospective.should.have.property('sprintNumber', retrospective.sprintNumber);
  	       	retrospective.should.have.property('sprintTimer', retrospective.sprintTimer);
  	       	retrospective.should.have.property('isVotable', retrospective.isVotable);
  	       	retrospective.should.have.property('isTimeboxed', retrospective.isTimeboxed);
  	       	retrospective.should.have.property('displayThoughtPreference', retrospective.displayThoughtPreference);
  	       	retrospective.should.have.property('userId', retrospective.userId);
  	       	retrospective.should.have.property('roomCode', retrospective.roomCode);
  	       	retrospective.roomCode.should.be.a('string');
          });
	        done(err);

	      });
    });

  });

});

// Test suite for the endpoint POST /api/retrospectives
describe('POST /api/retrospectives', function(){

	it('should make a new retrospective', function(done){

		var retrospective = {
			title: 'Testing',
			roomCode: 'f975e3',
			sprintNumber: '',
			sprintTimer: 3,
			isVotable: true,
			isTimeboxed: false,
			displayThoughtPreference: 'personal',
			stage: 'setup',
			userId: '1243252'
		};


	    request(server)
    		.post('/api/retrospectives/')
    		.send(retrospective)
    		.set('Accept', 'application/json')
    		.expect('Content-Type', /json/)
      		.expect(200, function(err, res){
      			res.body.retrospective.should.have.property('title', retrospective.title);
      			res.body.retrospective.title.should.be.a('string');
      			res.body.retrospective.should.have.property('roomCode', retrospective.roomCode);
      			res.body.retrospective.roomCode.should.be.a('string');
      			res.body.retrospective.should.have.property('sprintNumber', retrospective.sprintNumber);
      			res.body.retrospective.sprintNumber.should.be.a('string');
      			res.body.retrospective.should.have.property('sprintTimer', retrospective.sprintTimer);
      			res.body.retrospective.sprintTimer.should.be.a('number');
      			res.body.retrospective.should.have.property('isVotable', retrospective.isVotable);
      			res.body.retrospective.isVotable.should.be.a('boolean');
      			res.body.retrospective.should.have.property('isTimeboxed', retrospective.isTimeboxed);
      			res.body.retrospective.isTimeboxed.should.be.a('boolean');
      			res.body.retrospective.should.have.property('displayThoughtPreference', retrospective.displayThoughtPreference);
      			res.body.retrospective.displayThoughtPreference.should.be.a('string');
      			res.body.retrospective.should.have.property('stage', retrospective.stage);
      			res.body.retrospective.stage.should.be.a('string');
      			res.body.retrospective.should.have.property('userId', retrospective.userId);
      			res.body.retrospective.userId.should.be.a('string');
		        done(err);
      		});

	});

	it('should return a 400 error with the message "Retrospective requires a title." when missing title', function(done){

		var retrospective = {
			title: ''
		};

		request(server)
			.post('/api/retrospectives/')
			.set('Accept', 'application/json')
			.send(retrospective)
			.expect('Content-Type', /json/)
	  		.expect(400, function(err, res){
	  			res.body.message.should.equal('Retrospective requires a title.');
		        done(err);
	  		});


	});
});

// Test suite for the endpoint PUT /api/retrospectives/:id
describe('PUT /api/retrospectives/:roomCode', function(){

	it('should update values on the retrospective with the matching :roomCode', function(done){

    async.series([

      function(callback) {

        var retrospective = new Retrospective({
          title: 'MEP App',
          roomCode: 'f975e3',
          sprintNumber: '5',
          sprintTimer: 1,
          isVotable: false,
          isTimeboxed: true,
          displayThoughtPreference: 'personal',
          stage: 'initial',
          userId: ''
        });

        retrospective.save(callback);
      },
      function(callback) {

        var retrospective = new Retrospective({
          title: 'Retro App',
          roomCode: 'r975c3',
          sprintNumber: '2',
          sprintTimer: 3,
          isVotable: true,
          isTimeboxed: false,
          displayThoughtPreference: 'personal',
          stage: 'initial',
          userId: ''
        });

        retrospective.save(callback);
      },
      function(callback) {

        var roomCode = 'r975c3';
        var title = 'Retro App';

        var retrospective = {
          sprintTimer: 1
        };

        request(server)
        .put(`/api/retrospectives/${roomCode}`)
        .send(retrospective)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function(err, res){
            res.body.message.should.be.equal(title + ' has been updated successfully!');
            callback(err);
        });

      }
    ], function(err, results) {

        var roomCode = 'r975c3';
        var title = 'Retro App';

        request(server)
        .get(`/api/retrospectives/search_code/${roomCode}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function(err, res){
          res.body.should.have.property('sprintTimer', 1);
          res.body.should.have.property('title', 'Retro App');
          done(err);
        });

    });

  });
});

describe('PUT /api/retrospectives/add_user/:id', function(){

	it('should add a new user into a selected retro matched by using the retro id', function(done){

		var retrospective = {
			title: 'Testing',
			roomCode: 'f975e3',
			sprintNumber: '',
			sprintTimer: '3',
			isVotable: true,
			isTimeboxed: false,
			displayThoughtPreference: 'personal',
			stage: 'initial',
			userId: '1243252'
		};

		async.waterfall([

			function(callback){

				request(server)
					.post('/api/retrospectives/')
					.set('Accept', 'application/json')
					.send(retrospective)
					.expect('Content-Type', /json/)
					.expect(200, function(err, res){
						callback(err, res);
					});
			},
			function(res, callback){

        var username = 'Caesar Bell';

        var id = res.body.retrospective._id;
        var title = res.body.retrospective.title;

        // console.log('id', id);
        // console.log('title', title);

				request(server)
					.put(`/api/retrospectives/add_user/${id}?username=${username}`)
					.set('Accept', 'application/json')
					.send(retrospective)
					.expect('Content-Type', /json/)
					.expect(200, function(err, res){
            //console.log('body', res.body);
						res.body.message.should.equal(title + ' has been updated successfully with the new joined user.');
						res.body.status.should.equal('success');
						res.body.username.should.equal(username);
						callback(err);
					});
			}

		], done);
	});
});

describe('GET /api/retrospectives/count', function(){

	it('should return the total number of retrospectives', function(done){

		async.series([
			function(callback){

				var retrospective = new Retrospective({
			      title: 'Retro App',
			      sprintNumber: '',
			      sprintTimer: '4',
			      isVotable: false,
			      isTimeboxed: false,
			      displayThoughtPreference: 'personal',
			      userId: '',
			      roomCode: 'f975e3'
			    });

			    retrospective.save(callback);
			},
			function(callback){

				var retrospective = new Retrospective({
			      title: 'Launch Pad',
			      sprintNumber: '',
			      sprintTimer: '3',
			      isVotable: false,
			      isTimeboxed: false,
			      displayThoughtPreference: 'personal',
			      userId: '',
			      roomCode: 'f975e3'
			    });

			    retrospective.save(callback);
			},
			function(callback){

				var retrospective = new Retrospective({
			      title: 'PAT',
			      sprintNumber: '',
			      sprintTimer: '6',
			      isVotable: true,
			      isTimeboxed: false,
			      displayThoughtPreference: 'personal',
			      userId: '',
			      roomCode: 'f975e3'
			    });

			    retrospective.save(callback);
			}
		], function(err, results){

			var total = results.length;

			request(server)
				.get('/api/retrospectives/count')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, function(err, res){
					res.body.should.have.property('count', total);
					done(err);
				});
		});
	});

});

describe('GET /api/retrospectives/search_code/:roomCode', function(){

	it('should look up a retrospective by room code', function(done){

		async.series([

			function(callback){

				var retrospective = new Retrospective({
					    title: 'PAT',
		      		sprintNumber: '4',
			      	sprintTimer: '6',
			      	isVotable: false,
			      	isTimeboxed: true,
			      	displayThoughtPreference: 'personal',
			      	userId: '',
			      	roomCode: 'g075e3'
				});

				retrospective.save(callback);
			},
			function(callback){

				var retrospective = new Retrospective({
					title: 'Launch Pad',
		      		sprintNumber: '1',
			      	sprintTimer: '3',
			      	isVotable: true,
			      	isTimeboxed: false,
			      	displayThoughtPreference: 'personal',
			      	userId: '',
			      	roomCode: 't975e3'
				});

				retrospective.save(callback);

			},
			function(callback){

				var retrospective = new Retrospective({
					    title: 'Retro App',
		      		sprintNumber: '4',
			      	sprintTimer: '8',
			      	isVotable: false,
			      	isTimeboxed: false,
			      	displayThoughtPreference: 'personal',
			      	userId: '',
			      	roomCode: 'f975e3'
				});

				retrospective.save(callback);
			}
		], function(err, results){

			var roomCode = 'f975e3';

			request(server)
				.get(`/api/retrospectives/search_code/${roomCode}`)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, function(err, res){
					res.body.should.have.property('title', 'Retro App');
					res.body.should.have.property('roomCode', roomCode);
					done(err);
				});

		});


	});

	it('should give a 404 error with the message "Retrospective with room code ( + roomCode + ) not found." when room code does not match.', function(done){

		async.series([

			function(callback){

				var retrospective = new Retrospective({
					    title: 'PAT',
		      		sprintNumber: '4',
			      	sprintTimer: '8',
			      	isVotable: true,
			      	isTimeboxed: false,
			      	displayThoughtPreference: 'personal',
			      	userId: '',
			      	roomCode: 't975e3'
				});

				retrospective.save(callback);

			},
			function(callback){

				var retrospective = new Retrospective({
					    title: 'Retro App',
		      		sprintNumber: '2',
			      	sprintTimer: '3',
			      	isVotable: false,
			      	isTimeboxed: false,
			      	displayThoughtPreference: 'personal',
			      	userId: '',
			      	roomCode: 'f975e3'
				});

				retrospective.save(callback);
			}

		], function(err, results){

			var roomCode = 'b975e3';

			request(server)
				.get(`/api/retrospectives/search_code/${roomCode}`)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(404, function(err, res){
					res.body.message.should.equal('Retrospective with room code (' + roomCode + ') not found.');
					done(err);
				});

		});
	});
});

describe('GET /api/retrospectives/recent', function() {
  it('should return 100 most recent Retrospectives. Filter by isVotable, isTimeboxed, and isArchived.', function(done) {

    async.series([

      function(callback) {

        var retrospective = new Retrospective({
          title: 'Retro App',
          sprintNumber: '4',
          sprintTimer: '8',
          isVotable: false,
          isTimeboxed: false,
          isArchived: true,
          displayThoughtPreference: 'personal',
          userId: '',
          roomCode: 'f975e3'
        });

        retrospective.save(callback);
      },
      function(callback) {

        var retrospective = new Retrospective({
          title: 'LaunchPad',
          sprintNumber: '1',
          sprintTimer: '3',
          isVotable: true,
          isTimeboxed: true,
          isArchived: false,
          displayThoughtPreference: 'personal',
          userId: '',
          roomCode: 'y675e3'
        })

        retrospective.save(callback);
      },
      function(callback) {

        var retrospective =  new Retrospective({
          title: 'MEP App',
          sprintNumber: '7',
          sprintTimer: '1',
          isVotable: true,
          isTimeboxed: false,
          isArchived: true,
          displayThoughtPreference: 'personal',
          userId: '',
          roomCode: 'f925s0'
        });

        retrospective.save(callback);
      },
      function(callback) {

        var retrospective = new Retrospective({
          title: 'PAT App',
          sprintNumber: '5',
          sprintTimer: '9',
          isVotable: false,
          isTimeboxed: false,
          isArchived: false,
          displayThoughtPreference: 'personal',
          userId: '',
          roomCode: 'w910e3'
        });

        retrospective.save(callback);
      }
    ], function(err, results){

        var isVotable = true;
        var isTimeboxed = false;
        var isArchived = false;


      request(server)
				.get(`/api/retrospectives/recent?isVotable=${isVotable}&isTimeboxed=${isTimeboxed}`)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, function(err, res){
          _.each(res.body, (value, index) =>{
            res.body[index].should.have.property('isTimeboxed', false);
            res.body[index].should.have.property('isVotable', true);
          })
					done(err);
				});

    });
  })

  it('should return an error message "improper values was found."" when values for isVotable, isTimeboxed & isArchived are incorrect from what is set in the shcema', function(done){

    async.series([
        function(callback){

          var retrospective = new Retrospective({
            title: 'PAT App',
            sprintNumber: '4',
            sprintTimer: '6',
            isVotable: false,
            isTimeboxed: true,
            isArchived: false,
            displayThoughtPreference: 'personal',
            userId: '',
            roomCode: 'g075e3'
          });

          retrospective.save(callback);
        },
        function(callback){

          var retrospective = new Retrospective({
            title: 'MEP app',
            sprintNumber: '4',
            sprintTimer: '6',
            isVotable: true,
            isTimeboxed: true,
            isArchived: true,
            displayThoughtPreference: 'personal',
            userId: '',
            roomCode: 't075e3'
          });

          retrospective.save(callback);
        },
        function(callback){

          var retrospective = new Retrospective({
            title: 'Retro app',
            sprintNumber: '1',
            sprintTimer: '7',
            isVotable: false,
            isTimeboxed: false,
            isArchived: false,
            displayThoughtPreference: 'personal',
            userId: '',
            roomCode: 'g075e3'
          });

          retrospective.save(callback);
        }
    ], function(err, results){

        var isVotable = 'incorrect-value';
        var isTimeboxed = 'another-incorrect-value';

        request(server)
        .get(`/api/retrospectives/recent?isVotable==${isVotable}&isTimeboxed=${isTimeboxed}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, function(err, res){
          res.body.message.should.equal('improper values was found.');
          done(err)
        });
    });
  })
});

describe('GET /api/retrospectives/:id', function() {

  it('should return a error message "Retrospective not found." if retrospective is not found', function(done) {

    var retrospective = new Retrospective({
      title: 'Retro App',
      sprintNumber: '4',
      sprintTimer: '8',
      isVotable: false,
      isTimeboxed: false,
      isArchived: true,
      displayThoughtPreference: 'personal',
      userId: '',
      roomCode: 'f975e3'
    });

    retrospective.save(function(err, res){

      var id = '592d98f0563023000a4f6a6c';

      console.log('id', id);

      request(server)
      .get(`/api/retrospectives/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, function(err, res){
        console.log('res body', res.body);
        res.body.message.should.be.equal('Retrospective not found.');
        done(err);
      });

    });


  })

  it('should return a error message "Invalid id for Retrospective" if invalid id is passed', function(done) {

    var retrospective = new Retrospective({
      title: 'Retro App',
      sprintNumber: '4',
      sprintTimer: '8',
      isVotable: false,
      isTimeboxed: false,
      isArchived: true,
      displayThoughtPreference: 'personal',
      userId: '',
      roomCode: 'f975e3'
    });

    retrospective.save(function(err, res){

      var id = 1234;

      request(server)
      .get(`/api/retrospectives/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, function(err, res) {
        res.body.message.should.be.equal('Invalid id for Retrospective.');
        done(err);
      });
    });
  });

  it('should return a retrospective based on the id', function(done) {

    var retrospective = new Retrospective({
      title: 'Retro App',
      sprintNumber: '4',
      sprintTimer: '8',
      isVotable: false,
      isTimeboxed: false,
      isArchived: true,
      displayThoughtPreference: 'personal',
      userId: '',
      roomCode: 'f975e3'
    });

    retrospective.save(function(err, res){

      var id = res.id;
      var title = res.title;
      var roomCode = res.roomCode;

      request(server)
      .get(`/api/retrospectives/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function(err, res){
        res.body.should.have.property('_id', id);
        res.body.should.have.property('title', title);
        res.body.should.have.property('roomCode', roomCode);
        done(err);
      });
    });

  });
});

describe('DELETE /api/retrospectives', function() {

  it('should delete a retrospective and provides a success message of "Retrospective has been deleted!"', function(done) {

    var retrospective = new Retrospective({
      title: 'Retro App',
      sprintNumber: '4',
      sprintTimer: '8',
      isVotable: false,
      isTimeboxed: false,
      isArchived: true,
      displayThoughtPreference: 'personal',
      userId: '',
      roomCode: 'f975e3'
    });

    retrospective.save(function(err, res){

      var id = res.id;
      var title = res.title;

      request(server)
      .delete(`/api/retrospectives/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function(err, res){
        res.body.message.should.be.equal(title + ' has been deleted!');
        done(err);
      });
    });

  });

  it('should return and error message "Invalid id for Retrospective." when no idea is passed in', function(done){

    var retrospective = new Retrospective({
      title: 'Retro App',
      sprintNumber: '4',
      sprintTimer: '8',
      isVotable: false,
      isTimeboxed: false,
      isArchived: true,
      displayThoughtPreference: 'personal',
      userId: '',
      roomCode: 'f975e3'
    });

    retrospective.save(function(err, res){
      var id = null;

      request(server)
      .delete(`/api/retrospectives/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, function(err, res){
        res.body.message.should.be.equal('Invalid id for Retrospective.')
        done(err);
      });
    });

  });
});
