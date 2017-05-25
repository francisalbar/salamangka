import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// Deck component - represents a single todo item
export default class Deck extends Component {

  deleteThisDeck() {
    Meteor.call('decks.remove', this.props.deck._id);
  }

  togglePrivate() {
    Meteor.call('decks.setPrivate', this.props.deck._id, ! this.props.deck.private);
  }

  render() {
    // Give decks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const deckClassName = classnames({
      checked: this.props.deck.checked,
      private: this.props.deck.private,
    });

    return (
      <li>
        <button className="delete" onClick={this.deleteThisDeck.bind(this)}>
          &times;
        </button>

        { this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            { this.props.deck.private ? 'Private' : 'Public' }
          </button>
        ) : ''}

      	<span className="text">{this.props.deck.player} ({this.props.deck.result})</span> <strong>{this.props.deck.username}</strong>
      </li>
    );
  }
}

Deck.propTypes = {
  // This component gets the deck to display through a React prop.
  // We can use propTypes to indicate it is required
  deck: PropTypes.object.isRequired,
  showPrivateButton: React.PropTypes.bool.isRequired,
};