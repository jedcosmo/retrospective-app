var mongoose = require('mongoose');

var thoughtSchema = new mongoose.Schema({
  text: {type: String, default: "Write a thought"},
  votes: Array,
  groups: Array,
  userId: { type: String, index: true },
  retrospectiveId: { type: String, index: true },
  categoryId: { type: String, index: true },
  isHidden: { type: Boolean, default: false },
},
{
    timestamps: true
});

var groupSchema = new mongoose.Schema({
  text: String,
  thoughts: [{ type: mongoose.Schema.ObjectId, ref: 'Thought', index: true }]
},
{
    timestamps: true
});

var retrospectiveSchema = new mongoose.Schema({
  roomCode: String,
  title: String,
  sprintNumber: { type: String, default: "" },
  sprintTimer: { type: Number, default: 3 },
  categories: {
    type: Array,
    "default": ["What went well?",
                "What didn't go well?",
                "What did we learn?",
                "What still puzzles us?"]
  },
  isVotable: { type: Boolean, default: false },
  isTimeboxed: { type: Boolean, default: false },
  displayThoughtPreference: { type: "String", default: "personal"},
  stage: { type: String, default: "setup" },
  //stage: { type: String, enum: ['setup','join','share','group','vote','archive'], default: "setup" },
  thoughts: [thoughtSchema],
  groups: [groupSchema],
  userId: {type: String, default: ""},
  joinedUsers: Array,
  usersFinishedVote: Array
},
{
    timestamps: true
});

module.exports = mongoose.model('Retrospective', retrospectiveSchema);
