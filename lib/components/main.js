'use babel';

import React from 'react';
import MainSection from './mainsection'
import Tree from './tree';

import {StyledMain} from './styled/main.styled.js';

const uuidv4 = require('uuid/v4'); //uuidv4() used for generating random unique key for assigning to map array in board
const fs = require('fs');
const glob = require("glob");
const acorn_loose = require('acorn-loose'); //js parser

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workingset: [[]],
      currentBoard: 0,
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
    this.toggleWorkingSet = this.toggleWorkingSet.bind(this);
    this.addWorkingSet = this.addWorkingSet.bind(this);
  }

  //change working set of package
  toggleWorkingSet(e,i) {
    console.log(i)
    if (e.button == 0) {
      this.setState({currentBoard: i});
    }
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

  //add new working set
  addWorkingSet() {
    var workingsetcopy = this.state.workingset.slice();
    workingsetcopy.push([]);
    this.setState({workingset: workingsetcopy});
  }

  //add model and atom text editor to state array from view, also generate random colour
  addBubble(originalmod,selected) {
    let bubbleColour = this.generateRandomColour()
    let workingsetcopy = this.state.workingset.slice();
    workingsetcopy[this.state.currentBoard].push(
      {id:uuidv4(),model:originalmod,colour:bubbleColour,func:selected,filename:originalmod.getTitle(),x:-15,y:-15}
    );

    this.setState({workingset:workingsetcopy});
  }

  //remove bubble from board
  removeBubble(e,i) {
    if (e.button == 0) { //if left mouse click
      var workingsetcopy = this.state.workingset.slice();
      workingsetcopy[this.state.currentBoard] = workingsetcopy[this.state.currentBoard].filter(x=>x.id !== i);

      this.setState({workingset: workingsetcopy});
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
  updateDirectoryFunctions(funcname) {
    var fileList;
    var parsedList = {};
    // options is optional
    fileList = glob.sync(atom.project.getPaths()[0]+"\\**\\*.js");

    fileList.forEach((x)=>{
      let data = fs.readFileSync(x,'utf8'); //get content of file
      parsedList[x] = acorn_loose.parse(data,{locations:true}); //parse file content
    });

    this.setState({parsedobject: parsedList});
  }

  componentDidMount() {
    var currentDirectory = glob.sync(atom.project.getPaths()[0])[0];
    fs.watch(currentDirectory,{recursive:true},(e,filename)=>{
      if (e === "rename" || e === "change") this.updateDirectoryFunctions();
    })

    this.updateDirectoryFunctions();
  }

  render() {
    return (
      <StyledMain>
        <MainSection removeBubble={this.removeBubble} width={this.state.mainSectionWidth}
          workingset={this.state.workingset} currentBoard={this.state.currentBoard}
          toggleWorkingSet={this.toggleWorkingSet} addWorkingSet={this.addWorkingSet}
          />
        <Tree width={this.state.treeWidth} visible={this.state.treeVisible} toggleTree={this.toggleTree}
          updateDirectoryFunctions={this.updateDirectoryFunctions} parsedobject={this.state.parsedobject} addBubble={this.addBubble}/>
      </StyledMain>
    );
  }
}
