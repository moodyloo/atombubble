'use babel';

import React from 'react';
import MainSection from './mainsection'
import Tree from './tree';

import {StyledMain} from './styled/main.styled.js';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originalarray: [],
    };

    this.addBubble = this.addBubble.bind(this);
    this.removeBubble = this.removeBubble.bind(this);
  }

  //add model and atom text editor to state array from view
  addBubble(originalmod) {
    let original = this.state.originalarray.slice();
    original.push(originalmod);
    this.setState({originalarray: original});
  }

  //remove bubble from board
  removeBubble(e,bubbleIndex) {
    e.preventDefault();
    if (e.button == 0) { //if left mosue click
      var neworiginal= this.state.originalarray.slice();
      neworiginal.splice(bubbleIndex,1);
      this.setState({originalarray: neworiginal});
    }
  }

  render() {
    return (
      <StyledMain>
        <MainSection removeBubble={this.removeBubble} originalarray={this.state.originalarray}/>
        <Tree/>
      </StyledMain>
    );
  }
}
