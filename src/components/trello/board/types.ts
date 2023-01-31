import { DraggableId, DraggableLocation } from "react-beautiful-dnd";

export type Id = string;

export interface AuthorColors {
  soft: string;
  hard: string;
};

export interface Author {
  id: Id;
  name: string;
};

export interface Quote {
  id: Id,
  content: string,
};

export interface Dragging {
  id: DraggableId,
  location: DraggableLocation,
};

export interface QuoteMap {
  [key: string]: Quote[],
};

export interface Task {
  id: Id,
  content: string,
};
