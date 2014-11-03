Questions = new Mongo.Collection("questions");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    questions: function () {
      return Questions.find({});
    }
  });
}


Meteor.methods({
  addQuestion: function (question) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.insert({
      question: question,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteQuestion: function (questionId) {
    Questions.remove(questionId);
  },
  setChecked: function (questionId, setChecked) {
    Questions.update(questionId, { $set: { checked: setChecked} });
  }
});