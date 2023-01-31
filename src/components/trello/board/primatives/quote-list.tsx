import React from 'react';
import { Draggable, DraggableProvided, Droppable, DroppableProvided } from 'react-beautiful-dnd';
import styled from 'styled-components';

import QuoteItem from './quote-item';
import { Quote } from '../types';
import { ICard } from '../../interfaces';


const Wrapper = styled.div`
  user-select: none;
  width: 250px;
`;

const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 250px;
`;

interface Props {
  listId?: string,
  listType?: string,
  cards: ICard[],
  internalScroll?: boolean,
  scrollContainerStyle?: Object,
  isDropDisabled?: boolean,
  isCombineEnabled?: boolean,
  useClone?: boolean,
};

interface QuoteListProps {
  cards: ICard[],
};

const InnerQuoteList = React.memo<QuoteListProps>((props: QuoteListProps) => {
  return (
    <>
      {props.cards.map((card, index) => (
        <Draggable key={card.id} draggableId={card.id} index={index}>
          {(dragProvided: DraggableProvided) => <QuoteItem card={card} provided={dragProvided} />}
        </Draggable>
      ))}
    </>
  );
});

interface InnerListProps {
  dropProvided: DroppableProvided,
  cards: ICard[],
};

const InnerList = (props: InnerListProps) => (
    <div ref={props.dropProvided.innerRef}>
      <InnerQuoteList cards={props.cards} />
      {props.dropProvided.placeholder}
    </div>
  )

const QuoteList = (props: Props) => {
  const {
    internalScroll,
    scrollContainerStyle,
    isDropDisabled,
    isCombineEnabled,
    listId = 'LIST',
    listType,
    cards,
    useClone,
  } = props;

  return (
    <Droppable
      droppableId={listId}
      type={listType}
      isDropDisabled={isDropDisabled}
      isCombineEnabled={isCombineEnabled}
      renderClone={
        useClone
          ? (provided, _, descriptor) => (
              <QuoteItem
                card={cards[descriptor.source.index]}
                provided={provided}
              />
            )
          : undefined
      }
    >
      {(dropProvided: DroppableProvided) => (
        <Wrapper {...dropProvided.droppableProps} className="d-flex flex-column">
          {internalScroll ? (
            <ScrollContainer style={scrollContainerStyle}>
              <InnerList
                cards={cards}
                dropProvided={dropProvided}
              />
            </ScrollContainer>
          ) : (
            <InnerList
              cards={cards}
              dropProvided={dropProvided}
            />
          )}
        </Wrapper>
      )}
    </Droppable>
  );
}

export default QuoteList;