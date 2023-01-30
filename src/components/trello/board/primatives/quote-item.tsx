// @flow
import React from 'react';
// import styled from '@emotion/styled';
import { colors } from '@atlaskit/theme';
import { borderRadius, grid } from '../constants';
import type { Quote, AuthorColors } from '../types';
import { DraggableProvided } from 'react-beautiful-dnd';
import styled from 'styled-components';
// import type { DraggableProvided } from '../../../src';

type Props = {
  quote: Quote,
  isDragging: boolean,
  provided: DraggableProvided,
  isClone?: boolean,
  isGroupedOver?: boolean,
  style?: Object,
  index?: number,
};

const getBackgroundColor = (
  isDragging: boolean,
  isGroupedOver: boolean,
  authorColors: AuthorColors,
) => {
  if (isDragging) {
    return authorColors.soft;
  }

  if (isGroupedOver) {
    return colors.N30;
  }

  return colors.N0;
};

const getBorderColor = (isDragging: boolean, authorColors: AuthorColors) =>
  isDragging ? authorColors.hard : 'transparent';

const imageSize: number = 40;

const CloneBadge = styled.div`
  background: ${colors.G100};
  bottom: ${grid / 2}px;
  border: 2px solid ${colors.G200};
  border-radius: 50%;
  box-sizing: border-box;
  font-size: 10px;
  position: absolute;
  right: -${imageSize / 3}px;
  top: -${imageSize / 3}px;
  transform: rotate(40deg);

  height: ${imageSize}px;
  width: ${imageSize}px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div<any>`
  border-radius: 5px;
  background: white;
  
  box-shadow: 0 1px 0 #091e4240;
  box-sizing: border-box;
  user-select: none;

  /* anchor overrides */
  color: ${colors.N900};

  &:hover,
  &:active {
    color: ${colors.N900};
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.colors.hard};
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;


const getStyle = (provided: DraggableProvided) => provided.draggableProps.style;

// Previously this extended React.Component
// That was a good thing, because using React.PureComponent can hide
// issues with the selectors. However, moving it over does can considerable
// performance improvements when reordering big lists (400ms => 200ms)
// Need to be super sure we are not relying on PureComponent here for
// things we should be doing in the selector as we do not know if consumers
// will be using PureComponent
function QuoteItem(props: Props) {
  const {
    quote,
    isDragging,
    isGroupedOver,
    provided,
    // style,
    isClone,
    // index,
  } = props;

  return (
    <Container
      href={quote.author.url}
      isDragging={isDragging}
      isGroupedOver={isGroupedOver}
      isClone={isClone}
      colors={quote.author.colors}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getStyle(provided)}
      data-is-dragging={isDragging}
      className="mb-2 p-2"
    >
      {quote.content}
    </Container>
  );
}

export default React.memo<Props>(QuoteItem);
