import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import Card, { CardManaCost } from './Card.jsx';

// Deck component - represents a single todo item
export default class Deck extends Component {

  deleteThisDeck() {
    Meteor.call('decks.remove', this.props.deck._id);
  }

  togglePrivate() {
    Meteor.call('decks.setPrivate', this.props.deck._id, ! this.props.deck.private);
  }

  renderCards(listType, cards) {
    return cards.map((card) => {
      // const cardInfo = Cards.findOne({ name: card.name });
      return (
        <li key={this.props.deck._id + listType + card.name}>
          { card.name } ({ card.count })
          <Card
            name={card.name}
          />
        </li>
      );
    });
  }

  renderMainDeck() {
    return this.renderCards('main-deck', this.props.deck.cards);
  }

  renderSideboard() {
    return this.renderCards('sideboard', this.props.deck.sideboard);
  }

  render() {
    // Give decks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const deckClassName = classnames({
      checked: this.props.deck.checked,
      private: this.props.deck.private,
    });

    return (
      <div className="deck">
        {/*
        <button className="delete" onClick={this.deleteThisDeck.bind(this)}>
          &times;
        </button>
        */}

        { this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            { this.props.deck.private ? 'Private' : 'Public' }
          </button>
        ) : ''}

        <span className="text">{this.props.deck.player} ({this.props.deck.result})</span>
        {/*<span className="author">&nbsp;{this.props.deck.username}</span>*/}

        <ul className="main-deck">
          {this.renderMainDeck()}
        </ul>

        <ul className="sideboard">
          {this.renderSideboard()}
        </ul>
      </div>
    );
  }
}

Deck.propTypes = {
  // This component gets the deck to display through a React prop.
  // We can use propTypes to indicate it is required
  deck: PropTypes.object.isRequired,
  // showPrivateButton: React.PropTypes.bool.isRequired,
};

export class DeckListing extends Deck {

  selectThisDeck(e) {
    e.preventDefault();

    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(this.props.deck._id);
    }

    return false;
  }

  render () {
    return (
      <div className="deck-listing">
        <a href="#" onClick={this.selectThisDeck.bind(this)}>
          <span className="text">{this.props.deck.player} ({this.props.deck.result})</span>
        </a>
      </div>
    );
  }
}
