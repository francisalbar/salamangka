import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Decks } from '../api/decks.js';
import { Events } from '../api/events.js';

import Deck from './Deck.jsx';
import Event, { EventListing } from './Event.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedEvent: null,
    };
  }

  loadMTGOEvent(ev) {
    ev.preventDefault();

    const url = ReactDOM.findDOMNode(this.refs.mtgoURLInput).value.trim();

    Meteor.call('events.loadMTGOEvent', url);
  }

  selectEvent(eventId) {
    this.setState({
      selectedEvent: eventId,
    });
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


  renderEventList() {
    let filteredEvents = this.props.events;
    return filteredEvents.map((event) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = event.owner === currentUserId;

      return (
        <li key={event._id}>
          <EventListing
            event={event}
            onSelect={this.selectEvent.bind(this)}
          />
        </li>
      );
    });
  }


  renderSelectedEvent() {
    let event = this.state.selectedEvent ?
      this.props.events.filter(e => e._id === this.state.selectedEvent)[0] :
      this.props.events[0];
    if (!event) {
      return null;
    }

    const currentUserId = this.props.currentUser && this.props.currentUser._id;
    const showPrivateButton = event.owner === currentUserId;

    return (
      <Event
        key={event._id}
        event={event}
        showPrivateButton={showPrivateButton}
        decks={this.props.decks.filter(deck => deck.eventId === event._id)}
      />
    );
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Decks</h1>

          <nav className="utility">
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
          </nav>
        </header>

        <h2>Events</h2>
        <ul>
          {this.renderEventList()}
        </ul>

        <hr />

        {this.renderSelectedEvent()}

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
