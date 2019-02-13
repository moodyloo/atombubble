'use babel';

import React from 'react';
import Top from './top';
import Board from './board';
import {StyledMainSection} from './styled/mainsection.styled.js';

export default class MainSection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <StyledMainSection>
        <Top/>
        <Board removeBubble={this.props.removeBubble} originalarray={this.props.originalarray} colour={this.props.colour}/>
      </StyledMainSection>
    );
  }
}
