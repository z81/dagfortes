export class Controller {
  private keyDownEvents = new Map();
  private keyEvents = new Map();
  private keyEventsTime = new Map();
  
  public onKeyDown(keyName: string, callback: Function) {
    this.keyDownEvents.set(keyName, callback);
    document.addEventListener('keydown', this.handleKey);
  }

  private handleKey = (e: KeyboardEvent) => {
    if (this.keyDownEvents.has(e.key)) {
      this.keyDownEvents.get(e.key)(e);
    }
  }

  public onKey(eventName: string, callback: (KeyboardEvent) => any) {
    const name = `key${eventName}`;
    //this.keyEvents.set(name, callback);
    document.addEventListener(name, callback);
  }

  // private handleOnceKey = (e: KeyboardEvent) => {
  //   this.keyEvents.get(e.type)(e);
  // }
}