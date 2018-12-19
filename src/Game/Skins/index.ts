import { SpritePack, PlayerSkin } from "../../Engine";

const charSprites = new SpritePack({
  url: "../sprites/player_default.png",
  framesCount: 13,
  lineCount: 21
});

const walkBotSprite = charSprites.createSprite({
  endFrame: 9,
  line: 10
});

const walkTopSprite = charSprites.createSprite({
  endFrame: 9,
  line: 8
});

const walkLeftSprite = charSprites.createSprite({
  endFrame: 9,
  line: 9
});

const walkRightSprite = charSprites.createSprite({
  endFrame: 9,
  line: 11
});

export const playerSkins = {
  default: new PlayerSkin({
    walkBotSprite,
    walkTopSprite,
    walkLeftSprite,
    walkRightSprite,
    charSprites
  })
};
