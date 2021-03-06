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

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workingset: props.workingset,
      bubblelinks: props.bubblelinks,
      currentlink: "",
      currentBoard: 0,
      parsedobject: props.parsedobject,
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
    this.setSize = this.setSize.bind(this);
    this.linkBubbles = this.linkBubbles.bind(this);
    this.copyState = this.copyState.bind(this);
  }

  //deep copy for setState
  copyState(state) {
    return(
      state.map((set,i)=>{
        return(set.map((obj,j)=>{
          return Object.assign({},obj);
        }));
      })
    );
  }

  //linked two bubbles together with a svg arrow
  linkBubbles(index) {
    var workingsetcopy = this.copyState(this.state.workingset);
    var selectedbubble = workingsetcopy[this.state.currentBoard][index];

    if (this.state.currentlink === "") { //selecting first bubble for linking
      this.setState({currentlink: selectedbubble});
    } else { //selecting second bubble for linking
      if (this.state.currentlink.id === selectedbubble.id) { //if same bubble selected
        this.setState({currentlink: ""});
      } else { //if other bubbles selected
        let bubblelinkscopy = this.copyState(this.state.bubblelinks);
        let startcopy = Object.assign({},this.state.currentlink);
        let endcopy = Object.assign({},selectedbubble);
        startcopy.model="";
        endcopy.model="";
        let bubblepair = {id:uuidv4() ,start:startcopy,end:endcopy};
        bubblelinkscopy[this.state.currentBoard].push(bubblepair);

        this.setState({currentlink:"",bubblelinks:bubblelinkscopy});
      }
    }
  }

  deleteSet(e) {
    //prevent deletion when there is only one set
    if (e.button === 0 && this.state.workingset.length !== 1) {
      this.setState((prev)=>({
        workingset: prev.workingset.filter((x,i)=>i !== prev.currentBoard),
        currentBoard: prev.currentBoard-1 < 0 ? 0 : prev.currentBoard-1,
        bubblelinks: prev.bubblelinks.filter((x,i)=>i !== prev.currentBoard)
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
    var workingsetcopy = this.copyState(this.state.workingset);
    var bubblelinkscopy = this.copyState(this.state.bubblelinks);

    //update relationship lines position
    bubblelinkscopy[this.state.currentBoard].forEach((obj,i)=>{
      if (obj.start.id === workingsetcopy[this.state.currentBoard][index].id) {
        bubblelinkscopy[this.state.currentBoard][i].start.x = stateX;
        bubblelinkscopy[this.state.currentBoard][i].start.y = stateY;
      }
      if (obj.end.id === workingsetcopy[this.state.currentBoard][index].id) {
        bubblelinkscopy[this.state.currentBoard][i].end.x = stateX;
        bubblelinkscopy[this.state.currentBoard][i].end.y = stateY;
      }
    });

    workingsetcopy[this.state.currentBoard][index].x = stateX;
    workingsetcopy[this.state.currentBoard][index].y = stateY;
    this.setState({workingset: workingsetcopy,bubblelinks: bubblelinkscopy});
  }

  //set size of bubble
  setSize(index,width,height) {
    var workingsetcopy = this.copyState(this.state.workingset);
    var bubblelinkscopy = this.copyState(this.state.bubblelinks);

    //update relationship lines position
    bubblelinkscopy[this.state.currentBoard].forEach((obj,i)=>{
      if (obj.start.id === workingsetcopy[this.state.currentBoard][index].id) {
        bubblelinkscopy[this.state.currentBoard][i].start.width = width;
        bubblelinkscopy[this.state.currentBoard][i].start.height = height;
      }
      if (obj.end.id === workingsetcopy[this.state.currentBoard][index].id) {
        bubblelinkscopy[this.state.currentBoard][i].end.width = width;
        bubblelinkscopy[this.state.currentBoard][i].end.height = height;
      }
    });

    workingsetcopy[this.state.currentBoard][index].width = width;
    workingsetcopy[this.state.currentBoard][index].height = height;
    this.setState({workingset: workingsetcopy,bubblelinks: bubblelinkscopy});
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
    var workingsetcopy = this.copyState(this.state.workingset);
    var bubblelinkscopy = this.copyState(this.state.bubblelinks);

    bubblelinkscopy.push([]);
    workingsetcopy.push([]);
    this.setState({workingset: workingsetcopy,bubblelinks: bubblelinkscopy});
  }

  //add model and atom text editor to state array from view, also generate random colour
  addBubble(originalmod,selected) {
    let bubbleColour = this.generateRandomColour()
    let workingsetcopy = this.copyState(this.state.workingset);
    workingsetcopy[this.state.currentBoard].push(
      {id:uuidv4(),model:originalmod,colour:bubbleColour,func:selected,filename:originalmod.getTitle(),x:-13,y:-13,
        width:300,height:400}
    );

    this.setState({workingset:workingsetcopy});
  }

  //remove bubble from board, and any links
  removeBubble(e,i) {
    if (e.button == 0) { //if left mouse click
      var workingsetcopy = this.copyState(this.state.workingset);
      var bubblelinkscopy = this.copyState(this.state.bubblelinks);
      workingsetcopy[this.state.currentBoard] = workingsetcopy[this.state.currentBoard].filter(x=>x.id !== i);

      //delete any links between this bubble and others
      bubblelinkscopy[this.state.currentBoard] = bubblelinkscopy[this.state.currentBoard].filter(x=>{
        return(x.start.id !== i && x.end.id !== i);
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
      parsedList[x] = acorn_loose.parse(data,{locations:true,allowImportExportEverywhere: true}); //parse file content
    });

    this.setState({parsedobject: parsedList});
  }

  componentDidMount() {
    var currentDirectory = glob.sync(atom.project.getPaths()[0])[0];
    fs.watch(currentDirectory,{recursive:true},(e,filename)=>{
      if (filename !== "bubblesave.json") this.updateDirectoryFunctions();
    })
  }

  saveFile(e) {
    if (e.button === 0) {
      if (fs.existsSync(currentDirectory+"/bubblesave.json")) {
        fs.unlinkSync(currentDirectory+"/bubblesave.json",()=>{});
      }
      var currentDirectory = glob.sync(atom.project.getPaths()[0])[0];
      var setcopy = this.copyState(this.state.workingset);
       //set model property in workingset to empty string
       setcopy.forEach((x,i)=>{
         x.forEach((y,j)=>{
           setcopy[i][j].model = "";
         });
       });
      writeJsonFile.sync(currentDirectory+"/bubblesave.json",{workingset: setcopy,bubblelinks: this.state.bubblelinks});
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
