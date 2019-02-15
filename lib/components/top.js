'use babel';
import React from 'react';

import {StyledTop} from './styled/top.styled.js';

export default class Top extends React.Component {
  constructor(props) {
    super(props);
    this.toggleArrow = this.toggleArrow.bind(this);
  }

  toggleArrow(toggle) {
    if (toggle) {
      return (
        <div>Top View</div>
      );
    } else {
      return (
        <center>
          <div className="icon icon-triangle-down"/>
        </center>
      );
    }
  }

  render() {
    return (
      <StyledTop height={this.props.height} onContextMenu={(e)=>{this.props.toggleTop(e)}}>
        {this.toggleArrow(this.props.visible)}
      </StyledTop>
    );
  }
}
