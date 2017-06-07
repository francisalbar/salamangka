import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Deck, { DeckListing } from './Deck.jsx';

// Event component
export default class Event extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDeck: null,
    };
  }

  displayEvent() {
    console.log('list this event')
  }

  deleteThisEvent() {
    Meteor.call('events.remove', this.props.event._id);
  }

  togglePrivate() {
    Meteor.call('events.setPrivate', this.props.event._id, ! this.props.event.private);
  }

  selectDeck(deckId) {
    this.setState({
      selectedDeck: deckId,
    });
  }

  renderSelectedDeck() {
    let deck = this.state.selectedDeck ?
      this.props.decks.filter(d => d._id === this.state.selectedDeck)[0] :
      this.props.decks[0];
    if (!deck) {
      return null;
    }

    return (
      <Deck
        deck={deck}
      />
    );
  }

  renderDecks() {
    if (!this.props.decks) {
      return null;
    }

    return this.props.decks.map((deck) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = deck.owner === currentUserId;

      return (
        <li key={deck._id}>
          <DeckListing
            deck={deck}
            showPrivateButton={showPrivateButton}
            onSelect={this.selectDeck.bind(this)}
          />
        </li>
      );
    });
  }

  render() {
    // Give events a different className when they are checked off,
    // so that we can style them nicely in CSS
    const eventClassName = classnames({
      checked: this.props.event.checked,
      private: this.props.event.private,
    });

    return (
      <div className="event">
        <span>
          <span className="event-name">{this.props.event.eventName}</span>
          <span className="event-deck-count">({this.props.event.deckCount})</span>
        </span>

        <span className="item-actions">
          <button className="delete" onClick={this.deleteThisEvent.bind(this)}>
            &times;
          </button>

          { this.props.showPrivateButton ? (
            <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
              { this.props.event.private ? 'Private' : 'Public' }
            </button>
          ) : ''}

          <a href={this.props.event.source} target="_blank">src</a>

          <span className="author">&nbsp;{this.props.event.username}</span>

        </span>


        { this.props.decks ? (
          <div className="event-decks">
            <h2>Decks</h2>

            <ul>
              { this.renderDecks() }
            </ul>

            {this.renderSelectedDeck()}
          </div>
        ) : ''}

      </div>
    );
  }
}

Event.propTypes = {
  event: PropTypes.object.isRequired,
};

export class EventListing extends Event {

  selectThisEvent(e) {
    e.preventDefault();

    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(this.props.event._id);
    }
  }

  render() {
    const eventClassName = classnames({
      selected: this.props.event.selected,
    });

    return (
      <div className="event-listing">
        <a href="#" onClick={this.selectThisEvent.bind(this)}>
          <span className="event-name">{this.props.event.eventName}</span>
          <span className="event-deck-count">&nbsp;({this.props.event.deckCount})</span>
        </a>

        <span className="item-actions">
          <button className="delete" onClick={this.deleteThisEvent.bind(this)}>
            &times;
          </button>
        </span>
      </div>
    );
  }

}
