import { Sprite } from "./Sprite";
import { loadImage } from "./utils";

interface ISpritePackArgs {
  url: string;
  framesCount: number;
  lineCount: number;
}

export class SpritePack {
  private url: string;
  public image: HTMLImageElement;
  public framesCount: number;
  public lineCount: number = 1;

  constructor({ url, framesCount, lineCount }: ISpritePackArgs) {
    this.url = url;
    this.framesCount = framesCount;
    this.lineCount = lineCount;
    this.image = document.createElement("img");
  }

  public load(): Promise<HTMLImageElement> {
    return loadImage(this.url, this.image);
  }

  public createSprite({ line, endFrame }: { line: number; endFrame: number }) {
    const { image, framesCount, lineCount, url } = this;
    return new Sprite({
      image,
      framesCount,
      lineCount,
      line,
      endFrame,
      url
    });
  }
}
