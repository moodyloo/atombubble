"use babel";

import styled from 'styled-components';

export const StyledTop = styled.div `
  background-color: base-background-color;
  padding: 0.25em 1em;
  width: 100%;
  height: ${props => props.height};
  border: 1px solid black;
  z-index: 1;
`;

export const SetList = styled.div `
  overflow: scroll;
  display: flex;
  flex-direction: row;
  margin: 0.5em;
  padding: 0.25em 0.25em;
`

export const Square = styled.div `
  height: 75px;
  width: 75px;
  margin: 0 10px;
  text-align: center;
  vertical-align: middle;
  line-height: 75px;
  border: solid ${props => props.borderColour};
`