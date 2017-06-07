import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Cards = new Mongo.Collection('cards');

if (Meteor.isServer) {
  Meteor.publish('cards', function cardsPublication() {
    return Cards.find({});
  });
}

Meteor.methods({


});
