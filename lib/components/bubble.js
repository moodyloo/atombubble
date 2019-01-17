'use babel';
import React from 'react';
import styled from 'styled-components';
import interact from 'interactjs';

export const StyledBubble = styled.section`
  display: inline-block;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  background-Color: black;
  width: 250px;
  height: 300px;
`;




export default class Bubble extends React.Component {
  constructor(props) {
    super(props);
  }

  ref = React.createRef();

  interact = null;

  componentDidMount() {
      this.interact = interact(this.ref.current);
      this.setInteractions();
  }

  componentWillUnmount() {}

  setInteractions() {
    if (this.props.draggable)
      this.interact.draggable(this.props.draggableOptions);
    if (this.props.resizable)
      this.interact.resizable(this.props.resizableOptions);
  }



  render() {
    return (
      <StyledBubble ref={this.ref}>
        {this.props.children}
      </StyledBubble>
    );
  }
}
