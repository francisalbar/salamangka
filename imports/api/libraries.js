import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Libraries = new Mongo.Collection('libraries');

if (Meteor.isServer) {
  Meteor.publish('libraries', function librariesPublication() {
    return Libraries.find({
      owner: this.userId,
    });
  });
}

Meteor.methods({

  'libraries.insert'(name, set, count) {
    check(name, String);
    check(set, String);
    check(count, Number);

    if (!Meteor.user()) {
      throw new Meteor.Error('not-authorized');
    }

    let card = {
      name: name,
      owner: Meteor.userId(),
    };
    // card.sets[set] = count;

    let exists = Libraries.findOne(card);
    if (!exists) {
      card.sets = {};
      card.sets[set] = count;
      card.total = count;
      Libraries.insert(card);
    } else {
      exists.sets[set] = count;
      let total = 0;
      for( var i in exists.sets ) {
        total = total + exists.sets[i];
      }
      if (total === 0) {
        Libraries.remove(exists._id);
      } else {
        Libraries.update(
          {_id: exists._id},
          {$set: { total: total, sets: exists.sets }}
        );
      }
    }

    // throw new Meteor.Error('not-implemented');
  },



});
