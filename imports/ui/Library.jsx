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

        let showMore = !ownedOfSet ? 'printing-more' : '';

        return (
          <div className={'printing ' + showMore} title={set.toUpperCase()} key={this.props.name + '-' + set}>
            <i className={'ss ss-fw ss-' + set.toLowerCase()}></i>
            <span className="set-name">{ set }</span>
            <span className="count">{ ownedOfSet }&nbsp;</span>
            <button className="add" onClick={this.addOwned.bind(this, set)} title={set.toUpperCase()} k></button>
            <button className="subtract" onClick={this.subtractOwned.bind(this, set)} title={set.toUpperCase()} k></button>
          </div>
        );
      });

    }

    const total = owned ? owned.total : 0;
    let ownedStatus = 'owned-status-red';
    if (this.props.needed) {
      if (total >= this.props.needed) {
        ownedStatus = 'owned-status-green';
      } else if (total > 0 && total >= this.props.needed - 2) {
        ownedStatus = 'owned-status-orange';
      }
    }

    return(
      <div className="owned-cards">
        <div className={'printing printing-total ' + ownedStatus}>
          <span className="total">{ total }</span>
        </div>

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

