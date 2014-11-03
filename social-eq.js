if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: [
      { text: "This is task 1" },
      { text: "This is task 2" },
      { text: "This is task 3" }
    ]
  });
}

Questions = new Mongo.Collection("questions");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    questions: function () {
      return Questions.find({});
    }
  });
}