'use babel';

import React from 'react';
import Top from './top';
import Board from './board';
import {StyledMainSection} from './styled/mainsection.styled.js';

export default class MainSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topHeight: "15%",
      topVisible: true,
      boardHeight: "85%",
    };
    this.toggleTop = this.toggleTop.bind(this);
  }

  toggleTop(e) {
    e.preventDefault();
    this.setState(prev => ({
      topHeight: prev.topHeight === "15%" ? "2%" : "15%",
      boardHeight: prev.boardHeight === "85%" ? "98%" : "85%",
      topVisible: !prev.topVisible
    }));
  }

  render() {
    return (
      <StyledMainSection width={this.props.width}>
        <Top height={this.state.topHeight} toggleTop={this.toggleTop} visible={this.state.topVisible}
           workingset={this.props.workingset} currentBoard={this.props.currentBoard} toggleWorkingSet={this.props.toggleWorkingSet}
           addWorkingSet={this.props.addWorkingSet} deleteSet={this.props.deleteSet}/>
         <Board height={this.state.boardHeight} removeBubble={this.props.removeBubble} workingset={this.props.workingset}
           currentBoard={this.props.currentBoard} setCoordinate={this.props.setCoordinate}/>
      </StyledMainSection>
    );
  }
}
