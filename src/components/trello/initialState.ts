import { IBoard, ICard, IColumn, ITrelloState, IUser } from "./interfaces";

const Card: ICard = {
  title: "first card"
}

const Column: IColumn = {
  title: "first column",
  cards: [Card]
}

const Board: IBoard = {
  title: "Main",
  columns: [Column]
}

const User: IUser = {

}

export const initialState: ITrelloState = {
  boards: [Board],
  members: []
}