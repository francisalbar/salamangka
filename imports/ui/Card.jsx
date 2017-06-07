import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { Cards } from '../api/cards.js';

// Card component
class Card extends Component {

  render() {
    const card = this.props.card;
    if (!card) {
      return false;
    }

    if (this.props.detail) {
      const detail = card[this.props.detail] || '';
      return(
        <span>{ detail }</span>
      );
    }

    return(
      <div className="card">
        { card.text }
      </div>
    );
  }
}

Card.propTypes = {
  card: PropTypes.object,
  name: PropTypes.string.isRequired,
  detail: PropTypes.string,
};

export default createContainer((props) => {
  Meteor.subscribe('cards', props.name);

  return {
    card: Cards.findOne({ name: props.name }),
  };
}, Card);

