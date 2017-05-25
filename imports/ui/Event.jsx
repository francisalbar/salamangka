import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// Event component - represents a single todo item
export default class Event extends Component {

  displayEvent() {
    console.log('list this event')
  }

  deleteThisEvent() {
    Meteor.call('events.remove', this.props.event._id);
  }

  togglePrivate() {
    Meteor.call('events.setPrivate', this.props.event._id, ! this.props.event.private);
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
        <div className="item-actions">
          <button className="delete" onClick={this.deleteThisEvent.bind(this)}>
            &times;
          </button>

          { this.props.showPrivateButton ? (
            <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
              { this.props.event.private ? 'Private' : 'Public' }
            </button>
          ) : ''}

          <a href={this.props.event.source} target="_blank">src</a>

          <strong>{this.props.event.username}</strong>

        </div>

        <span>
          <span className="event-name">{this.props.event.eventName}</span>
          <span className="event-deck-count">({this.props.event.deckCount})</span>
        </span>

        <h2>Decks</h2>

        <ul>
        </ul>

      </div>
    );
  }
}

Event.propTypes = {
  // This component gets the event to display through a React prop.
  // We can use propTypes to indicate it is required
  event: PropTypes.object.isRequired,
  // showPrivateButton: React.PropTypes.bool.isRequired,
};

export class EventListing extends Event {

  selectThisEvent() {
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
        <div className="item-actions">
          <button className="delete" onClick={this.deleteThisEvent.bind(this)}>
            &times;
          </button>
        </div>

        <a href="#" onClick={this.selectThisEvent.bind(this)}>
          <span className="event-name">{this.props.event.eventName}</span>
          <span className="event-deck-count">({this.props.event.deckCount})</span>
        </a>
      </div>
    );
  }

}
