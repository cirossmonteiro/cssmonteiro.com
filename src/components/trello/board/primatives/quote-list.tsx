import { Draggable, DraggableProvided, Droppable, DroppableProvided } from 'react-beautiful-dnd';
import styled from 'styled-components';

import QuoteItem from './quote-item';
import { ICard } from '../../interfaces';


const Wrapper = styled.div`
  user-select: none;
  width: 250px;
`;

interface Props {
  listId: string;
  cards: ICard[];
};


const QuoteList = (props: Props) => {
  const { listId, cards } = props;

  return (
    <Droppable
      droppableId={listId}
    >
      {(dropProvided: DroppableProvided) => (
        <Wrapper {...dropProvided.droppableProps} className="d-flex flex-column">
          <div ref={dropProvided.innerRef}>
            {cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(dragProvided: DraggableProvided) => <QuoteItem card={card} provided={dragProvided} />}
              </Draggable>
            ))}
            {dropProvided.placeholder}
          </div>
        </Wrapper>
      )}
    </Droppable>
  );
}

export default QuoteList;