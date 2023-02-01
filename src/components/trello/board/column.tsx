import { Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useCallback, useState } from 'react';
import { Draggable, DraggableProvided, Droppable, DroppableProvided } from 'react-beautiful-dnd';
import styled from 'styled-components';

import { IColumn } from '../interfaces';
import Card from './card';


interface IProps extends IColumn{
  onNewCard: (columnName: string) => void;
  index: number;
};

const Column = (props: IProps) => {
  const [columnName, setColumnName] = useState<string>("");
  const [openInput, setOpenInput] = useState<boolean>(false);

  const { title, index, id, cards }  = props;

  const handleNewCard = useCallback(() => {
    props.onNewCard(columnName);
    setColumnName("");
    setOpenInput(false);
  }, [columnName]);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided: DraggableProvided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}
          className="m-2 p-2 d-flex flex-column trello-container">

          <Title {...provided.dragHandleProps} className="p-2 w-100">
            {title}
          </Title>

          <Droppable droppableId={id}>
            {(dropProvided: DroppableProvided) => (
              <CardsContainer {...dropProvided.droppableProps}
                ref={dropProvided.innerRef} className="d-flex flex-column">
                {cards.map((card, cardIndex) => <Card {...card} index={cardIndex} />)}
                {dropProvided.placeholder}
              </CardsContainer>
            )}
          </Droppable>

          {openInput && (
            <>
              <Input value={columnName} onChange={e => setColumnName(e.target.value)}
                placeholder="Enter list title"/>
              <Button className="mt-1 trello-new-element" onClick={handleNewCard}>
                Add card
              </Button>
            </>
          )}

          {!openInput && (
            <ButtonPlus icon={<PlusOutlined />} className="p-3 d-flex align-items-center" type="text"
              onClick={_ => setOpenInput(true)}>
              Add a card
            </ButtonPlus>
          )}

        </div>
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