// @flow
import styled from '@emotion/styled';
import { colors } from '@atlaskit/theme';
import { grid } from '../constants';
// import styled from 'styled-components';

// $ExpectError - not sure why
export default styled.h4<{
  isDragging?: boolean
}>`
  font-size: 14px;
  transition: background-color ease 0.2s;
  flex-grow: 1;
  user-select: none;
  position: relative;
  ${({ isDragging }) => isDragging ? "background: red;" : ""}

  &:focus {
    outline: 2px solid ${colors.P100};
    outline-offset: 2px;
  }
`;
