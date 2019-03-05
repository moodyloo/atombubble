'use babel';
import React from 'react';

import {StyledTop,SetList,Square} from './styled/top.styled.js';

export default class Top extends React.Component {
  constructor(props) {
    super(props);
    this.toggleArrow = this.toggleArrow.bind(this);
  }

  toggleArrow(toggle) {
    if (toggle) {
      var count = -1;
      var boardset = this.props.workingset.map((x)=>{
        count++;
        var index = count;
        return (
          <Square onClick={(e)=>{this.props.toggleWorkingSet(e,index)}} borderColour="silver">
            {"Set"+count}
          </Square>
        );
      });
      return (
        <SetList>
          {boardset}
          <Square className="icon icon-file-add" borderColour="brown" onClick={(e)=>{this.props.addWorkingSet()}}/>
        </SetList>);
    } else {
      return (
        <div className="icon icon-triangle-down"/>
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
