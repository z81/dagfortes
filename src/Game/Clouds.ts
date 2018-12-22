import { loadImage } from "../Engine/utils";

export class Clouds {
  private cloudsImage!: HTMLImageElement;
  private offsetY = 0;
  private offsetX = 0;
  private imageHeight = 1000;
  private imageWidth = 1000;

  constructor(private context: CanvasRenderingContext2D) {
    setInterval(() => {
      //this.offsetY++;

      //if (this.offsetY % 4 === 0) {
      this.offsetX--;
      //}

      if (this.offsetX === -this.imageWidth) {
        this.offsetX = -40;
      }
    }, 1000 / 10);
  }

  public async load() {
    this.cloudsImage = await loadImage("../clouds.png");
  }

  private drawImage(
    x: number,
    y: number,
    width: number,
    height: number,
    scale = 2
  ) {
    this.context.drawImage(
      this.cloudsImage,
      -x + this.offsetX,
      -y,
      this.context.canvas.width / scale,
      this.context.canvas.height / scale,
      width / scale,
      height / scale,
      this.context.canvas.width,
      this.context.canvas.height
    );
  }

  render(x: number, y: number) {
    this.context.globalAlpha = 1;
    this.context.globalCompositeOperation = "difference";

    this.drawImage(x, y, 0, 0, 1);
    this.drawImage(x - this.context.canvas.width * 1.5, y, 0, 0, 1);

    this.context.globalAlpha = 1;
    this.context.globalCompositeOperation = "screen";

    for (let i = 0; i < 2; i++) {
      this.drawImage(x, y, 0, 0, 2);
      this.drawImage(x - this.context.canvas.width * 1.5, y, 0, 0, 2);
    }

    this.context.globalCompositeOperation = "source-over";
    this.context.globalAlpha = 1;
  }
}
