'use babel';

import React from 'react';
import MainSection from './mainsection'
import styled from 'styled-components';
import Tree from './tree';

export const StyledMain = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`;

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bubblearray: [],
    };
  }

  addBubble(bubble) {
    let clone = this.state.bubblearray.slice();
    clone.push(bubble);
    this.setState({bubblearray: clone});
  }

  render() {
    return (
      <StyledMain>
        <MainSection bubblearray={this.state.bubblearray} />
        <Tree/>
      </StyledMain>
    );
  }
}
