import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import '../imports/api/libraries.js';
import '../imports/api/cards.js';
import '../imports/api/decks.js';
import '../imports/api/events.js';

// const Cards = new Mongo.Collection('cards');

Meteor.startup(() => {
  // code to run on server at startup
  // console.log(Roles);
  // console.log('global-group', Roles.GLOBAL_GROUP);
  // console.log('getAllRoles', Roles.getAllRoles());
  // console.log('getGroupsForUser', Roles.getGroupsForUser('sgcqk4LSQGKehcxwA'));



  // Roles.addUsersToRoles('sgcqk4LSQGKehcxwA', 'super-admin', Roles.GLOBAL_GROUP);

  // console.log(1);
  // Cards._ensureIndex({ name: 1 }, { unique: true });
  // let AllCardsJSON = JSON.parse(Assets.getText('data/AllCards-x.json'));
  // console.log(2);
  // let x = 0;
  // _.find(AllCardsJSON, (card, name) => {
  //   try {
  //     console.log(name, Cards.insert(card));
  //   } catch (e) {
  //     x++;// console.log(name, 'already found')
  //   }
  //   // return name === 'Armageddon';
  // });
  // console.log('Already found: ' + x);
  // console.log(4);
});
