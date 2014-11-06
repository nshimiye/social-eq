Questions = new Mongo.Collection("questions");

if (Meteor.isClient) {
  Meteor.subscribe("questions");
  // This code only runs on the client
  Template.body.helpers({
    questions: function () {

      if(Session.get("hideCompleted")){ //filter out used questions
        return Questions.find({ checked: {$ne: true}}, {sort: {createdAt: -1}});

      } else {
        return Questions.find({}, {sort: {createdAt: -1}});

      }

    },
    incompleteCount: function(){
      return Questions.find({checked: {$ne: true}}).count();
    },
    hideCompleted: function(){
      return Session.get("hideCompleted");
    }
  });

  Template.body.events({
    //this function is called when the new task form is submitted
    "submit .new-question": function(event){

      var question = event.target.question.value;

      Meteor.call("addQuestion", question);
      //clear form here
      event.target.question.value = "";

      //prevent default form submit
      return false;
    },

    "click .toggle-checked": function(){
      //set the checked property to the opposite of its current value
      Meteor.call("setChecked", this._id, ! this.checked);

    },
    "click .toggle-private": function(){
      //set the checked property to the opposite of its current value
      Meteor.call("setPrivate", this._id, ! this.private);

    },
    "click .delete": function(){
      Meteor.call("deleteQuestion", this._id);

    },
    // handle hideCompleted event
    "change .hide-completed input": function(event){
      Session.set("hideCompleted", event.target.checked);
    }

  });


Template.questionTPL.helpers({
  isOwner: function(){
    return this.owner === Meteor.userId();
  }
});


}

// Accounts.ui.config({
//   passwordSignupFields: "USERNAME_ONLY"
// });

Meteor.methods({
  addQuestion: function (question) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Questions.insert({
      question: question,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteQuestion: function (questionId) {
    var question = Questions.findOne(questionId);
    // only task owner can make this private
    if (question.private && question.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Questions.remove(questionId);
  },
  setChecked: function (questionId, setChecked) {
    var question = Questions.findOne(questionId);
    // only task owner can make this private
    if (question.private && question.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Questions.update(questionId, { $set: { checked: setChecked} });
  },
  setPrivate: function (questionId, setPrivate) {

    var question = Questions.findOne(questionId);
    // only task owner can make this private
    if (question.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Questions.update(questionId, { $set: { private: setPrivate} });
  }
});


if (Meteor.isServer) {
  Meteor.publish("questions", function () {
    return Questions.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });
};