import { useSelector } from "react-redux";

import { selectors } from "./slice";
import Board from "./board/board";
import { Quote } from "./board/types";
import { ICard, IColumn } from "./interfaces";

const cards: ICard[] = [
  {
    id: '1',
    title: "card 1"
    // title: 'Sometimes life is scary and dark',
  },
  {
    id: '2',
    title: "card 2"
      // 'Sucking at something is the first step towards being sorta good at something.',
  },
  {
    id: '3',
    title: "card 3"
    // title: "You got to focus on what's real, man",
  },
  {
    id: '4',
    title: 'Is that where creativity comes from? From sad biz?',
  },
  {
    id: '5',
    title: 'Homies help homies. Always',
  },
  {
    id: '6',
    title: 'Responsibility demands sacrifice',
  },
  {
    id: '7',
    title: "That's it! The answer was so simple, I was too smart to see it!",
  },
  {
    id: '8',
    title: "People make mistakes. It's all a part of growing up and you never really stop growing",
  },
  {
    id: '9',
    title: "Don't you always call sweatpants 'give up on life pants,' Jake?",
  },
  {
    id: '10',
    title: 'I should not have drunk that much tea!',
  },
  {
    id: '11',
    title: 'Please! I need the real you!',
  },
  {
    id: '12',
    title: "Haven't slept for a solid 83 hours, but, yeah, I'm good.",
  },
];

const column: IColumn = {
  id: "first",
  title: "main column",
  cards
}

const Trello = () => {
  const boards = useSelector(selectors.selectBoards);

  console.log(7, boards);

  return (
    <Board initial={[column]} />
  );
}

export default Trello;