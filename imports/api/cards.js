import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Cards = new Mongo.Collection('cards');

if (Meteor.isServer) {
  Meteor.publish('cards', function cardsPublication(name) {
    check(name, String);

    return Cards.find({ name: name });
  });
}

Meteor.methods({


});
