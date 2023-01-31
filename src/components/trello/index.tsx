import { useSelector } from "react-redux";

import { initArray } from "../../utils";
import { selectors } from "./slice";
import Board from "./board/board";
import { IColumn } from "./interfaces";


const COLUMNS = 2, CARDS = 6;

const data: IColumn[] = initArray(COLUMNS)
              .map((_, i) => ({
                id: `col-${i}`,
                title: `Column: ${i}`,
                cards: initArray(CARDS)
                  .map((_, j) => ({
                    id: `id_col-${i}_card-${j}`,
                    title: `Column: ${i} Card: ${j}`
                  }))
              }));

const Trello = () => {
  const boards = useSelector(selectors.selectBoards);

  console.log(7, boards);

  return (
    <Board initial={data} />
  );
}

export default Trello;