'use babel';
import React from 'react';
import styled from 'styled-components';

export const StyledTree = styled.section`
  background-color: green;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  width: 20%;
  height: 100%;
`;

export default class Tree extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <StyledTree>
        File Tree
      </StyledTree>
    );
  }
}
