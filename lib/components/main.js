'use babel';

import React from 'react';
import MainSection from './mainsection'
import Tree from './tree';

import {StyledMain} from './styled/main.styled.js';

const uuidv4 = require('uuid/v4'); //uuidv4() used for generating random unique key for assigning to map array in board
const fs = require('fs');
const glob = require("glob");
const acorn_loose = require('acorn-loose'); //js parser
const escodegen = require('escodegen'); //convert syntax tree to code

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originalarray: [],
      colour: [],
      selectarray: [],
      parsedobject: {},
      mainSectionWidth: "70%",
      treeWidth: "30%",
      treeVisible: true,
    };

    this.addBubble = this.addBubble.bind(this);
    this.removeBubble = this.removeBubble.bind(this);
    this.hsv_to_rgb = this.hsv_to_rgb.bind(this);
    this.generateRandomColour = this.generateRandomColour.bind(this);
    this.toggleTree = this.toggleTree.bind(this);
    this.updateDirectoryFunctions = this.updateDirectoryFunctions.bind(this);
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
    var max = Math.floor(9999999);
    var number = Math.random() * (max - min + 1) + min;
    number += goldenConjugate;
    number %= 1;

    let colour = this.hsv_to_rgb(number,0.5,0.99);
    return "rgb("+colour[0]+","+colour[1]+","+colour[2]+")";
  }

  //add model and atom text editor to state array from view, also generate random colour
  addBubble(originalmod,selected) {
    let bubbleColour = this.generateRandomColour()

    this.setState((prev)=>({
      originalarray: [...prev.originalarray,[originalmod,uuidv4()]],
      colour: [...prev.colour,bubbleColour],
      selectarray: [...prev.selectarray,selected],
    }));
  }

  //remove bubble from board
  removeBubble(e,i) {
    e.preventDefault();

    if (e.button == 0) { //if left mouse click
      this.setState((prev)=>({
        originalarray: prev.originalarray.filter((x,j) => j != i),
        colour: prev.colour.filter((x,j) => j != i),
        selectarray: prev.selectarray.filter((x,j) => j != i),
      }));
    }
  }

  toggleTree(e) {
    e.preventDefault();
    this.setState(prev => ({
      mainSectionWidth: prev.mainSectionWidth === "70%" ? "99%" : "70%",
      treeWidth: prev.treeWidth === "30%" ? "1%" : "30%",
      treeVisible: !prev.treeVisible
    }));
  }

  //get all functions from code files in current directory and parse file content
  updateDirectoryFunctions() {
    var fileList;
    var parsedList = {};
    // options is optional
    fileList = glob.sync(atom.project.getPaths()[0]+"\\**\\*.js");

    fileList.forEach((x)=>{
      let data = fs.readFileSync(x,'utf8');
      parsedList[x] = acorn_loose.parse(data);
    });
    this.setState({parsedobject: parsedList});
  }

  componentDidMount() {
    this.updateDirectoryFunctions();
  }

  render() {
    return (
      <StyledMain>
        <MainSection removeBubble={this.removeBubble} originalarray={this.state.originalarray}
          width={this.state.mainSectionWidth} colour={this.state.colour} select={this.state.selectarray}/>
        <Tree width={this.state.treeWidth} visible={this.state.treeVisible} toggleTree={this.toggleTree}
          updateDirectoryFunctions={this.updateDirectoryFunctions} parsedobject={this.state.parsedobject} addBubble={this.addBubble}/>
      </StyledMain>
    );
  }
}
