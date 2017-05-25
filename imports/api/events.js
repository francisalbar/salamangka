import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import req from 'request';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';
import moment from 'moment';

export const Events = new Mongo.Collection('events');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish decks that are public or belong to the current user
  Meteor.publish('events', function eventsPublication() {
    return Events.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({

  'events.loadMTGOEvent'(url) {
    check(url, String);

    if (Meteor.isServer) {

  		req(url, Meteor.bindEnvironment(function (err, res) {
  		  if (err) return callback(err);

  		  let $ = cheerio.load(iconv.decode(res.body, 'latin-1'));

  		  let eventDate = moment($('.posted-in').text().split('on').pop().trim(), 'MMMM D, YYYY');
  		  let eventName = $('h1').text().trim() + ' ' + eventDate.format('YYYY-MM-DD');
  		  //console.log('on', moment($('.posted-in').text().split('on').pop().trim()));
  		  //console.log('H1', eventName);

  		  let deckLists = $('#content-detail-page-of-an-article .decklists').children();

        let newEvent = {
          createdAt: new Date(),
          owner: Meteor.userId(),
          username: Meteor.user().username,
          source: url,
          eventName: eventName,
          eventDate: eventDate.format('YYYY-MM-DD'),
          deckCount: deckLists.length,
        };

        let eventId = Events.insert(newEvent);

  		  deckLists.each((i, deckItem) => {

          let meta = $(deckItem).find('.deck-meta h4').text().trim();
    			let newDeck = {
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
    			  source: url,
    			  eventName: eventName,
            eventDate: eventDate.format('YYYY-MM-DD'),
    			  eventId: eventId,
    			  player: /^([\w\-]+)/.exec( meta )[0],
    			  result: /(\(.*\))/.exec( meta )[0].replace( /[\(\)]/g,''),
    			  cards: [],
    			  sideboard: [],
    			};

  		  	// console.log(deckItem);
  		  	// console.log('deck: ' + $(deckItem).find('.deck-meta h4').text().trim());
  		  	let mainDeck = $(deckItem).find('.sorted-by-overview-container .row');
  		  	mainDeck.each((j, cardItem) => {
  		  	  let count = $(cardItem).find('.card-count').text().trim();
  		  	  let name = $(cardItem).find('.card-name').text().trim();
  		  	  newDeck.cards.push({
  		  	  	count: count,
  		  	  	name: name,
  		  	  });
  		  	});

  		  	let sideboard = $(deckItem).find('.sorted-by-sideboard-container .row');
  		  	sideboard.each((j, cardItem) => {
  		  	  let count = $(cardItem).find('.card-count').text().trim();
  		  	  let name = $(cardItem).find('.card-name').text().trim();
  		  	  newDeck.sideboard.push({
  		  	  	count: count,
  		  	  	name: name,
  		  	  });
  		  	});

          //console.log(newDeck.cards.length);

    			if (newDeck.cards.length > 0) {
            //console.log('got here?');
            Meteor.call('decks.insertFromMTGO', newDeck);
    			}

  		  });
  		}, function () { console.log('Failed to bind environment'); }));

    }
  },

  'events.insert'(text) {
    check(text, String);

    // Make sure the user is logged in before inserting a event
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Events.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },

  'events.remove'(eventId) {
    check(eventId, String);

    const event = Events.findOne(eventId);
    if (/*event.private && */event.owner !== Meteor.userId()) {
      // If the event is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Events.remove(eventId);
    Meteor.call('decks.removeEvent', eventId);
  },

  'events.setPrivate'(eventId, setToPrivate) {
    check(eventId, String);
    check(setToPrivate, Boolean);

    const event = Events.findOne(eventId);
    if (event.private && event.owner !== Meteor.userId()) {
      // If the event is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    // Make sure only the event owner can make a event private
    if (event.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Events.update(eventId, { $set: { private: setToPrivate } });
    Meteor.call('decks.setEventPrivate', eventId, setToPrivate);
  },

});