'use babel';
import React from 'react';
import Bubble from './bubble';
import styled from 'styled-components';
import Octicon,{ArrowBoth} from '@githubprimer/octicons-react';
import PropTypes from 'prop-types';

export const StyledBoard = styled.section`
  width: 100%;
  height: 85%;
  background-color: grey;
`;


//  justify-content: center;
// align-items: center;
//   flex-direction: column;
//  display: flex;
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

  leftResizeHandleref = React.createRef();

  rightResizeHandleref = React.createRef();

  dragMoveListener = event => {
   const target = event.target;
   const { x: stateX, y: stateY } = this.state;
   // keep the dragged position in the data-x/data-y attributes
   const x = (parseFloat(stateX) || 0) + event.dx;
   const y = (parseFloat(stateY) || 0) + event.dy;

   // translate the element
   target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`;

   // update the position attributes
   this.setState({ x, y });
  };

  resizeListener = event => {
    const target = event.target;
    const { x: stateX, y: stateY } = this.state;
    let x = parseFloat(stateX) || 0;
    let y = parseFloat(stateY) || 0;

    // update the element's style
    target.style.width = `${event.rect.width}px`;
    target.style.height = `${event.rect.height}px`;

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform = `translate(${x}px,${y}px)`;

    this.setState({ x, y });
  };

  //add array of bubbles on board, from main.js
  addBubble() {
    const bubblearray = this.props.bubble;
    console.log(bubblearray);
    var count = 0;
    for (var i=0;i < bubblearray.length;i++) {
      document.getElementById("board").append(bubblearray[i]);
    }
  }

  render() {
    return(
      <div
        id="board"
        ref={this.containerRef}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#eee",
          overflow: "scroll",
        }}
     >
      {this.addBubble()}
      </div>
    );
  }
}
