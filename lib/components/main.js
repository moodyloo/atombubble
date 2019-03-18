'use babel';

import React from 'react';
import Tree from './tree';
import Top from './top';
import Board from './board';

import {StyledMain} from './styled/main.styled.js';

const uuidv4 = require('uuid/v4'); //uuidv4() used for generating random unique key for assigning to map array in board
const fs = require('fs');
const glob = require("glob");
const acorn_loose = require('acorn-loose'); //js parser
const writeJsonFile = require('write-json-file');
const loadJsonFile = require('load-json-file');
const util = require('util')

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workingset: [[]],
      bubblelinks: [[]],
      currentlink: "",
      currentBoard: 0,
      parsedobject: {},
      treeWidth: "0.25fr",
      topHeight: "0.2fr",
      topVisible: true,
      treeVisible: true,
    };

    this.addBubble = this.addBubble.bind(this);
    this.removeBubble = this.removeBubble.bind(this);
    this.hsv_to_rgb = this.hsv_to_rgb.bind(this);
    this.generateRandomColour = this.generateRandomColour.bind(this);
    this.toggleTree = this.toggleTree.bind(this);
    this.toggleTop = this.toggleTop.bind(this);
    this.updateDirectoryFunctions = this.updateDirectoryFunctions.bind(this);
    this.toggleWorkingSet = this.toggleWorkingSet.bind(this);
    this.addWorkingSet = this.addWorkingSet.bind(this);
    this.setCoordinate = this.setCoordinate.bind(this);
    this.deleteSet = this.deleteSet.bind(this);
    this.saveFile = this.saveFile.bind(this);
    this.loadFile = this.loadFile.bind(this);
    this.setSize = this.setSize.bind(this);
    this.linkBubbles = this.linkBubbles.bind(this);
  }

  //linked two bubbles together with a svg arrow
  linkBubbles(index) {
    var workingsetcopy = this.state.workingset.slice();
    var selectedbubble = workingsetcopy[this.state.currentBoard][index];

    if (this.state.currentlink === "") { //selecting first bubble for linking
      this.setState({currentlink: selectedbubble});
    } else { //selecting second bubble for linking
      if (this.state.currentlink.id === selectedbubble.id) { //if same bubble selected
        this.setState({currentlink: ""});
      } else { //if other bubbles selected
        let bubblepairarray = this.state.bubblelinks.slice();
        let bubblepair = {id:uuidv4() ,start:this.state.currentlink,end:selectedbubble};
        bubblepairarray[this.state.currentBoard].push(bubblepair);

        this.setState({currentlink:"",bubblelinks:bubblepairarray});
      }
    }
  }

  deleteSet(e) {
    //prevent deletion when there is only one set
    if (e.button === 0 && this.state.workingset.length !== 1) {
      var workingsetcopy = this.state.workingset.slice();
      var bubblelinkscopy = this.state.bubblelinks.slice();

      workingsetcopy = workingsetcopy.filter((x,i)=>i !== this.state.currentBoard);

      bubblelinkscopy = bubblelinkscopy.filter((x,i)=>i !== this.state.currentBoard);

      this.setState((prev)=>({
        workingset: workingsetcopy,
        currentBoard: prev.currentBoard-1 < 0 ? 0 : prev.currentBoard-1,
        bubblelinks: bubblelinkscopy
      }));
    }
  }

  //change working set of package
  toggleWorkingSet(e,i) {
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

  //set coordinate of bubble
  setCoordinate(index,stateX,stateY) {
    var workingsetcopy = this.state.workingset.slice();
    workingsetcopy[this.state.currentBoard][index].x = stateX;
    workingsetcopy[this.state.currentBoard][index].y = stateY;
    this.setState({workingset: workingsetcopy});
  }

  //set size of bubble
  setSize(index,width,height) {
    var workingsetcopy = this.state.workingset.slice();
    workingsetcopy[this.state.currentBoard][index].width = width;
    workingsetcopy[this.state.currentBoard][index].height = height;
    this.setState({workingset: workingsetcopy});
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
    var bubblelinkscopy = this.state.bubblelinks.slice();

    bubblelinkscopy.push([]);
    workingsetcopy.push([]);
    this.setState({workingset: workingsetcopy,bubblelinks: bubblelinkscopy});
  }

  //add model and atom text editor to state array from view, also generate random colour
  addBubble(originalmod,selected) {
    let bubbleColour = this.generateRandomColour()
    let workingsetcopy = this.state.workingset.slice();
    workingsetcopy[this.state.currentBoard].push(
      {id:uuidv4(),model:originalmod,colour:bubbleColour,func:selected,filename:originalmod.getTitle(),x:-13,y:-13,
        width:300,height:400}
    );

    this.setState({workingset:workingsetcopy});
  }

  //remove bubble from board, and any links
  removeBubble(e,i) {
    if (e.button == 0) { //if left mouse click
      var workingsetcopy = this.state.workingset.slice();
      var bubblelinkscopy = this.state.bubblelinks.slice();
      workingsetcopy[this.state.currentBoard] = workingsetcopy[this.state.currentBoard].filter(x=>x.id !== i);

      //delete any links between this bubble and others
      bubblelinkscopy[this.state.currentBoard] = bubblelinkscopy[this.state.currentBoard].filter(x=>{
        (x.start.id !== i || x.end.id !== i)
      });

      this.setState({workingset: workingsetcopy,bubblelinks: bubblelinkscopy});
    }
  }

  //toggle tree section
  toggleTree(e) {
    e.preventDefault();
    this.setState(prev => ({
      treeWidth: prev.treeWidth === "0.25fr" ? "0.05fr" : "0.25fr",
      treeVisible: !prev.treeVisible
    }));
  }

  //toggle top section
  toggleTop(e) {
    e.preventDefault();
    this.setState(prev => ({
      topHeight: prev.topHeight === "0.2fr" ? "0.05fr" : "0.2fr",
      topVisible: !prev.topVisible
    }));
  }

  //get all functions from code files in current directory and parse file content
  updateDirectoryFunctions() {
    var fileList;
    var parsedList = {};
    // options is optional
    fileList = glob.sync(atom.project.getPaths()[0]+"/**/*.js");

    fileList.forEach((x)=>{
      let data = fs.readFileSync(x,'utf8'); //get content of file
      parsedList[x] = acorn_loose.parse(data,{locations:true}); //parse file content
    });

    this.setState({parsedobject: parsedList});
  }

  componentDidMount() {
    var currentDirectory = glob.sync(atom.project.getPaths()[0])[0];
    fs.watch(currentDirectory,{recursive:true},(e,filename)=>{
      if (filename !== "bubblesave.json") this.updateDirectoryFunctions();
    })

    if (fs.existsSync(currentDirectory+"/bubblesave.json")) { //if json file exist
      this.loadFile();
    }
    this.updateDirectoryFunctions();
  }

  loadFile() {
    var currentDirectory = glob.sync(atom.project.getPaths()[0])[0];
    var loadedworkingset = loadJsonFile.sync(currentDirectory+"/bubblesave.json").workingset;
    //open files containing the functions of last session
    loadedworkingset.forEach((n,i)=>{
      n.forEach((m,j)=>{
        let filemodel = atom.workspace.getTextEditors().filter(x=>x.getTitle() === m.filename)[0];

        loadedworkingset[i][j].model = filemodel;
      });
    });
    //set workingset only after all file opened
    this.setState({workingset: loadedworkingset});
  }

  saveFile(e) {
    if (e.button === 0) {
      if (fs.existsSync(currentDirectory+"/bubblesave.json")) {
        fs.unlinkSync(currentDirectory+"/bubblesave.json",()=>{});
      }
      var currentDirectory = glob.sync(atom.project.getPaths()[0])[0];
      var setcopy = this.state.workingset.slice();
      var saveworkingset;

      //set model property to empty string
      saveworkingset = setcopy.map((i)=>{
        return(i.map((j)=>{
          j.model = "";
          return(j);
        }));
      })
      writeJsonFile.sync(currentDirectory+"/bubblesave.json",{workingset: saveworkingset});
      console.log("saved!");
    }
  }

  render() {
    return (
      <StyledMain treeWidth={this.state.treeWidth} topHeight={this.state.topHeight}>

        <Top toggleTop={this.toggleTop} visible={this.state.topVisible}
           workingset={this.state.workingset} currentBoard={this.state.currentBoard} toggleWorkingSet={this.toggleWorkingSet}
           addWorkingSet={this.addWorkingSet} deleteSet={this.deleteSet}/>

        <Board removeBubble={this.removeBubble} workingset={this.state.workingset}
           currentBoard={this.state.currentBoard} setCoordinate={this.setCoordinate}
           setSize={this.setSize} linkBubbles={this.linkBubbles} bubblelinks={this.state.bubblelinks}/>

        <Tree visible={this.state.treeVisible} toggleTree={this.toggleTree}
          updateDirectoryFunctions={this.updateDirectoryFunctions} parsedobject={this.state.parsedobject}
          addBubble={this.addBubble} saveFile={this.saveFile}/>

      </StyledMain>
    );
  }
}
