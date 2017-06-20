var express = require('express')
  , mongoose = require('mongoose')
  , _ = require('underscore')
  , router = express.Router({mergeParams: true})
  , Retrospective = require('../models/retrospective');

/**
 * GET /api/retrospective/:roomCode/thoughts
 * Returns all thoughts for a retrospective
 */
router.get('/', function(req, res, next) {
  Retrospective.findOne({'roomCode': req.params.id }, function(err, retrospective) {
    if (err)
      return done(err);
    if (retrospective) {
      res.send(retrospective.thoughts);
    }
  });
});

/**
 * POST /api/retrospective/:id/thoughts
 * Adds new thought to the retrospective.
 */
router.post('/', function(req, res, next) {
  var params = req.body;
  var thoughtContent = params.text;
  var thoughtretrospectiveId = params.retrospectiveId;
  var thoughtuserId = params.userId;
  var thoughtcategoryId = params.categoryId;

  if (!params.text) {
    return res.status(400).send({ message: 'Thought requires a thought...' });
  }

  Retrospective.findOne({'roomCode': req.params.id }, function(err, retrospective) {
    if (err)
      return done(err);
    if (retrospective) {
      retrospective.thoughts.push({text: thoughtContent,
          retrospectiveId : thoughtretrospectiveId,
          userId : thoughtuserId,
          categoryId : thoughtcategoryId
      });

      retrospective.save(function(err, retrospective) {
        if (err) return next(err);
        var thought = retrospective.thoughts.filter(function(e){ return e.userId == thoughtuserId })
        res.send(thought);
      });
    }
  });
});

/**
 * PUT /api/retrospective/:id/thoughts
 * Update values on thought.
 */
router.put('/:thoughtId', function(req, res, next) {
  var id = req.params.thoughtId;
  var params = req.body;

  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send({ message: 'Invalid id for Thought.' });
  }

  Retrospective.findOne({'roomCode': req.params.id }, function(err, retrospective) {
    if (err)
      return done(err);
    if (retrospective) {
      var thought = retrospective.thoughts.filter(function(e){ return e._id == id })[0]

      if (!thought) {
        return res.status(404).send({ message: 'Thought not found.' });
      }

      if (params.text)
        thought.text = params.text;

      if (params.userId)
        thought.userId = params.userId;

      if (params.retrospectiveId)
        thought.retrospectiveId = params.retrospectiveId;

      if (params.categoryId)
        thought.categoryId = params.categoryId;

      if (params.isHidden)
          thought.isHidden = params.isHidden;

      if (params.voteUserId) {
        var votesArray = thought.votes;

        let voteUserSearch = _.indexOf(votesArray, params.voteUserId);
        if(voteUserSearch >= 0) {
          votesArray = _.without(votesArray, params.voteUserId);
        }
        else {
          votesArray.push(params.voteUserId);
        }

        thought.votes = votesArray;
      }

      if (params.togroup) {
        var groupsArray = thought.groups;
        var toGroupArray = JSON.parse(params.togroup);
        groupsArray.push(toGroupArray);
        thought.groups = groupsArray;
      }

      if (params.unGroup) {
        var group = thought.groups.filter(function(e){ return e.id != params.unGroupId });
        thought.groups = group;
        //thought.groups.pull(params.unGroupId);
      }

      retrospective.save(function(err, retrospective) {
        if (err) return next(err);
        res.send({ thought: thought, retrospective: retrospective, message: 'Thought has been updated successfully!' });
        //  res.send(retrospective.thought);
      });
    }
  });
});

/**
 * GET /api/thoughts/count
 * Returns the total number of thoughts.
 */
router.get('/count', function(req, res, next) {
  Retrospective.findOne({'roomCode': req.params.id }, function(err, retrospective) {
    if (err)
      return done(err);
    if (retrospective) {
      res.send({ count: retrospective.thoughts.length });
    }
  });
});

/**
 * GET /api/retrospectives/:id/thoughts/:userId
 * Returns a thought.
 */
router.get('/:userId', function(req, res, next) {
  var id = req.params.userId;

  /*if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send({ message: 'Invalid id for Thought.' });
  }*/

  // alternative to querying a thought
  // Retrospective.find({'thoughts.id':req.params.id}, function(err, thought){
  //     // ---
  // });

  Retrospective.findOne({'roomCode': req.params.id }, function(err, retrospective) {
    if (err)
      return done(err);
    if (retrospective) {

      var thought = retrospective.thoughts.filter(function(e){ return e.userId == id })

      if (!thought) {

        return res.status(404).send({ message: 'Thought not found.' });
      }

      res.send(thought);
    }
  });
});

/**
 * DELETE /api/retrospectives/:id/thoughts/:thoughtid
 * Deletes thought.
 */
router.delete('/:thoughtId', function(req, res, next) {
  var id = req.params.thoughtId;

  if (!id) {
    return res.status(400).send({ message: 'Thought requires an id.' });
  }

  Retrospective.findOne({'roomCode': req.params.id }, function(err, retrospective) {
    if (err)
      return done(err);
    if (retrospective) {
      var thought = retrospective.thoughts.filter(function(e){ return e._id == id })[0]

      if (!thought) {
        return res.status(404).send({ message: 'Thought not found.' });
      }

      retrospective.thoughts.pull(id);

      retrospective.save(function(err, retrospective) {
        if (err) return next(err);
        res.send(retrospective);
      });

    }
  });
});

module.exports = router;
