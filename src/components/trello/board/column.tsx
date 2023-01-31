import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import styled from 'styled-components';

import QuoteList from './primatives/quote-list';
import { Quote } from './types';
import { ICard, IColumn } from '../interfaces';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: #EBECF0;
  border-radius: 5px;
`;

interface Props extends IColumn{
  // title: string,
  // cards: ICard[],
  index: number,
};

const Column = (props: Props) => {
  const { title, cards, index, id}  = props;
  return (
    <Draggable draggableId={id} index={index}>
      {(provided: DraggableProvided) => (
        <Container ref={provided.innerRef} {...provided.draggableProps}
          className="m-2 p-2">
          <Title {...provided.dragHandleProps} className="p-2 w-100">
            {title}
          </Title>
          <QuoteList
            listId={id}  
            listType="QUOTE"
            cards={cards}
          />
        </Container>
      )}
    </Draggable>
  );
}

const Title = styled.div`
  font-weight: bold;
`

export default Column;