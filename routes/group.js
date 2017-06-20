var express = require('express')
  , mongoose = require('mongoose')
  , _ = require('underscore')
  , router = express.Router({mergeParams: true})
  , Retrospective = require('../models/retrospective');

/**
 * GET /api/retrospectives/:id/groups
 * Returns all groups for a retrospective
 */
 router.get('/', function(req, res, next) {
   Retrospective.findOne({'_id': req.params.id }, function(err, retrospective) {
     if (err)
       return done(err);
     if (retrospective) {
       res.send(retrospective.groups);
     }
   });
 });

/**
 * POST /api/retrospective/:id/groups
 * Adds new group to the retrospective.
 */
router.post('/', function(req, res, next) {
  var params = req.body;

  if (!params.text) {
    return res.status(400).send({ message: 'Group requires text...' });
  }

  Retrospective.findOne({'_id': req.params.id }, function(err, retrospective) {
    if (err)
      return done(err);
    if (retrospective) {
      retrospective.groups.push(params);

      retrospective.save(function(err, retrospective) {
        if (err) return next(err);
        res.send({ message: 'Group has been added successfully!' });
      });
    }
  });
});

/**
 * PUT /api/retrospective/:id/groups
 * Update values on group.
 */
router.put('/:groupid', function(req, res, next) {
  var id = req.params.groupid;
  var params = req.body;

  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send({ message: 'Invalid id for group.' });
  }

  Retrospective.findOne({'_id': req.params.id }, function(err, retrospective) {
    if (err)
      return done(err);
    if (retrospective) {
      var group = retrospective.groups.filter(function(e){ return e._id == id })[0]

      if (!group) {
        return res.status(404).send({ message: 'Group not found.' });
      }

      if (params.text)
        group.text = params.text;

      if (params.thoughtId) {
        var thoughtsArray = group.thoughts;

        if (params.action == "add" && !_.findWhere(thoughtsArray, params.thoughtId)) {
          thoughtsArray.push(params.thoughtId);
        } else if (params.action == "remove") {
          thoughtsArray = _.without(thoughtsArray, params.thoughtId);
        }

        group.thoughts = thoughtsArray;
      }

      retrospective.save(function(err, retrospective) {
        if (err) return next(err);
          res.send({ group: group, message: 'Group has been updated successfully!' });
      });
    }
  });
});

/**
 * GET /api/groups/count
 * Returns the total number of groups.
 */
router.get('/count', function(req, res, next) {
  Retrospective.findOne({'_id': req.params.id }, function(err, retrospective) {
    if (err)
      return done(err);
    if (retrospective) {
      res.send({ count: retrospective.groups.length });
    }
  });
});

/**
 * GET /api/retrospectives/:id/groups/:groupid
 * Returns a group.
 */
router.get('/:groupid', function(req, res, next) {
  var id = req.params.groupid;

  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send({ message: 'Invalid id for Group.' });
  }

  // alternative to querying a group
  // Retrospective.find({'groups.id':req.params.id}, function(err, group){
  //     // ---
  // });

  Retrospective.findOne({'_id': req.params.id }, function(err, retrospective) {
    if (err)
      return done(err);
    if (retrospective) {
      var group = retrospective.groups.filter(function(e){ return e._id == id })[0]

      if (!group) {
        return res.status(404).send({ message: 'Group not found.' });
      }

      res.send(group);
    }
  });
});

/**
 * DELETE /api/retrospectives/:id/groups/:groupid
 * Deletes group.
 */
router.delete('/:groupid', function(req, res, next) {
  var id = req.params.groupid;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Group requires a valid id.' });
  }

  Retrospective.findOne({'_id': req.params.id }, function(err, retrospective) {
    if (err)
      return done(err);
    if (retrospective) {
      var group = retrospective.groups.filter(function(e){ return e._id == id })[0]

      if (!group) {
        return res.status(404).send({ message: 'Group not found.' });
      }

      retrospective.groups.pull(id);

      retrospective.save(function (err) {
        if (err) return handleError(err);

        res.send({ message: 'Group ' + id + ' has been deleted!' });
      });
    }
  });
});

module.exports = router;
