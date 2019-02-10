'use babel';
import React from 'react';

import {StyledTop} from './styled/top.styled.js';

export default class Top extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <StyledTop>
        Top View
      </StyledTop>
    );
  }
}
