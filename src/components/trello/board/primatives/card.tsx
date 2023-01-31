import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import styled from 'styled-components';

import { ICard } from '../../interfaces';


interface IProps extends ICard {
  index: number;
};

const Card = (props: IProps) => (
  <Draggable key={props.id} draggableId={props.id} index={props.index}>
    {(dragProvided: DraggableProvided) => (
      <Container ref={dragProvided.innerRef}
        className="mb-2 p-2"
        {...dragProvided.draggableProps}
        {...dragProvided.dragHandleProps}>
        {props.title}
      </Container>
    )}
  </Draggable>
  
);

const Container = styled.div<any>`
  background: white;
  border-radius: 5px;
  box-shadow: 0 1px 0 #091e4240;
  box-sizing: border-box;
  user-select: none;
`;

export default Card;
