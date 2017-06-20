var express = require('express')
  , mongoose = require('mongoose')
  , _ = require('underscore')
  , router = express.Router()
  , ThoughtRouter = require('../routes/thought')
  , GroupRouter = require('../routes/group')
  , Retrospective = require('../models/retrospective');

  /**
   * GET /api/retrospectives
   * Returns all retrospectives
   */
  router.get('/', function(req, res, next) {
    Retrospective
      .find()
      .limit(100)
      .exec(function(err, retrospectives) {
        if (err) return next(err);

        res.send(retrospectives);
      });
  });

  /**
   * POST /api/retrospectives
   * Adds new retrospective to the database.
   */
  router.post('/', function(req, res, next) {
    var title = req.body.title;
    var roomCode = req.body.roomCode;
    var sprintNumber = req.body.sprintNumber;
    var sprintTimer = req.body.sprintTimer;
    var isVotable = req.body.isVotable;
    var isTimeboxed = req.body.isTimeboxed;
    var displayThoughtPreference = req.body.displayThoughtPreference;
    var userId = req.body.userId;

    if (!title) {
      return res.status(400).send({ message: 'Retrospective requires a title.' });
    }

    /* Added validation for checking if created Retrospective roomCode was already existed. */
    Retrospective.findOne({ roomCode: roomCode }, function(err, retrospective) {
      if (err) return next(err);

      if (retrospective) {
        return res.status(404).send({ message: 'Retrospective with room code (' + roomCode + ') already exists.' });
      }

      var retrospective = new Retrospective({
        title: title,
        sprintNumber: sprintNumber,
        sprintTimer: sprintTimer,
        isVotable: isVotable,
        isTimeboxed: isTimeboxed,
        displayThoughtPreference: displayThoughtPreference,
        userId: userId,
        roomCode: roomCode
      });

      retrospective.save(function(err, retrospective) {
        if (err) return next(err);
        res.send({ retrospective: retrospective, message: retrospective.title + ' has been added successfully!' });
      });

    });

  });

  /**
   * PUT /api/retrospectives
   * Update values on retrospective.
   */
  router.put('/:roomCode', function(req, res, next) {
     var roomCode = req.params.roomCode;
     var params = req.body;

     Retrospective.findOneAndUpdate({roomCode: roomCode}, req.body, {}, function (err, retrospective) {
       if (err) return next(err);
       res.send({ message: retrospective.title + ' has been updated successfully!', retrospective: retrospective });

       // let shared Retrospective users know new Retrospective update
       // TODO: make this emit only to the retrospective socket, so only that will be notified
     });
   });

  /**
   * PUT /api/retrospectives/add_user/:username/:id
   * Add new user into specific retro.
   */
  router.put('/add_user/:username/:id', function(req, res, next) {
    var id = req.params.id;
    var username = req.params.username;

    console.log('username', username);
    console.log('req', req.body);

    Retrospective.findOneAndUpdate(
        { _id: id },
        { $addToSet: { joinedUsers: username } },
        { safe: true, upsert: true },
        function(err, retrospective) {
          if (err) return next(err);
          res.send({
            message: retrospective.title + ' has been updated successfully with the new joined user.',
            status: 'success',
            username: username
          });
        }
    );
  });


  /**
   * PUT /api/retrospectives/vote_finished/:username/:id
   * Add new user into specific retro.
   */
  router.put('/vote_finished/:userId/:roomCode', function(req, res, next) {
    var roomCode = req.params.roomCode;
    var userId = req.params.userId;
    var mode = req.body.mode;



    if (!roomCode) {
      return res.status(400).send({ message: 'Retrospective requires a roomCode.', status: 'error'});
    }

    /**
     * Voting Modes
    * Add - It triggers when the user have finished voting.
    * Remove - triggers when the user have not yet finished voting.
    **/
    if (mode == "add") {
        var users = {$addToSet: {usersFinishedVote: userId}};
        var msgFinishedVoting = ' finished voting.';
    } else {
        var users = {$pull: {usersFinishedVote: userId}};
        var msgFinishedVoting = ' have not yet finished voting.';
    }

    // Update vote counts for all users
    Retrospective.findOneAndUpdate(
        {roomCode: roomCode},
        users,
        {new: true},
        function (err, retrospective) {
            if (err) return next(err);
            res.send({
                message: userId + msgFinishedVoting,
                status: 'success',
                usersFinishedVote: retrospective.usersFinishedVote,
            });
        }
    );

  });

  /**
   * GET /api/retrospectives/count
   * Returns the total number of retrospectives.
   */
  router.get('/count', function(req, res, next) {
    Retrospective.count({}, function(err, count) {
      if (err) return next(err);

      res.send({ count: count });
    });
  });

  /**
   * GET /api/retrospectives/search_code/:roomCode
   * Looks up a retrospective by room code
   */
  router.get('/search_code/:roomCode', function(req, res, next) {

    var roomCode = req.params.roomCode;

    Retrospective.findOne({ roomCode: roomCode }, function(err, retrospective) {
      if (err) return next(err);

      if (!retrospective) {
        return res.status(404).send({ message: 'Retrospective with room code (' + roomCode + ') not found.' });
      }
      res.send(retrospective)

    });
  });

  /**
   * GET /api/retrospectives/recent
   * Return 100 most recent Retrospectives. Filter by isVotable and isTimeboxed.
   */

   // REVIEW: See if this will be used for v1.0.0 because it's not being used for v.0.5.0
  router.get('/recent', function(req, res, next) {
    var params = _.pick(req.query, ['isVotable', 'isTimeboxed']);
    var error = false;

    _.each(params, (value, key)=>{
      if(!(value === true || value === false || value === 'true' || value === 'false')){
        error = true;
      }
    });

    if(error){
      return res.status(400).send({ message: 'improper values was found.' });
    }

    Retrospective
      .find(params)
      .sort({created_at: 'descending'}) // Sort in most recent order
      .limit(100)
      .exec(function(err, retrospectives) {
        if (err) return next(err);

        res.send(retrospectives);
      });
  });

  /**
   * GET /api/retrospectives/:id
   * Returns a retrospective.
   */
  router.get('/:id', function(req, res, next) {
    var id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send({ message: 'Invalid id for Retrospective.' });
    }

    Retrospective.findOne({ _id: id }, function(err, retrospective) {
      if (err) return next(err);

      if (!retrospective) {
        return res.status(404).send({ message: 'Retrospective not found.' });
      }

      res.send(retrospective);
    });
  });

  /**
   * DELETE /api/retrospectives
   * Deletes retrospective.
   */
  router.delete('/:id', function(req, res, next) {

    var id = req.params.id;

    // REVIEW: had to change it to checking to see if the ID was valid it invalid, then set proper error message
    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send({ message: 'Invalid id for Retrospective.' });
    }

    Retrospective.findOneAndRemove({_id: id}, function (err, retrospective) {
      if (err) return next(err);
      res.send({ message: retrospective.title + ' has been deleted!' });
    });
  });

  router.use('/:id/thoughts', ThoughtRouter);
  router.use('/:id/groups', GroupRouter);

module.exports = router;
