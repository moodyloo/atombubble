'use babel';
var $ = require('jquery');

import React from 'react';
import { render } from 'react-dom';

import Main from './components/main';

export default class AtomBubbleView {
  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('codebubble');

    /**
    // Create message element
    const message = document.createElement('div');
    message.classList.add('message');
    this.element.appendChild(message);
    **/
    render(<Main />,this.element);
    /**
    this.subscriptions = atom.workspace.getCenter().observeActivePaneItem((item) => {
      if (!atom.workspace.isTextEditor(item)) return;
      const ejs = require('ejs');
      const html = ejs.render(
        ` <% if(filename){ %>
            <h2><%=filename%></h2>
          <% } else { %>
            <h2>untitled</h2>
          <% } %>
          <ul>
            <li><b>Soft Wrap:</b> <%=softwrapped %></li>
            <li><b>Tab Length:</b> <%=tablength %></li>
            <li><b>Encoding:</b> <%=encoding %></li>
            <li><b>Line Count:</b> <%=linecount %></li>
          </ul>
        `, {
          filename: item.getFileName(),
          softwrapped: item.softWrapped,
          tablength: item.getTabLength(),
          encoding: item.getEncoding(),
          linecount: item.getLineCount()
        }
      );

      message.innerHTML = html
    });
    **/
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
  serialize() {
    return {
      deserializer: 'atombubble/AtomBubbleView'
    };
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
