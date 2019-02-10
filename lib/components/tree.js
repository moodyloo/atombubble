'use babel';
import React from 'react';

import {StyledTree} from './styled/tree.styled.js';

export default class Tree extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <StyledTree>
        File Tree
      </StyledTree>
    );
  }
}
