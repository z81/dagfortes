import { IMapItem } from "./IMapItem";
export interface ILayer {
  name: string;
  // startx: number;
  // starty: number;
  map: Map<number, Map<number, IMapItem>>;
}
