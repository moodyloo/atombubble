"use babel";

import styled from 'styled-components';

export const StyledTop = styled.div`
  background-color: base-background-color;
  padding: 0.25em 1em;
  width: 100%;
  height: ${props => props.height};
  border: 1px solid black;
  z-index: 1;
`;
