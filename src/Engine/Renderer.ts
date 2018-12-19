import { Canvas } from "./Canvas";
import { Tile } from "./Tile";
import { Sprite } from "./Sprite";

export class Renderer {
  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  public drawTile(tile: Tile, x: number, y: number) {
    const { width, height } = tile;
    this.canvas.context.drawImage(tile.image, tile.x, tile.y, width, height, x, y, width, height);
  }

  public fillTile(tile: Tile) {
    const { width, height } = tile;

    for(let x = 0; x < this.canvas.width / width; x++) {
      for(let y = 0; y < this.canvas.height / height; y++) {
        this.drawTile(tile, x * width, y * height);
      }
    }
  }

  public renderSprite(sprite: Sprite, x: number, y: number) {
    const { framesCount, image, frame, lineCount, line } = sprite;
    const width = image.width / framesCount;
    const height = image.height / lineCount;

    this.canvas.context.drawImage(image, frame * width, height * line, width, height, x, y, width, height);
  }
}