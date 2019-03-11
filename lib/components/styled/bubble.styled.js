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
  transform: ${props => props.coordinate};

  display: grid;
  grid-gap: 0.5em;
  grid-template-columns: 100%;
  grid-template-rows: 0.05fr ${props => props.menuHeight} 3fr;
  grid-template-areas:
            "Handle"
            "Menu"
            "Editor"

`;

export const StyledHandle = styled.div `
  display: flex;
  justify-content: center;
  width: 100%;
  grid-area: Handle;
`;

export const StyledMenu = styled.div `
  grid-area: Menu;
  text-align: center;
`

export const StyledDragIcon = styled.div `
  color: black;
  font-weight: bold;
`;

export const StyledEditor = styled.div `
  border: 'solid',
  grid-area: Editor;
  overflow: auto;
`;