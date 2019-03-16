'use babel';
import React from 'react';
import {StyledSVG} from './styled/arrow.styled.js';

export default class Arrow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var startCenterX = this.props.start.x+(this.props.start.width/2);
    var startCenterY = this.props.start.y+(this.props.start.height/2);

    var endCenterX = this.props.end.x+(this.props.end.width/2);
    var endCenterY = this.props.end.y+(this.props.end.height/2);

    return (
      <StyledSVG>
        <line x1={startCenterX}y1={startCenterY}   x2={endCenterX}y2={endCenterY}
          stroke-width="2" stroke="black"/>
      </StyledSVG>
    );
  }
}
