import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// Event component - represents a single todo item
export default class Event extends Component {

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
      <li>
        <button className="delete" onClick={this.deleteThisEvent.bind(this)}>
          &times;
        </button>

        { this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            { this.props.event.private ? 'Private' : 'Public' }
          </button>
        ) : ''}

      	<span className="text">{this.props.event.eventName} ({this.props.event.deckCount})</span> <strong>{this.props.event.username}</strong>
      </li>
    );
  }
}

Event.propTypes = {
  // This component gets the event to display through a React prop.
  // We can use propTypes to indicate it is required
  event: PropTypes.object.isRequired,
  showPrivateButton: React.PropTypes.bool.isRequired,
};