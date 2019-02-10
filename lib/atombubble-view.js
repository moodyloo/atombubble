'use babel';
var $ = require('jquery');

import React from 'react';
import { render } from 'react-dom';

import Main from './components/main';

export default class AtomBubbleView {
  constructor(serializedState) {
    this.data = serializedState;
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('codebubble');

    render(<Main ref={(main) => {window.bubbleMain = main}}/>,this.element);
  }

  getTitle() {
    // Used by Atom for tab text
    return 'Atom Bubble';
  }

  getDefaultLocation() {
    // This location will be used if the user hasn't overridden it by dragging the item elsewhere.
    // Valid values are "left", "right", "bottom", and "center" (the default).
    return 'center';
  }

  getAllowedLocations() {
    // The locations into which the item can be moved.
    return ['left', 'right', 'bottom','center'];
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return 'atom://atombubble'
  }

  // Returns an object that can be retrieved when package is activated
  /**
  serialize() {
    return {
      deserializer: 'atombubble/AtomBubbleView'
    };
  }
*/

  //add text editor to a new bubble to the Board
  addBubble(originalmodel) {
    window.bubbleMain.addBubble(originalmodel);
  }


  // Tear down any state and detach
  destroy() {
    this.element.remove();
    this.subscriptions.dispose();
  }

  getElement() {
    return this.element;
  }
}
