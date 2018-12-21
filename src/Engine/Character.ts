import { SpriteAnimation, PlayerSkin } from "./";

export enum Direction {
  Up = "Up",
  Down = "Down",
  Left = "Left",
  Right = "Right"
}

export enum CharStates {
  Idle = "idle",
  walk = "walk"
}

export class Character {
  public speed = 7.5;
  private walkLeftAnimation!: SpriteAnimation;
  private walkRightAnimation!: SpriteAnimation;
  private walkUpAnimation!: SpriteAnimation;
  private walkDownAnimation!: SpriteAnimation;
  private direction = Direction.Left;
  private state = CharStates.Idle;
  private position: { x: number; y: number } = { x: 0, y: 0 };
  private prevRenderTime = 0;
  private beforeMoveCallback = (x: number, y: number): boolean => true;
  private skin: PlayerSkin;
  private animations = {
    walkLeft: () => this.walkLeftAnimation,
    walkRight: () => this.walkRightAnimation,
    walkUp: () => this.walkUpAnimation,
    walkDown: () => this.walkDownAnimation
  };

  constructor({ skin, speed = 7.5 }: { skin: PlayerSkin; speed: number }) {
    this.skin = skin;
    this.speed = speed;
  }

  public async loadSkin() {
    await this.skin.load();

    this.walkLeftAnimation = SpriteAnimation.from(
      this.skin.walkLeftSprite,
      0.5
    );
    this.walkRightAnimation = SpriteAnimation.from(
      this.skin.walkRightSprite,
      0.5
    );
    this.walkUpAnimation = SpriteAnimation.from(this.skin.walkTopSprite, 0.5);
    this.walkDownAnimation = SpriteAnimation.from(this.skin.walkBotSprite, 0.5);
  }

  public getSprite = () => {
    return this.getAnimation().getSprite();
  };

  public getAnimation = () => {
    if (this.state === CharStates.walk) {
      return this.animations[`${this.state}${this.direction}`]();
    } else {
      return this.animations[`walk${this.direction}`]();
    }
  };

  public setDirection(direction: Direction) {
    this.direction = direction;
  }

  public rotateСlockwise() {
    if (this.direction === Direction.Up) this.direction = Direction.Right;
    else if (this.direction === Direction.Down) this.direction = Direction.Left;
    else if (this.direction === Direction.Left) this.direction = Direction.Up;
    else if (this.direction === Direction.Right)
      this.direction = Direction.Down;
  }

  public setState(state: CharStates) {
    if (state === this.state) return;

    Object.keys(this.animations).forEach(name => {
      const anim = this.animations[name]();

      if (state === CharStates.Idle) {
        anim.stop();
      } else {
        anim.play();
      }
    });

    this.state = state;
  }

  public getState() {
    return this.state;
  }

  public getDirection() {
    return this.direction;
  }

  public beforeRender() {
    const time = +Date.now();

    if (this.state === CharStates.walk && this.prevRenderTime > 0) {
      const offset = this.speed / (time - this.prevRenderTime);
      this.move(offset);
    }

    this.prevRenderTime = time;
  }

  public move(offset: number) {
    let { x, y } = this.position;

    if (this.direction === Direction.Up) y -= offset;
    if (this.direction === Direction.Down) y += offset;
    if (this.direction === Direction.Right) x += offset;
    if (this.direction === Direction.Left) x -= offset;

    if (this.beforeMoveCallback(x, y)) {
      this.position.x = x;
      this.position.y = y;
    }
  }

  public get x() {
    return this.position.x;
  }

  public get y() {
    return this.position.y;
  }

  public beforeMoveHook(callback: (x: number, y: number) => boolean) {
    this.beforeMoveCallback = callback;
  }
}
