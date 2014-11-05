Questions = new Mongo.Collection("questions");

if (Meteor.isClient) {
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
    "click .delete": function(){
      Meteor.call("deleteQuestion", this._id);

    },
    // handle hideCompleted event
    "change .hide-completed input": function(event){
      Session.set("hideCompleted", event.target.checked);
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
    Questions.remove(questionId);
  },
  setChecked: function (questionId, setChecked) {
    Questions.update(questionId, { $set: { checked: setChecked} });
  }
});