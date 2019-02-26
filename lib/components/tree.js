'use babel';
import React from 'react';

import {StyledTree} from './styled/tree.styled.js';

export default class Tree extends React.Component {
  constructor(props) {
    super(props);
    this.toggleArrow = this.toggleArrow.bind(this);
  }

  toggleArrow(toggle) {
    if (toggle) {
      var objectsarray = [];
      var objectkeys = Object.keys(this.props.parsedobject);
      var count = -1;
      for (var key in this.props.parsedobject) {
        objectsarray.push(this.props.parsedobject[key]);
      }
      var fileNames = objectsarray.map((x)=>{
        count++;
        var subfunctions = x.body.map((func)=>{
          return(
            <li className='list-item'>
              <span className='icon icon-file-text'>{func.id.name}</span>
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
        {this.toggleArrow(this.props.visible)}
      </StyledTree>
    );
  }
}
