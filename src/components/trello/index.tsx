


import { ClassAttributes, HTMLAttributes, JSXElementConstructor, Key, LegacyRef, ReactElement, ReactFragment, ReactPortal, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";

import { selectors } from "./slice";
import Create from "./create";
import styled from "styled-components";
import Board from "./board/board";
import { authorQuoteMap } from "./board/data";

// fake data generator
const getItems = (count: number, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`
  }));

const reorder = (list: Iterable<unknown> | ArrayLike<unknown>, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (
  source: Iterable<unknown> | ArrayLike<unknown>,
  destination: Iterable<unknown> | ArrayLike<unknown>,
  droppableSource: { index: number; droppableId: string | number; },
  droppableDestination: { index: number; droppableId: string | number; }
): any => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: any = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
const grid = 8;

const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});
const getListStyle = (isDraggingOver: any) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});



const Trello = () => {
  const boards = useSelector(selectors.selectBoards);

  console.log(7, boards);


  const [state, setState] = useState<any>([getItems(10), getItems(5, 10)]);

  function onDragEnd(result: { source: any; destination: any; }) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState.filter(group => group.length));
    }
  }

  return (
    <div>trello
      <Create />
      <div style={{ display: "flex" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {state.map((el: any[], ind: number) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided: any, snapshot: any) => (
                <Column
                  ref={provided.innerRef}
                  // style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                  className="me-2 p-2"
                >
                  <div className="mb-2 title">title</div>
                  {el.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided: any, snapshot: { isDragging: any; }) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-2 p-2"
                          // style={getItemStyle(
                          //   snapshot.isDragging,
                          //   provided.draggableProps.style
                          // )}
                        >
                          card body
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Column>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
      <Board initial={authorQuoteMap} />
    </div>
  );
}

const Column = styled.div`
  border-radius: 5px;
  background: #EBECF0;
  .title {
    font-weight: bold;
  }
`

const Card = styled.div`
  border-radius: 5px;
  background: white;
  &:hover {
    background: #F4F5F7;
  }
`;

export default Trello;