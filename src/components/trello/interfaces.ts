export interface ICard {
  id: string;
  title: string;
}

export interface IColumn {
  id: string;
  title: string;
  cards: ICard[];
}

export interface IBoard {
  title: string;
  columns: IColumn[];
}

// interface IUser {

// }
export type IUser = any;

// Define a type for the slice state
export interface ITrelloState {
  boards: IBoard[],
  members: IUser[]
}