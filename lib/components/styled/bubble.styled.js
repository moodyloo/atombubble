"use babel";

import styled from 'styled-components';

export const StyledBubble = styled.div `
  font-size: 1em;
  margin: 0.5em;
  padding: 0.25em 0.25em;
  border: ${props => props.border};
  width: 300px;
  height: 400px;
  position: absolute;
  background-color: ${props => props.colour};
`;

export const StyledHandle = styled.div `
  display: flex;
  justify-content: center;
  height: 19px;
  width: 100%;
`;

export const StyledDragIcon = styled.div `
  color: black;
  font-weight: bold;
`;