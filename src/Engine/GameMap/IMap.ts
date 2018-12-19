import { Tileset } from "./Tileset";
import { IMapRawLayer } from "./IMapRawLayer";
export interface IMap {
  tilesets: Tileset[];
  layers: IMapRawLayer[];
}
