'use babel';
import React from 'react';

import {StyledTop,SetList,Square,OptionList,OptionSquare} from './styled/top.styled.js';

export default class Top extends React.Component {
  constructor(props) {
    super(props);
    this.toggleArrow = this.toggleArrow.bind(this);
    this.getTopMenu = this.getTopMenu.bind(this);
  }

  toggleArrow(toggle) {
    if (toggle) {
      var count = -1;
      var boardset = this.props.workingset.map((x)=>{
        count++;
        var index = count;
        var bcolour;
        if (this.props.currentBoard === index) {bcolour = "yellow"} else {bcolour = "silver"}
        return (
          <Square onClick={(e)=>{this.props.toggleWorkingSet(e,index)}} borderColour={bcolour}>
            {"Set"+count}
          </Square>
        );
      });
      return (
        <SetList setNumber={this.props.workingset}>
          {boardset}
        </SetList>
      );
    } else {
      return (
        <div className="icon icon-triangle-down"/>
      );
    }
  }

  getTopMenu() {
    return (
      <OptionList>
        <OptionSquare className="icon icon-file-add" borderColour="blue" onClick={(e)=>{this.props.addWorkingSet()}}/>
        <OptionSquare className="icon icon-dash" borderColour="red" onClick={(e)=>{this.props.deleteSet(e)}}/>
      </OptionList>
    );
  }

  render() {
    return (
      <StyledTop onContextMenu={(e)=>{this.props.toggleTop(e)}}>
        {this.toggleArrow(this.props.visible)}
        {this.props.visible && this.getTopMenu()}
      </StyledTop>
    );
  }
}
