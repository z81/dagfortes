import { IChunk } from "./IChunk";
import { IObject } from "./IObject";
export interface IMapRawLayer {
  width: number;
  height: number;
  chunks: IChunk[];
  objects: IObject[];
  name: string;
  type: string;
}
