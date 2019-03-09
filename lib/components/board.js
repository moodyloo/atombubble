'use babel';
import React from 'react';
import Bubble from './bubble';
import {StyledBoard} from './styled/board.styled.js';

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    this.leftResizeHandleref = null;

    this.setLeftResizeHandleref = element => {
      this.leftResizeHandleref = element;
    };

    this.addBubble = this.addBubble.bind(this);
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
                      x={b.x}
                      y={b.y}
                      filename={b.filename}
                      index={count}
                      select={b.func}
                      draggable
                      removeBubble = {this.props.removeBubble}
                      setCoordinate ={this.props.setCoordinate}
                      resizable></Bubble>);
      })
    return bubblelist;
  }


  render() {
    return(
      <StyledBoard id="board">
        {this.addBubble()}
      </StyledBoard>
    );
  }
}
