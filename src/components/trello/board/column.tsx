// @flow
import React, { Component } from 'react';

// import { colors } from '@atlaskit/theme';
// import { grid, borderRadius } from '../constants';
// import { Draggable } from '../../../src';
// import type { DraggableProvided, DraggableStateSnapshot } from '../../../src';
import QuoteList from './primatives/quote-list';
import Title from './primatives/title';
// import type { Quote } from '../types';
import styled from 'styled-components';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { Quote } from './types';

const grid: number = 8;
const borderRadius: number = 2;

const colors = {
  G50: "#E3FCEF",
  N30:"#EBECF0"
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: #EBECF0;
  border-radius: 5px;
`;

const Header = styled.div<{
  isDragging: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  // border-top-left-radius: ${borderRadius}px;
  // border-top-right-radius: ${borderRadius}px;
  background-color: ${({ isDragging }) =>
    isDragging ? colors.G50 : colors.N30};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.G50};
  }
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
            <Header isDragging={snapshot.isDragging} className="p-2">
              <Title
                isDragging={snapshot.isDragging}
                {...provided.dragHandleProps}
                aria-label={`${title} quote list`}
              >
                {title}
              </Title>
            </Header>
            <QuoteList
              listId={title}
              listType="QUOTE"
              style={{
                backgroundColor: snapshot.isDragging ? colors.G50 : null,
              }}
              quotes={quotes}
              internalScroll={this.props.isScrollable}
              isCombineEnabled={Boolean(this.props.isCombineEnabled)}
              useClone={Boolean(this.props.useClone)}
            />
          </Container>
        )}
      </Draggable>
    );
  }
}
