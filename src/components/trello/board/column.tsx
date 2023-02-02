import { Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useCallback, useState } from 'react';
import { Draggable, DraggableProvided, DraggableStateSnapshot, Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import styled from 'styled-components';

import { ICard, IColumn } from '../interfaces';
import Card from './card';


interface IProps extends IColumn{
  onNewCard: (columnName: string) => void;
  index: number;
  cardModal?: (card: ICard, index: number) => JSX.Element;
};

const Column = (props: IProps) => {
  const [columnName, setColumnName] = useState<string>("");
  const [openInput, setOpenInput] = useState<boolean>(false);

  const { title, index, id, cards }  = props;

  const handleNewCard = useCallback(() => {
    props.onNewCard(columnName);
    setColumnName("");
    setOpenInput(false);
  }, [props, columnName]);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps}
          className="m-2 p-2 d-flex flex-column trello-container">

          <Title {...provided.dragHandleProps} className="p-2 w-100">
            {title}
          </Title>

          <Droppable droppableId={id}>
            {(dropProvided: DroppableProvided, dropSnapshot: DroppableStateSnapshot) => (
              <CardsContainer {...dropProvided.droppableProps}
                isDragging={dropSnapshot.isDraggingOver}
                isEmpty={cards.length === 0}
                ref={dropProvided.innerRef} className="w-100 d-flex flex-column">
                {cards.map((card, cardIndex) =>
                  <Card key={card.id} {...card} index={cardIndex}
                    renderModal={props.cardModal} />)}
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

const CardsContainer = styled.div<{
  isDragging: boolean;
  isEmpty: boolean
}>`
  min-height: ${({isDragging, isEmpty }) => isEmpty ? (isDragging ? 100 : 20) : 0}px;
  user-select: none;
`;

export default Column;