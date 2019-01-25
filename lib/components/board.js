'use babel';
import React from 'react';
import Bubble from './bubble';
import styled from 'styled-components';

export const StyledBoard = styled.section`
  width: 100%;
  height: 85%;
  background-color: grey;
`;

export const StyledHandle = styled.div`
  font-size: 2em;
  position: relative;
`;

//  justify-content: center;
// align-items: center;
//   flex-direction: column;
//  display: flex;
export default class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {dragEnabled: true};

    this.leftResizeHandleref = null;

    this.setLeftResizeHandleref = element => {
      this.leftResizeHandleref = element;
    };
    this.toggleDrag = this.toggleDrag.bind(this);
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

  //disable drag when editing bubbles, re enable when outside is clicked
  toggleDrag(type,event) {
    event.preventDefault();
    if (type === "bubble") {
      this.setState(state => ({
        dragEnabled: true
      }));
    } else if (type === "nonbubble") {
      this.setState(state => ({
        dragEnabled: true
      }));
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
        }}
     >
        <Bubble
          draggable
          resizable
          resizableOptions={{
            onmove: this.resizeListener,
            edges: {
              left: true,
              right: true,
              bottom: true,
              top: true
            }
          }}
          draggableOptions={{
            restrict: {
                  restriction: 'parent',
                  elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
            enabled: this.state.dragEnabled,
            onmove: this.dragMoveListener,
          }}
        >
            <StyledHandle>X</StyledHandle>
            <div
              id="testbubble"
              style={{
                width: "100%",
                height: "95%",
                position: 'relative',
                float: 'left',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                border: 'solid',
                overflow: 'scroll',
            }}>
          </div>
        </Bubble>
      </div>
    );
  }
}
