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
      if (this.props.detail === 'manaCost') {
        if (!card[this.props.detail]) {
          return null;
        }

        const manaCost = card[this.props.detail].split('}{').map((cost, i) => {
          cost = cost.replace('}', '').replace('{', '').toLowerCase().split('/');
          let classNames = ['ms', 'ms-cost'];
          cost.map((single) => {
            classNames.push('ms-' + single);
          });
          let className = classNames.join(' ');
          return(
            <i className={className} key={card.name + i + className}></i>
          );
        });;

        return(
          <span className="mana-cost">
            {manaCost}
          </span>
        );
      }

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

