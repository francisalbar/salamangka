import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Decks } from '../api/decks.js';
import { Events } from '../api/events.js';

import Deck from './Deck.jsx';
import Event from './Event.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {
  loadMTGOEvent(event) {
    event.preventDefault();

    const url = ReactDOM.findDOMNode(this.refs.mtgoURLInput).value.trim();

    Meteor.call('events.loadMTGOEvent', url);
  }

  renderEvents() {
    let filteredEvents = this.props.events;
    return filteredEvents.map((event) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = event.owner === currentUserId;

      return (
        <Event
          key={event._id}
          event={event}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }

  renderDecks() {
    let filteredDecks = this.props.decks;
    // if (this.state.hideCompleted) {
    //   filteredDecks = filteredDecks.filter(deck => !deck.checked);
    // }
    return filteredDecks.map((deck) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = deck.owner === currentUserId;

      return (
        <Deck
          key={deck._id}
          deck={deck}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Decks</h1>

          <AccountsUIWrapper />

          { this.props.currentUser ?
            <form className="load-mtgo-event" onSubmit={this.loadMTGOEvent.bind(this)} >
              <input
                type="text"
                ref="mtgoURLInput"
                placeholder="Type to add new MTGO event url"
              />
            </form> : ''
          }
        </header>

        <h2>Events</h2>
        <ul>
          {this.renderEvents()}
        </ul>

        <h2>Decks</h2>
        <ul>
          {this.renderDecks()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  decks: PropTypes.array.isRequired,
  events: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('decks');
  Meteor.subscribe('events');

  return {
    events: Events.find({}, { sort: { createdAt: -1 } }).fetch(),
    decks: Decks.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
  };
}, App);