export class Canvas {
  private node: Element;
  private selector: string;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(selector: string) {
    this.selector = selector;
    this.node = document.querySelector(selector)!;
    this.canvas = document.createElement("canvas");
    this.node.appendChild(this.canvas);
    this.ctx = <CanvasRenderingContext2D>(
      this.canvas.getContext("2d", { antialias: false, depth: false })
    );
  }

  public resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  public autoResize = () => {
    this.resize(window.innerWidth, window.innerHeight);
  };

  public enableAutoResize() {
    this.autoResize();
    window.addEventListener("resize", this.autoResize);
  }

  public get context() {
    return this.ctx;
  }

  public get width() {
    return this.canvas.width;
  }

  public get height() {
    return this.canvas.height;
  }
}
