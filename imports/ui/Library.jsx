import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { Libraries } from '../api/libraries.js';
import { Cards } from '../api/cards.js';

// Library component
class Library extends Component {

  addOwned(set) {
    const owned = this.props.owned;
    let current = 0;
    if (owned && owned.sets[set]) {
      current = owned.sets[set];
    }

    Meteor.call('libraries.insert', this.props.name, set, current + 1);
  }

  subtractOwned(set) {
    const owned = this.props.owned;
    let current = 0;
    if (owned && owned.sets[set]) {
      current = owned.sets[set];
    }

    if (current === 0) {
      return;
    }

    Meteor.call('libraries.insert', this.props.name, set, current - 1);
  }

  render() {
    const owned = this.props.owned;
    const card = this.props.card;

    let printings = [];
    if (card) {
      printings = card.printings.map((set, i) => {

        let ownedOfSet = 0;
        if (owned && owned.sets[set]) {
          ownedOfSet = owned.sets[set];
        }

        return (
          <div className="printing" key={this.props.name + '-' + set}>
            <i className={'ss ss-' + set.toLowerCase()}></i>
            <span>&nbsp;{ set }: { ownedOfSet }&nbsp;</span>
            <button onClick={this.addOwned.bind(this, set)}>+</button>
            <button onClick={this.subtractOwned.bind(this, set)}>-</button>
          </div>
        );
      });

    }

    return(
      <div className="owned-cards">
        { owned ? owned.total : 0 }

        { printings }
      </div>
    );
  }
}

Library.propTypes = {
  owned: PropTypes.object,
  card: PropTypes.object,
  name: PropTypes.string.isRequired,
};

export default createContainer((props) => {
  Meteor.subscribe('libraries');
  Meteor.subscribe('cards', props.name);

  return {
    card: Cards.findOne({ name: props.name }),
    owned: Libraries.findOne({ name: props.name }),
  };
}, Library);

