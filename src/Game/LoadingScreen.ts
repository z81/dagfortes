export class LoadingScreen {
  private node: HTMLDivElement;
  private progressTextNode: HTMLDivElement;
  private progressNodeValue: HTMLDivElement;
  private hideDelayTime = 300;
  private loaderPostfix = "% loading";
  private rootNode = "#preloader";
  private progressValue = 0;

  constructor() {
    this.node = this.getNode();
    this.progressTextNode = this.getNode(".text");
    this.progressNodeValue = this.getNode(".progress .value");
  }

  public show() {
    this.node.style.display = "flex";
  }

  public hide() {
    this.node.style.opacity = "0";
    setTimeout(() => (this.node.style.display = "none"), this.hideDelayTime);
  }

  public setProgress(value: number) {
    this.setText(`${value}${this.loaderPostfix}`);
    this.progressNodeValue.style.width = `${value}%`;
    this.progressValue = value;
  }

  public getProgress() {
    return this.progressTextNode.textContent;
  }

  public setText(value: string) {
    this.progressTextNode.textContent = value;
  }

  public get progress() {
    return this.progressValue;
  }
  public set progress(value: number) {
    this.setProgress(value);
  }

  private getNode = (selector: string = "") => {
    const node = document.querySelector(`${this.rootNode} ${selector}`);
    return node as HTMLDivElement;
  };
}
