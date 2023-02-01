import { Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { DragDropContext, DropResult, Droppable, DroppableProvided } from 'react-beautiful-dnd';
import styled from 'styled-components';

import "./styles.scss";
import { IColumn } from '../interfaces';
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
      return [
        ...cols,
        {
          id: `col-${cols.length}`,
          title: columnName || `Column: ${cols.length}`,
          cards: []
        }
      ]
    });
    setColumnName("");
    setOpenInput(false);
  }, [columnName]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="board"
        type="COLUMN"
        direction="horizontal"
      >
        {(provided: DroppableProvided) => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            {columns.map((column, index) => (
              <Column
                {...column}
                key={column.id}
                index={index}
              />
            ))}
            {provided.placeholder}
            {openInput && (
              <PlusContainer className="mt-2 p-1 trello-container">
                <InputNewColumn value={columnName} onChange={e => setColumnName(e.target.value)}
                  placeholder="Enter list title"/>
                <ButtonNewColumn className="mt-1" onClick={handleNewColumn}>
                  Add list
                </ButtonNewColumn>
              </PlusContainer>
            )}
            {!openInput && (
              <ButtonPlus icon={<PlusOutlined />} className="mt-2 p-3 d-flex align-items-center" type="text"
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
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`;

const PlusContainer = styled.div`
  height: fit-content;
  
`

const ButtonPlus = styled(Button)`
  width: 250px;
  background: #FFFFFF3D;
  color: white !important;
  border-radius: 3px;

  &:hover {
    background: rgba(255, 255, 255, 0.3) !important;
  }
`

const ButtonNewColumn = styled(Button)`
  color: white !important;
  background: #0079bf;
  border-radius: 3px;

  &:hover {
    background: #026AA7;
  }
`

const InputNewColumn = styled(Input)`
  border: 2px solid #0079BF;
  border-radius: 3px;
`

export default Board