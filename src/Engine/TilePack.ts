import { Tile } from "./Tile";
import { loadImage } from "./utils";

interface ITilePackConstructorArgs {
  url: string;
  size: number;
}

export class TilePack {
  private image: HTMLImageElement;
  private url: string;
  private gridSize: number;

  constructor({ url, size }: ITilePackConstructorArgs) {
    this.gridSize = size;
    this.url = url;
    this.image = document.createElement("img");
  }

  public load(): Promise<HTMLImageElement> {
    return loadImage(this.url, this.image);
  }

  public createTile(x: number, y: number) {
    const size = this.gridSize;
    return new Tile(this.image, x * size, y * size, size, size);
  }

  public getTile(index: number) {
    const size = this.gridSize;
    const rows = this.image.height / size;
    const cols = this.image.width / size;
    const x = ((index % cols) - 1) * size;
    const y = Math.ceil(index / rows - 1) * size;

    return new Tile(this.image, x, y, size, size);
  }
}
