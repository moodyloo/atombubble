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
  width: 80px;
  height: 80%;
  margin: 0 10px;
  text-align: center;
  vertical-align: middle;
  border: solid ${props => props.borderColour};
`
export const OptionList = styled.div `
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
`

export const OptionSquare = styled.div `
  border: solid ${props => props.borderColour};
  text-align: center;
`