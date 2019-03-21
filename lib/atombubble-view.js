'use babel';
var $ = require('jquery');

import React from 'react';
import { render } from 'react-dom';

import Main from './components/main';

const fs = require('fs');
const glob = require("glob");
const loadJsonFile = require('load-json-file');
const acorn_loose = require('acorn-loose'); //js parser

export default class AtomBubbleView {
  constructor(serializedState) {
    this.data = serializedState;
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('codebubble');

    //load existing JSON save file
    var currentDirectory = glob.sync(atom.project.getPaths()[0])[0];
    var loadedworkingset = [[]];
    var loadedbubblelinks = [[]];
    var openPromises = [];
    var modelToAssign = [];

    if (fs.existsSync(currentDirectory+"/bubblesave.json")) { //if json file exist
      loadedworkingset = loadJsonFile.sync(currentDirectory+"/bubblesave.json").workingset;
      loadedbubblelinks = loadJsonFile.sync(currentDirectory+"/bubblesave.json").bubblelinks;
      //open files containing the functions of last session
      loadedworkingset.forEach((n,i)=>{
        n.forEach((m,j)=>{
          let fileToOpen = glob.sync(atom.project.getPaths()[0]+"/**/"+loadedworkingset[i][j].filename)[0];
          let openpromise = atom.workspace.open(fileToOpen,{activatePane:false,activateItem:false});
          openPromises.push(openpromise);
          modelToAssign.push(loadedworkingset[i][j]);
        });
      });
    }

    //initialise parsed functions
    var fileList;
    var parsedList = {};
    // options is optional
    fileList = glob.sync(atom.project.getPaths()[0]+"/**/*.js");

    fileList.forEach((x)=>{
      let data = fs.readFileSync(x,'utf8'); //get content of file
      parsedList[x] = acorn_loose.parse(data,{locations:true}); //parse file content
    });

    if (openPromises.length === 0) {
      render(<Main parsedobject={parsedList} workingset={loadedworkingset} bubblelinks={loadedbubblelinks}/>,this.element);
    } else {
      Promise.all(openPromises).then((models)=>{
        models.forEach((mod,i)=>{
          modelToAssign[i].model = mod;
        });
        render(<Main parsedobject={parsedList} workingset={loadedworkingset} bubblelinks={loadedbubblelinks}/>,this.element);
      });
    }
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
    return 'atom://atombubble';
  }

  //add text editor to a new bubble to the Board
  /**legacy code
  addBubble(originalmodel,selected) {
    console.log(selected);
    var functionName = "";
    if (selected !== "") functionName = selected.match(/\S+\s*\(\S*\)/)[0].match(/[a-zA-Z]+/)[0]; //get function's name only
    window.bubbleMain.addBubble(originalmodel,functionName);
  }
  */

  // Tear down any state and detach
  destroy() {
    this.element.remove();
    this.subscriptions.dispose();
  }

  getElement() {
    return this.element;
  }
}
