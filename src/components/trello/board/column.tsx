import { Draggable, DraggableProvided, Droppable, DroppableProvided } from 'react-beautiful-dnd';
import styled from 'styled-components';

import { IColumn } from '../interfaces';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Card from './card';


const Container = styled.div`
  height: fit-content;
  background: #EBECF0;
  border-radius: 5px;
`;

interface IProps extends IColumn{
  index: number,
};

const Column = (props: IProps) => {
  const { title, index, id, cards }  = props;
  return (
    <Draggable draggableId={id} index={index}>
      {(provided: DraggableProvided) => (
        <Container ref={provided.innerRef} {...provided.draggableProps}
          className="m-2 p-2 d-flex flex-column">
          <Title {...provided.dragHandleProps} className="p-2 w-100">
            {title}
          </Title>
          <Droppable droppableId={id}>
            {(dropProvided: DroppableProvided) => (
              <CardsContainer {...dropProvided.droppableProps} ref={dropProvided.innerRef} className="d-flex flex-column">
                {cards.map((card, cardIndex) => <Card {...card} index={cardIndex} />)}
                {dropProvided.placeholder}
              </CardsContainer>
            )}
          </Droppable>
          <ButtonPlus icon={<PlusOutlined />} type="text"
            className="w-100 d-flex">Add a card</ButtonPlus>
        </Container>
      )}
    </Draggable>
  );
}

const ButtonPlus = styled(Button)`
  color: #5E6C84;
  svg {
    margin-top: 3px;
  }
`

const Title = styled.div`
  font-weight: bold;
`

const CardsContainer = styled.div`
  user-select: none;
  width: 250px;
`;

export default Column;