import { SpriteAnimation, Sprite } from "../../Engine";

export const coinSpinSprite = new Sprite({
  url: "../sprites/coin.png",
  endFrame: 6,
  line: 0,
  framesCount: 6,
  lineCount: 1
});

export const coinSpinAnimation = SpriteAnimation.from(coinSpinSprite, 0.5);

export const itemAnimations = new Map([["coin_spawn", coinSpinAnimation]]);
