import React, { Component, useCallback, useEffect, useState } from 'react';
import { DragDropContext, DraggableLocation, DropResult, Droppable, DroppableProvided } from 'react-beautiful-dnd';
import styled from 'styled-components';

import Column from './column';
import reorder, { reorderQuoteMap } from './reorder';
import { Quote, QuoteMap } from './types';
import { IColumn } from '../interfaces';

const ParentContainer = styled.div<{
  height: string
}>`
  height: ${({ height }) => height};
  overflow-x: hidden;
  overflow-y: auto;
`;

const Container = styled.div`
  background-color: #4BBF6B;
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`;



interface Props {
  initial: IColumn[];
};

interface State {
  columns: IColumn[],
  ordered: string[],
};

/*declare global {
  interface Array<T> {
    move: (i: number, j: number) => void;
  }
}

Array.prototype.move = function (i: number, j: number) {
  const temp = this[i];
  this[i] = this[j]
}*/

const Board = (props: Props) => {
  const [columns, setColumns] = useState<IColumn[]>([]);

  useEffect(() => {
    setColumns(props.initial);
  }, [props.initial]);

  const onDragEnd = useCallback((result: DropResult) => {
    console.log(60, result);
    setColumns(cols => {
      if (result.destination) {
        const colStart = cols.findIndex(col => col.id === result.source.droppableId);
        console.log(59, colStart);
        const start = result.source.index, end = result.destination?.index;
        if (result.source.droppableId === result.destination.droppableId && start !== end) {
          const cards = cols[colStart].cards.filter((_, index) => index !== start);
          const cartSelected = cols[colStart].cards[start];
          cards.splice(end, 0, cartSelected);
          cols[colStart].cards = cards;
        }
      }

      return [ ...cols ];
    })
  }, []);

  const board = (
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
        </Container>
      )}
    </Droppable>
  );

  return (
    <React.Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
        {board}
      </DragDropContext>
    </React.Fragment>
  );
}

export default Board