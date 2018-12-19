import { loadImage } from "./utils";

interface ISpriteConstructorArgs {
  url?: string;
  image?: HTMLImageElement;
  framesCount: number;
  lineCount: number;
  line: number;
  endFrame: number;
}

export class Sprite {
  private url?: string;
  public image: HTMLImageElement;
  public framesCount: number;
  public frame: number = 0;
  public endFrame: number;
  public lineCount: number = 1;
  public line: number = 1;

  constructor({
    url,
    framesCount,
    lineCount,
    line,
    endFrame,
    image
  }: ISpriteConstructorArgs) {
    this.url = url;
    this.framesCount = framesCount;
    this.endFrame = endFrame;
    this.lineCount = lineCount;
    this.line = line;
    this.image = image || document.createElement("img");
  }

  public load(): Promise<HTMLImageElement> {
    if (!this.url) {
      throw Error("Sprite url is undefined");
    }

    return loadImage(this.url, this.image);
  }

  public next() {
    this.frame++;

    if (this.frame >= (this.endFrame || this.framesCount)) {
      this.frame = 0;
    }
  }

  public setFrame(frame: number) {
    this.frame = frame;
  }
}
