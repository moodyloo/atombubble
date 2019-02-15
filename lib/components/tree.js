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
      return (
        <div>Tree View</div>
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
