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
      colour: [],
      markerarray: [],
      mainSectionWidth: "80%",
      treeWidth: "20%",
      treeVisible: true,
    };

    this.addBubble = this.addBubble.bind(this);
    this.removeBubble = this.removeBubble.bind(this);
    this.hsv_to_rgb = this.hsv_to_rgb.bind(this);
    this.generateRandomColour = this.generateRandomColour.bind(this);
    this.toggleTree = this.toggleTree.bind(this);
  }

  hsv_to_rgb(h, s, v) {
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }

    return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ];
  }

  //generate a random colour using the golden ratio conjugate
  generateRandomColour() {
    var goldenConjugate = 0.618033988749895;
    var min = Math.ceil(0);
    var max = Math.floor(1000000);
    var number = Math.random() * (max - min + 1) + min;
    number += goldenConjugate;
    number %= 1;
    return this.hsv_to_rgb(number,0.5,0.99);
  }

  //add model and atom text editor to state array from view, also generate random colour
  addBubble(originalmod,marker) {
    let original = this.state.originalarray.slice();
    original.push(originalmod);
    //generate random colour rgb
    let bubbleColour = this.state.colour.slice();
    bubbleColour.push(this.generateRandomColour());
    //add marker
    let markercopy = this.state.markerarray.slice();
    markercopy.push(marker);
    this.setState({originalarray: original,colour: bubbleColour,markerarray: markercopy});
  }

  //remove bubble from board
  removeBubble(e,bubbleIndex) {
    e.preventDefault();
    if (e.button == 0) { //if left mouse click
      var neworiginal= this.state.originalarray.slice();
      neworiginal.splice(bubbleIndex,1);
      this.setState({originalarray: neworiginal});
    }
  }

  toggleTree(e) {
    e.preventDefault();
    this.setState(prev => ({
      mainSectionWidth: prev.mainSectionWidth === "80%" ? "99%" : "80%",
      treeWidth: prev.treeWidth === "20%" ? "1%" : "20%",
      treeVisible: !prev.treeVisible
    }));
  }

  render() {
    return (
      <StyledMain>
        <MainSection removeBubble={this.removeBubble} originalarray={this.state.originalarray}
          width={this.state.mainSectionWidth} colour={this.state.colour} marker={this.state.markerarray}
        />
      <Tree width={this.state.treeWidth} visible={this.state.treeVisible} toggleTree={this.toggleTree}/>
      </StyledMain>
    );
  }
}
