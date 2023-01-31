import { Droppable, DroppableProvided } from 'react-beautiful-dnd';
import styled from 'styled-components';

import { IColumn } from '../../interfaces';
import Card from './card';


const CardsContainer = styled.div`
  user-select: none;
  width: 250px;
`;

interface IProps extends IColumn {
  
};


const QuoteList = (props: IProps) => {
  const { id, cards } = props;

  return (
    <Droppable
      droppableId={id}
    >
      {(dropProvided: DroppableProvided) => (
        <CardsContainer {...dropProvided.droppableProps} ref={dropProvided.innerRef} className="d-flex flex-column">
          {cards.map((card, index) => <Card {...card} index={index} />)}
          {dropProvided.placeholder}
        </CardsContainer>
      )}
    </Droppable>
  );
}

export default QuoteList;