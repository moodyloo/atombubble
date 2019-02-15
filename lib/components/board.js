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
    console.log(this.props.originalarray);
    let bubblelist = this.props.originalarray.map((b) => {
      count++;
      return (<Bubble key={b[1]}
                      originalmodel={b[0]}
                      colour={this.props.colour[count]}
                      unique={count}
                      marker={this.props.marker[count]}
                      draggable
                      removeBubble = {this.props.removeBubble}
                      resizable></Bubble>);
      })
    return bubblelist;
  }


  render() {
    return(
      <StyledBoard id="board" height={this.props.height}>
        {this.addBubble()}
      </StyledBoard>
    );
  }
}
