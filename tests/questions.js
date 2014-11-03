//testing for questions collection existence
var assert = require('assert');

suite('Posts', function() {

    // making sure the tests run
  test('tests can be run', function() {
    assert.equal((1).toString(), "1",'one is equal to one');
  });

  test('in the server', function(done, server) {
    server.eval(function() {
      Questions.insert({question: 'do I smell bad when I go out with my friends ? ', createdAt: new Date() });
      var quests = Questions.find().fetch();
      emit('questions fetched', quests);
    });

    server.once('questions', function(questions) {
      assert.equal(questions.length, 1);
      done();
    });
  });
});
