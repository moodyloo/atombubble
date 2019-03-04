'use babel';
import React from 'react';

import {StyledTree} from './styled/tree.styled.js';

export default class Tree extends React.Component {
  constructor(props) {
    super(props);
    this.toggleArrow = this.toggleArrow.bind(this);
    this.addBubble = this.addBubble.bind(this);
  }

  //open file in atom, then pass model and function name to addbubble in Main
  addBubble(e,directory,functionName) {
    e.preventDefault();
    var openPromise = atom.workspace.open(directory,{activatePane:false,activateItem:false});

    openPromise.then((x)=>{
      this.props.addBubble(x,functionName);
    });
  }

  toggleArrow(toggle) {
    if (toggle) {
      var objectsarray = []; //array of parsed object
      var objectkeys = Object.keys(this.props.parsedobject); //keys of objectsarray(directory url)
      var count = -1;

      for (var key in this.props.parsedobject) {
        objectsarray.push(this.props.parsedobject[key]);
      }

      var fileNames = objectsarray.map((x)=>{
        count++;
        var subfunctions = x.body.map((func)=>{
          var currentFile = objectkeys[count];
          return(
            <li className='list-item'>
              <span className='icon icon-file-text'>{func.id.name}</span>
              <div className='icon icon-file-add' onClick={(e)=>{this.addBubble(e,currentFile,func.id.name)}}/>
            </li>
          );
        });
        return(
          <li className='list-nested-item'>
            <div className='list-item'>
              <span className='icon icon-file-directory'>{objectkeys[count].match(/[a-zA-Z0-9]+.js/)}</span>
            </div>

            <ul className='list-tree'>
              {subfunctions}
            </ul>
          </li>
        );
      });

      return (
        <ul className='list-tree has-collapsable-children'>
          <li className='list-nested-item'>
            <div className='list-item'>
              <span className='icon icon-file-directory'>{atom.project.getPaths()[0]}</span>
            </div>

            <ul className='list-tree'>
              {fileNames}
            </ul>
          </li>
        </ul>
      );
    } else {
      return (
        <center>
          <div className="icon icon-triangle-left"/>
        </center>
      );
    }
  }

  render() {
    return (
      <StyledTree width={this.props.width} onContextMenu={(e)=>{this.props.toggleTree(e)}}>
        <div className="icon icon-repo-sync" onClick={(e)=>{this.props.updateDirectoryFunctions()}}/>
        {this.toggleArrow(this.props.visible)}
      </StyledTree>
    );
  }
}
