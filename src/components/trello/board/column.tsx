import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import styled from 'styled-components';

import QuoteList from './primatives/quote-list';
import { ICard, IColumn } from '../interfaces';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';


const Container = styled.div`
  height: fit-content;
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
          <QuoteList listId={id} cards={cards} />
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

export default Column;