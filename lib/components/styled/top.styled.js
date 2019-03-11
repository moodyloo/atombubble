"use babel";

import styled from 'styled-components';

export const StyledTop = styled.div `
  background-color: base-background-color;
  padding: 0.25em 1em;
  border: 1px solid black;
  display: grid;
  grid-gap: 2em;
  grid-template-columns: 7fr 1fr;
  grid-template-rows: 1fr;
  grid-area: Top;
`;

export const SetList = styled.div `
  overflow: scroll;
  display: flex;
  flex-direction: row;
`

export const Square = styled.div `
  height: 80%;
  width: 30px;
  margin: 0 10px;
  text-align: center;
  vertical-align: middle;
  line-height: 80%;
  border: solid ${props => props.borderColour};
`

export const OptionSquare = styled.div `
  border: solid ${props => props.borderColour};
`