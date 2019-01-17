'use babel';
import React from 'react';
import styled from 'styled-components';

export const StyledTop = styled.section`
  background-color: red;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  width: 100%;
  height: 15%;
`;

export default class Top extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <StyledTop>
        Top View
      </StyledTop>
    );
  }
}
