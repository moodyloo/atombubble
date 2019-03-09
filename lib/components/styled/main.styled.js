"use babel";

import styled from 'styled-components';

export const StyledMain = styled.section `
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: ${props => props.mainSectionWidth} ${props => props.treeWidth};
  grid-template-rows: ${props => props.topHeight} ${props => props.boardHeight};
  grid-template-areas:
            "Top Tree"
            "Board Tree"
`;