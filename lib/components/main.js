'use babel';
import React from 'react';
import Board from './board';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import styled from 'styled-components';


export const Page = styled.section`
  width: 100%;
  height: 100%;
  background-color: silver;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;


class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page>
        <Board/>
      </Page>
    );
  }
}
export default DragDropContext(HTML5Backend)(Main);
