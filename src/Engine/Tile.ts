export class Tile {
  public image: HTMLImageElement;
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  constructor(image: HTMLImageElement, x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
  }
}