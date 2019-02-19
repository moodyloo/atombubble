"use babel";

import styled from 'styled-components';

export const StyledTree = styled.div`
  background-color: base-background-color;
  padding: 0.25em 1em;
  width: ${props => props.width};
  height: 100%;
  border: 1px solid black;
  z-index: 1;
`;
