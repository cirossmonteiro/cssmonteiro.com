import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import styled from 'styled-components';

import QuoteList from './primatives/quote-list';
import { ICard, IColumn } from '../interfaces';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';


const Container = styled.div`
  height: fit-content;
  background: #EBECF0;
  border-radius: 5px;
`;

interface IProps extends IColumn{
  index: number,
};

const Column = (props: IProps) => {
  const { title, index, id}  = props;
  return (
    <Draggable draggableId={id} index={index}>
      {(provided: DraggableProvided) => (
        <Container ref={provided.innerRef} {...provided.draggableProps}
          className="m-2 p-2 d-flex flex-column">
          <Title {...provided.dragHandleProps} className="p-2 w-100">
            {title}
          </Title>
          <QuoteList {...props} />
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