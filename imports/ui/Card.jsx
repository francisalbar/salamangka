import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import classnames from 'classnames';

import { Cards } from '../api/cards.js';

// Card component - represents a single card item
class Card extends Component {

  render() {

    // console.log('DERP', this.props.filteredCard);
    console.log('DORP', this.props.card);
    const card = this.props.card;
    if (!card) {
      return false;
    }

    return(
      <div className="card">
        { card.manaCost } |
        { card._id }
      </div>
    );
  }
}

Card.propTypes = {
  card: PropTypes.object,
  name: PropTypes.string.isRequired,
};

export default createContainer((props) => {
  Meteor.subscribe('cards');

  return {
    card: Cards.findOne({ name: props.name }),
  };
}, Card);

export class CardManaCost extends Card {
  render () {
    return (
      <div className="card-mana-cost">
        { this.props.card.manaCost }
      </div>
    );
  }
}
