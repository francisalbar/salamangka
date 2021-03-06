import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Decks = new Mongo.Collection('decks');

// Only publish decks that are public or belong to the current user
if (Meteor.isServer) {
  Meteor.publish('decks', function decksPublication() {
    return Decks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({

  'decks.insertFromMTGO'(newDeck) {
    check(newDeck, Object);

    // Make sure the user is logged in before inserting a deck
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Decks.insert(newDeck);
  },

  // [TODO] Insert deck from string
  'decks.insert'(text) {
    check(text, String);

    throw new Meteor.Error('not-implemented');
  },

  'decks.remove'(deckId) {
    check(deckId, String);

    const deck = Decks.findOne(deckId);
    if (/*deck.private && */deck.owner !== Meteor.userId()) {
      // If the deck is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Decks.remove(deckId);
  },

  'decks.setPrivate'(deckId, setToPrivate) {
    check(deckId, String);
    check(setToPrivate, Boolean);

    const deck = Decks.findOne(deckId);
    if (deck.private && deck.owner !== Meteor.userId()) {
      // If the deck is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    // Make sure only the deck owner can make a deck private
    if (deck.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Decks.update(deckId, { $set: { private: setToPrivate } });
  },

  'decks.setEventPrivate'(eventId, setToPrivate) {
    check(eventId, String);
    check(setToPrivate, Boolean);

    // const decks = Decks.find({eventId:eventId});
    // if (deck.private && deck.owner !== Meteor.userId()) {
    //   // If the deck is private, make sure only the owner can check it off
    //   throw new Meteor.Error('not-authorized');
    // }

    // // Make sure only the deck owner can make a deck private
    // if (deck.owner !== Meteor.userId()) {
    //   throw new Meteor.Error('not-authorized');
    // }

    Decks.update({eventId:eventId}, { $set: { private: setToPrivate } }, { multi: true });
  },

  'decks.removeEvent'(eventId) {
    check(eventId, String);

    // const decks = Decks.find({eventId:eventId});
    // if (deck.private && deck.owner !== Meteor.userId()) {
    //   // If the deck is private, make sure only the owner can check it off
    //   throw new Meteor.Error('not-authorized');
    // }

    // // Make sure only the deck owner can make a deck private
    // if (deck.owner !== Meteor.userId()) {
    //   throw new Meteor.Error('not-authorized');
    // }

    Decks.remove({eventId:eventId});
  },

});
