import React from 'react';
import { Draggable, DraggableProvided, Droppable, DroppableProvided } from 'react-beautiful-dnd';
import styled from 'styled-components';

import QuoteItem from './quote-item';
import { Quote } from '../types';


const Wrapper = styled.div`
  user-select: none;
  width: 250px;
`;

const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 250px;
`;

/* stylelint-disable block-no-empty */
const Container = styled.div``;
/* stylelint-enable */

interface Props {
  listId?: string,
  listType?: string,
  quotes: Quote[],
  internalScroll?: boolean,
  scrollContainerStyle?: Object,
  isDropDisabled?: boolean,
  isCombineEnabled?: boolean,
  useClone?: boolean,
};

interface QuoteListProps {
  quotes: Quote[],
};

const InnerQuoteList = React.memo<QuoteListProps>(function InnerQuoteList(
  props: QuoteListProps,
) {
  return <>{props.quotes.map((quote: Quote, index: number) => (
    <Draggable key={quote.id} draggableId={quote.id} index={index}>
      {(dragProvided: DraggableProvided) => <QuoteItem quote={quote} provided={dragProvided} />}
    </Draggable>
  ))}</>;
});

interface InnerListProps {
  dropProvided: DroppableProvided,
  quotes: Quote[],
};

const InnerList = (props: InnerListProps) => (
  <Container>
    <div ref={props.dropProvided.innerRef}>
      <InnerQuoteList quotes={props.quotes} />
      {props.dropProvided.placeholder}
    </div>
  </Container>
  )

export default function QuoteList(props: Props) {
  const {
    internalScroll,
    scrollContainerStyle,
    isDropDisabled,
    isCombineEnabled,
    listId = 'LIST',
    listType,
    quotes,
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
          ? (provided, snapshot, descriptor) => (
              <QuoteItem
                quote={quotes[descriptor.source.index]}
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
                quotes={quotes}
                dropProvided={dropProvided}
              />
            </ScrollContainer>
          ) : (
            <InnerList
              quotes={quotes}
              dropProvided={dropProvided}
            />
          )}
        </Wrapper>
      )}
    </Droppable>
  );
}
