import { Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { DragDropContext, DropResult, Droppable, DroppableProvided } from 'react-beautiful-dnd';
import styled from 'styled-components';

import { ICard, IColumn } from '../interfaces';
import "./styles.scss";
import Column from './column';


interface Props {
  initial: IColumn[];
};

// to-do: make this work
declare global {
  interface Array<T> {
    move: (i: number, j: number) => void;
  }
}

Array.prototype.move = function move (i: number, j: number) {
  // const temp = { temp: this[i] };
  const temp = this[i];
  this.splice(i, 1);
  this.splice(j, 0, temp.temp);
  return this;
}

const computeColumnId = (cols: IColumn[]) => {
  for (let index = cols.length; ; index++) {
    const id = `column-${index}`;
    if (!cols.some(col => col.id === id)) {
      return id;
    }
  }
}

const computeCardId = (cols: IColumn[]) => {
  const cards = cols.reduce((ac: ICard[], cv) => [ ...ac, ...cv.cards], []);
  for (let index = cards.length; ; index++) {
    const id = `card-${index}`;
    if (!cards.some(card => card.id === id)) {
      return id;
    }
  }
}

const Board = (props: Props) => {
  const [columns, setColumns] = useState<IColumn[]>([]);
  const [columnName, setColumnName] = useState<string>("");
  const [openInput, setOpenInput] = useState<boolean>(false);
  console.log(52, columns);

  useEffect(() => {
    setColumns(props.initial);
  }, [props.initial]);

  const onDragEnd = useCallback((result: DropResult) => {
    console.log(60, result);
    setColumns(cols => {
      if (result.destination) {
        if (result.destination.droppableId === "board") {
          const colStart = result.source.index,
                colEnd = result.destination.index;
          
          const colSelected = cols[colStart];
          cols[colStart] = cols[colEnd];
          cols[colEnd] = colSelected;
        } else {
          const colStart = cols.findIndex(col => col.id === result.source.droppableId),
                colEnd = cols.findIndex(col => col.id === result.destination?.droppableId),
                rowStart = result.source.index,
                rowEnd = result.destination?.index;
            
          const cardSelected = cols[colStart].cards[rowStart];
          cols[colStart].cards = cols[colStart].cards.filter((_, index) => index !== rowStart);
          cols[colEnd].cards.splice(rowEnd, 0, cardSelected);
        }
      }

      return [ ...cols ];
    })
  }, []);

  const handleNewColumn = useCallback(() => {
    setColumns(cols => {
      const id = computeColumnId(cols);
      return [
        ...cols,
        {
          id,
          title: columnName || id,
          cards: []
        }
      ]
    });
    setColumnName("");
    setOpenInput(false);
  }, [columnName]);

  const handleNewCard = useCallback((columnId: string, cardTitle: string) => {
    setColumns(cols => {
      const colIndex = cols.findIndex(col => col.id === columnId);
      const id = computeCardId(cols);
      cols[colIndex].cards.push({
        id,
        title: cardTitle || id
      });

      return [ ...cols ];
    });
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="board"
        type="COLUMN"
        direction="horizontal"
      >
        {(provided: DroppableProvided) => (
          <Container ref={provided.innerRef} {...provided.droppableProps}
            className="h-100 d-flex">

            {columns.map((column, index) => (
              <Column
                {...column}
                key={column.id}
                index={index}
                onNewCard={name => handleNewCard(column.id, name)}
              />
            ))}

            {provided.placeholder}

            {openInput && (
              <div className="mt-2 p-1 trello-container">
                <InputNewColumn value={columnName} onChange={e => setColumnName(e.target.value)}
                  placeholder="Enter list title" className="trello-br"/>
                <Button className="mt-1 trello-new-element" onClick={handleNewColumn}>
                  Add list
                </Button>
              </div>
            )}

            {!openInput && (
              <ButtonPlus icon={<PlusOutlined />} className="w-100 m-2 p-3 d-flex align-items-center trello-width trello-br" type="text"
                onClick={_ => setOpenInput(true)}>
                Add another list
              </ButtonPlus>
            )}

          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
}

const Container = styled.div`
  background-color: #4BBF6B;
  min-width: 100%;
  overflow: auto;
`;

const ButtonPlus = styled(Button)`
  background: #FFFFFF3D;
  color: white !important;

  &:hover {
    background: rgba(255, 255, 255, 0.3) !important;
  }
`

const InputNewColumn = styled(Input)`
  border: 2px solid #0079BF;
`

export default Board