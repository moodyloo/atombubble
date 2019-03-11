"use babel";

import styled from 'styled-components';

export const StyledMain = styled.section `
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 1fr ${props => props.treeWidth};
  grid-template-rows: ${props => props.topHeight} 1fr;
  grid-template-areas:
            "Top Tree"
            "Board Tree"
`;