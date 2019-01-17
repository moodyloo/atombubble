'use babel';

import React from 'react';
import Top from './top';
import Board from './board';
import styled from 'styled-components';

export const StyledMainSection = styled.section`
  width: 90%;
  height: 100%;
  background-color: grey;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default class MainSection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <StyledMainSection>
        <Top/>
        <Board/>
      </StyledMainSection>
    );
  }
}
