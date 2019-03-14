'use babel';
import React from 'react';
import {StyledSVG} from './styled/arrow.styled.js';

export default class Arrow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <StyledSVG>
        <line x1="-15" y1="-15" x2="50" y2="50" stroke="black" />
      </StyledSVG>
    );
  }
}
