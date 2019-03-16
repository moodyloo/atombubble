'use babel';
import React from 'react';
import Bubble from './bubble';
import {StyledBoard} from './styled/board.styled.js';
import Arrow from './arrow';

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    this.leftResizeHandleref = null;

    this.setLeftResizeHandleref = element => {
      this.leftResizeHandleref = element;
    };

    this.addBubble = this.addBubble.bind(this);
    this.calculateLinks = this.calculateLinks.bind(this);
  }

  state = {};

  containerRef = React.createRef();

  //add array of bubbles on board, from main.js
  addBubble() {
    let count = -1;
    let bubblelist = this.props.workingset[this.props.currentBoard].map((b) => {
      count++;
      return (<Bubble key={b.id}
                      originalmodel={b.model}
                      colour={b.colour}
                      unique={b.id}
                      x={b.x} y={b.y}
                      w={b.width} h={b.height}
                      filename={b.filename}
                      index={count}
                      select={b.func}
                      draggable
                      removeBubble = {this.props.removeBubble}
                      setCoordinate = {this.props.setCoordinate}
                      setSize = {this.props.setSize}
                      linkBubbles={this.props.linkBubbles}
                      resizable></Bubble>);
      })
    return bubblelist;
  }

  calculateLinks() {
    var arrow = this.props.bubblelinks.map((link)=>{
      return(
        <Arrow id={link.id} start={link.start} end={link.end}/>
      );
    });

    return arrow;
  }

  render() {
    return(
      <StyledBoard id="board">
        {this.calculateLinks()}
        {this.addBubble()}
      </StyledBoard>
    );
  }
}
