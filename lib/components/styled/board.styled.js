"use babel";

import styled from 'styled-components';

export const StyledBoard = styled.section`
  width: 100%;
  height: ${props=>props.height};
  background-color: #808080;
  overflow: auto;
`;
