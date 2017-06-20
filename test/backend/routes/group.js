var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
var server = require('../../../server.js');
var async = require('async');
var Retrospective = require('../../../models/retrospective.js');
var _ = require('underscore');

const request = require('supertest');

chai.should();


beforeEach(function(callback){
    Retrospective.remove({}, callback);
});

describe('GET /api/retrospectives/:id/groups', function(){

  it('should return groups for a retrospective', function(done){

    var retrospective = new Retrospective({
      title: 'Retro App',
      roomCode: 'r975c3',
      sprintNumber: '2',
      sprintTimer: 3,
      isVotable: true,
      isTimeboxed: false,
      displayThoughtPreference: 'personal',
      stage: 'initial',
      userId: '',
      groups: [
        {
          text: 'some text',
          thoughts: []
        }
      ]
    });

    retrospective.save(function(err, res){

          var id = res.id;

          request(server)
          .get(`/api/retrospectives/${id}/groups`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, function(err, res){
            res.body.should.be.an('array');
            _.each(res.body, (group) => {
              group.text.should.be.a('string');
              group.should.have.property('text', 'some text');
            });

          done(err);
        });
      });
  });
});

describe('POST /api/retrospective/:id/groups', function() {

  it('should return an error message "Group requires text..." when there is no text with the group', function(done){

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

    retrospective.save(function(err, res){

      var id = res.id;

      var groups = {
        text: null,
        thoughts: []
      };

      request(server)
      .post(`/api/retrospectives/${id}/groups`)
      .set('Accept', 'application/json/')
      .send(groups)
      .expect('Content-Type', /json/)
      .expect(400, function(err, res) {
        res.body.message.should.be.equal('Group requires text...');
        done(err);
      });

    });

  });

  it('should add new group to the retrospective.', function(done){

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

    retrospective.save(function(err, res){
      var id = res.id;

      var groups = {
        text: 'some text',
        thoughts: []
      };

      request(server)
      .post(`/api/retrospectives/${id}/groups`)
      .set('Accept', 'application/json')
      .send(groups)
      .expect('Content-Type', /json/)
      .expect(200, function(err, res){
        res.body.message.should.be.equal('Group has been added successfully!');
        done(err);
      });
    });
  });
});

describe('PUT /api/retrospective/:id/groups', function(){

  it('should return error message "Invalid id for group." when trying to update group value with an invalid id', function(done){

    var retrospective = new Retrospective({
      title: 'Retro App',
      roomCode: 'r975c3',
      sprintNumber: '2',
      sprintTimer: 3,
      isVotable: true,
      isTimeboxed: false,
      displayThoughtPreference: 'personal',
      stage: 'initial',
      userId: '',
      groups: [
        {
          text: 'some text',
          thoughts: []
        }
      ]
    });

    retrospective.save(function(err, res){

      var id = res.id;
      var groupId = null;

      var groups = {
        text: 'new text'
      };

      request(server)
      .put(`/api/retrospectives/${id}/groups/${groupId}`)
      .set('Accept', 'application/json')
      .send(groups)
      .expect('Content-Type', /json/)
      .expect(404, function(err, res){
        res.body.message.should.be.equal('Invalid id for group.');
        done(err);
      });
    });
  });

  it('should return error message "Group not found.", when group is not found', function(done){

    var retrospective = new Retrospective({
      title: 'Retro App',
      roomCode: 'r975c3',
      sprintNumber: '2',
      sprintTimer: 3,
      isVotable: true,
      isTimeboxed: false,
      displayThoughtPreference: 'personal',
      stage: 'initial',
      userId: '',
      groups: [
        {
          text: 'some text',
          thoughts: []
        }
      ]
    });

    retrospective.save(function(err, res){

      var id = res.id;
      var groupId = '59239c0cd11f78000a9cd803';

      var groups = {
        text: 'some new text',
        thoughts: []
      };

      request(server)
      .put(`/api/retrospectives/${id}/groups/${groupId}`)
      .set('Accept', 'application/json')
      .send(groups)
      .expect('Content-Type', /json/)
      .expect(404, function(err, res){
        res.body.message.should.be.equal('Group not found.');
        done(err);
      });
    });
  });

  it('should return update value to group and provide message "Group has been updated successfully!"', function(done){

    var retrospective = new Retrospective({
      title: 'Retro App',
      roomCode: 'r975c3',
      sprintNumber: '2',
      sprintTimer: 3,
      isVotable: true,
      isTimeboxed: false,
      displayThoughtPreference: 'personal',
      stage: 'initial',
      userId: '',
      groups: [
        {
          text: 'some text',
          thoughts: []
        }
      ]
    });

    retrospective.save(function(err, res){
      var id = res.id;
      var groupId = res.groups[0]._id;

      var groups = {
        text: 'new text',
        thoughts: []
      };

      request(server)
      .put(`/api/retrospectives/${id}/groups/${groupId}`)
      .set('Accept', 'application/json')
      .send(groups)
      .expect('Content-Type', /json/)
      .expect(200, function(err, res){
        res.body.message.should.be.equal('Group has been updated successfully!');
        done(err);
      });
    });
  });
});

describe('GET /api/groups/count', function(){

  it('should return the total number of groups', function(done){

    var retrospective = new Retrospective({
          roomCode: 'r3se89',
          title: 'MEP App',
          sprintNumber: '2',
          sprintTimer: 4,
          isVotable: true,
          isTimeboxed: false,
          userId: '',
          groups: [
            {
              text: 'here is a thought',
              thoughts: []
            },
            {
              text: 'another thought',
              thoughts: []
            }
          ]
    });

    retrospective.save(function(err, res){
      var id = res.id;
      var groups = res.groups.length;

      request(server)
      .get(`/api/retrospectives/${id}/groups/count`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function(err, res){
        res.body.count.should.be.equal(groups);
        done(err);
      });
    });

  });
});

describe('GET /api/retrospectives/:id/groups/:groupid', function(){

  it('should return a group within the retrospective.', function(done){

    var retrospective = new Retrospective({
      roomCode: 't3w6f90',
      groups: [
        {
          text: 'here is some text',
          thougths: []
        },
        {
          text: 'new text',
          thoughts: []
        }
      ]
    });

    retrospective.save(function(err, res){

      var id = res.id;
      var groupId = res.groups[0].id;

      request(server)
      .get(`/api/retrospectives/${id}/groups/${groupId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function(err, res){
        res.body.text.should.be.equal('here is some text');
        res.body.text.should.be.a('string');
        res.body.should.have.property('_id', groupId);
        done(err);
      })
    });

  });

  it('should return a error message "Invalid id for Group" when a invalid id is passed', function(done){

    var retrospective = new Retrospective({
      roomCode: 'd2t4e90',
      groups: [
        {
          text: 'more text',
          thoughts: []
        },
        {
          text: 'another text',
          thoughts: []
        }
      ]
    });

    retrospective.save(function(err, res){

      var id = res.id;
      var groupId = null;

      request(server)
      .get(`/api/retrospectives/${id}/groups/${groupId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, function(err, res){
        res.body.message.should.be.equal('Invalid id for Group.');
        done(err);
      });
    });

  });

  it('should return a error message "Group not found." when the id does not match', function(done){

    var retrospective = new Retrospective({
      roomCode: 'w34fs59',
      groups: [
        {
          text: 'more thoughts',
          thoughts: []
        },
        {
          text: 'Can I code?',
          thoughts: []
        }
      ]
    });

    retrospective.save(function(err, res){

      var id = res.id;
      var groupId = '372673783833';

      request(server)
      .get(`/api/retrospectives/${id}/groups/${groupId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, function(err, res){
        res.body.message.should.be.equal('Group not found.');
        done(err);
      });

    });

  });

});

describe('DELETE /api/retrospectives/:id/groups/:groupid', function(){

  it('should return a error message "Group requires a valid id." if a invalid id is passed', function(done){

    var retrospective = new Retrospective({
      roomCode: 'e45ts30',
      groups: [
        {
          text: 'some text here',
          thought: []
        },
        {
          text: 'another text',
          thoughts: []
        }
      ]
    });

    retrospective.save(function(err, res){

      var id = res.id;
      var groupdId = null;

      request(server)
      .delete(`/api/retrospectives/${id}/groups/${groupdId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, function(err, res){
        res.body.message.should.be.equal('Group requires a valid id.');
        done(err);
      });
    });

  });

  it('should return a error message "Group not found." if a invalid id is passed', function(done){

    var retrospective = new Retrospective({
      roomCode: 'e45ts30',
      groups: [
        {
          text: 'some text here',
          thought: []
        },
        {
          text: 'another text',
          thoughts: []
        }
      ]
    });

    retrospective.save(function(err, res){

      var id = res.id;
      var groupdId = '303498928312';

      request(server)
      .delete(`/api/retrospectives/${id}/groups/${groupdId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, function(err, res){
        res.body.message.should.be.equal('Group not found.');
        done(err);
      });
    });

  });

  it('should delete a group and provide messgae stating it has been deleted', function(done){

    var retrospective = new Retrospective({
      roomCode: 'e45ts30',
      groups: [
        {
          text: 'some text here',
          thought: []
        },
        {
          text: 'another text',
          thoughts: []
        }
      ]
    });

    retrospective.save(function(err, res){

      var id = res.id;
      var groupdId = res.groups[0].id;

      request(server)
      .delete(`/api/retrospectives/${id}/groups/${groupdId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function(err, res){
        res.body.message.should.be.equal('Group ' + groupdId + ' has been deleted!');
        done(err);
      });
    });

  });

});
