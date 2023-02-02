import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import styled from 'styled-components';

import { ICard } from '../interfaces';
import { useCallback, useState } from 'react';
import { Modal } from 'antd';


interface IProps extends ICard {
  index: number;
  renderModal?: (card: ICard, index: number) => JSX.Element;
};

const Card = (props: IProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleClick = useCallback(() => {
    if (props.renderModal) {
      setOpenModal(true);
    }
  }, [props.renderModal]);

  const card = { ...props };
  delete card.renderModal;

  return (
    <Draggable key={props.id} draggableId={props.id} index={props.index}>
      {(dragProvided: DraggableProvided) => (
        <>
          <Container ref={dragProvided.innerRef}
            className="w-100 mb-2 p-2 trello-width trello-br"
            {...dragProvided.draggableProps}
            {...dragProvided.dragHandleProps}
            onClick={handleClick}>
            {props.title}
          </Container>
          {props.renderModal ? 
            <Modal open={openModal} onCancel={_ => setOpenModal(false)}
              footer={false}>
              {props.renderModal(card, props.index)}
            </Modal>
          : null}
        </>
      )}
    </Draggable>
  );
}

const Container = styled.div`
  min-width: auto;
  background: white;
  box-shadow: 0 1px 0 #091e4240;
  box-sizing: border-box;
  user-select: none;
`;

export default Card;

export const TrelloForm = (card: ICard, index: number) => {
  return (
    <div>
      {index}: {card.title}
    </div>
  );
}