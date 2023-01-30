import { Component } from 'react';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import styled from 'styled-components';

import QuoteList from './primatives/quote-list';
import { Quote } from './types';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: #EBECF0;
  border-radius: 5px;
`;

interface Props {
  title: string,
  quotes: Quote[],
  index: number,
  isScrollable?: boolean,
  isCombineEnabled?: boolean,
  useClone?: boolean,
};

export default class Column extends Component<Props> {
  render() {
    const title: string = this.props.title;
    const quotes: Quote[] = this.props.quotes;
    const index: number = this.props.index;
    return (
      <Draggable draggableId={title} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <Container ref={provided.innerRef} {...provided.draggableProps}
            className="m-2 p-2">
            <Title {...provided.dragHandleProps} className="p-2 w-100">
              {title}
            </Title>
            <QuoteList
              listId={title}  
              listType="QUOTE"
              quotes={quotes}
              internalScroll={this.props.isScrollable}
              isCombineEnabled={Boolean(this.props.isCombineEnabled)}
              useClone={this.props.useClone}
            />
          </Container>
        )}
      </Draggable>
    );
  }
}

const Title = styled.div`
  font-weight: bold;
`