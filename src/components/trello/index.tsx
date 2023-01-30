import { useSelector } from "react-redux";

import { selectors } from "./slice";
import Board from "./board/board";
import { authorQuoteMap } from "./board/data";

const Trello = () => {
  const boards = useSelector(selectors.selectBoards);

  console.log(7, boards);

  return (
    <Board initial={authorQuoteMap} />
  );
}

export default Trello;