import { Sprite } from "./Sprite";

export class SpriteAnimation {
  private sprite: Sprite;
  public speed: number;
  private isPlaying: boolean = false;
  public startPlayingTime: number = 0;
  private static animations: Set<SpriteAnimation> = new Set();

  public static beforeRender() {
    const time = Date.now();

    this.animations.forEach(anim => {
      if (!anim.isPlaying) return; // && anim.sprite.endFrame - 1 === anim.sprite.frame

      const { framesCount, endFrame } = anim.sprite;
      const maxFrame = endFrame || framesCount;
      const frame = Math.floor(
        (((time - anim.startPlayingTime) / (anim.speed * 1000)) * maxFrame) %
          maxFrame
      );

      anim.sprite.setFrame(frame);
    });
  }

  public static from(sprite: Sprite, speed: number) {
    const anim = new SpriteAnimation(sprite, speed);
    this.animations.add(anim);

    return anim;
  }

  private constructor(sprite: Sprite, speed: number) {
    this.sprite = sprite;
    this.speed = speed;
  }

  public play() {
    this.startPlayingTime = +Date.now();
    this.isPlaying = true;

    return this;
  }

  public stop() {
    this.isPlaying = false;

    return this;
  }

  public getSprite() {
    return this.sprite;
  }
}
