import React from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import styled from 'styled-components';

import type { Quote } from '../types';
import { ICard } from '../../interfaces';

interface Props {
  card: ICard,
  provided: DraggableProvided
};

const Container = styled.div<any>`
  background: white;
  border-radius: 5px;
  box-shadow: 0 1px 0 #091e4240;
  box-sizing: border-box;
  user-select: none;
`;

// Previously this extended React.Component
// That was a good thing, because using React.PureComponent can hide
// issues with the selectors. However, moving it over does can considerable
// performance improvements when reordering big lists (400ms => 200ms)
// Need to be super sure we are not relying on PureComponent here for
// things we should be doing in the selector as we do not know if consumers
// will be using PureComponent
const QuoteItem = (props: Props) => (
  <Container ref={props.provided.innerRef}
    className="mb-2 p-2"
    {...props.provided.draggableProps}
    {...props.provided.dragHandleProps}>
    {props.card.title}
  </Container>
);

export default React.memo<Props>(QuoteItem);
