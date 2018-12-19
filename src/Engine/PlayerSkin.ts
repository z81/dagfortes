import { Sprite, SpritePack } from "./";

export class PlayerSkin {
  public readonly walkBotSprite: Sprite;
  public readonly walkTopSprite: Sprite;
  public readonly walkLeftSprite: Sprite;
  public readonly walkRightSprite: Sprite;
  public readonly charSprites: SpritePack;

  constructor({
    walkBotSprite,
    walkTopSprite,
    walkLeftSprite,
    walkRightSprite,
    charSprites
  }) {
    this.walkBotSprite = walkBotSprite;
    this.walkTopSprite = walkTopSprite;
    this.walkLeftSprite = walkLeftSprite;
    this.walkRightSprite = walkRightSprite;
    this.charSprites = charSprites;
  }

  public load() {
    return this.charSprites.load();
  }
}