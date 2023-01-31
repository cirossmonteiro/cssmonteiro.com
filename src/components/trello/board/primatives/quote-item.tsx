import React from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import styled from 'styled-components';

import { ICard } from '../../interfaces';

interface Props {
  card: ICard;
  provided: DraggableProvided;
};

const Container = styled.div<any>`
  background: white;
  border-radius: 5px;
  box-shadow: 0 1px 0 #091e4240;
  box-sizing: border-box;
  user-select: none;
`;

const QuoteItem = (props: Props) => (
  <Container ref={props.provided.innerRef}
    className="mb-2 p-2"
    {...props.provided.draggableProps}
    {...props.provided.dragHandleProps}>
    {props.card.title}
  </Container>
);

export default React.memo<Props>(QuoteItem);
