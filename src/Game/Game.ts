import { Canvas, Renderer, SpriteAnimation, GameMap } from "../Engine";
import { Player } from "./Player";
import { mainTiles, mainTiles2, mainTiles3 } from "./Tiles";
import { LoadingScreen } from "./LoadingScreen";
import { loadImage } from "../Engine/utils";
import { mainAudioTheme, stepSandAudio } from "./Audio";
import { AssetsLoader } from "./AssetsLoader";

export class Game {
  private gridSize = 32;
  private canvas: Canvas = new Canvas("#app");
  private renderer: Renderer = new Renderer(this.canvas);
  private map: GameMap = new GameMap();
  private player: Player = new Player();
  private hearthImage!: HTMLImageElement;
  private loadingScreen = new LoadingScreen();
  private canvasSize = {
    width: this.gridSize * 20,
    height: this.gridSize * 20
  };
  private mapRenderOffset = {
    x: -(this.gridSize * 53),
    y: -(this.gridSize * 11) - 1
  };

  constructor() {
    this.init();
  }

  private async loadAssets() {
    const assetLoader = new AssetsLoader();
    assetLoader.add(
      () => mainTiles.load(),
      () => mainTiles2.load(),
      () => mainTiles3.load(),
      () => this.map.loadFromUrl("../maps/main.json"),
      () => this.player.loadSkin(),
      () => mainAudioTheme.load(),
      () => stepSandAudio.load()
    );

    assetLoader
      .add<HTMLImageElement>(() => loadImage("../sprites/heartshealth.png"))[0]
      .then(img => (this.hearthImage = img));

    for (const item of assetLoader.loadAll()) {
      await item;
      this.loadingScreen.progress += Math.round(100 / assetLoader.size);
    }

    this.loadingScreen.setText("Click me");
  }

  private async init() {
    await this.loadAssets();

    this.map.setPacks(mainTiles, mainTiles2, mainTiles3);
    this.map.parseMap();

    this.canvas.resize(this.canvasSize.width, this.canvasSize.height);
    this.player.char.beforeMoveHook(this.beforeMoveHook);
    this.player.addAudioEffect("stepSand", stepSandAudio);

    stepSandAudio.setVolume(5);
    mainAudioTheme.setVolume(20);

    const start = () => {
      this.loadingScreen.hide();
      mainAudioTheme.play();
      requestAnimationFrame(this.render);
      document.removeEventListener("click", start);
    };
    document.addEventListener("click", start, false);
  }

  private beforeMoveHook = (x: number, y: number) =>
    this.isPlayerCollision(x, y);

  private isWall = (x: number, y: number) => {
    const obj = this.map.getObjects(x, y);
    return obj && obj.length && obj[0].type === "wall";
  };

  private isPlayerCollision(x: number, y: number) {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    const gridSize = 1; // this.gridSize;
    const realPlayerPosX = -this.mapRenderOffset.x + x + cx;
    const realPlayerPosY = -this.mapRenderOffset.y + y + cy;

    const fx1 = realPlayerPosX + this.gridSize + this.player.width / 2;
    const fx2 = realPlayerPosX + this.gridSize - this.player.width / 2;
    const fy1 = realPlayerPosY + this.gridSize * 2 + this.player.height / 2;
    const fy2 = realPlayerPosY + this.gridSize * 2 - this.player.height / 2;

    return !(
      this.isWall(fx1, fy1) ||
      this.isWall(fx1, fy2) ||
      this.isWall(fx2, fy1) ||
      this.isWall(fx2, fy2)
    );
  }

  private renderCharacter = () => {
    const character = this.player.char;
    const { width, height } = this.canvas;

    this.renderer.renderSprite(character.getSprite(), width / 2, height / 2);
  };

  private render = () => {
    const character = this.player.char;
    const { context, width, height } = this.canvas;
    const hearthDrawWidth = 125;

    SpriteAnimation.beforeRender();
    character.beforeRender();

    // clear
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#05012b";

    // render map
    const mapOffsetX = this.mapRenderOffset.x;
    const mapOffsetY = this.mapRenderOffset.y;
    const gridSize = this.gridSize;

    this.map.layers.forEach(({ map }, zLevel) => {
      map.forEach((row, x: number) => {
        if (x <= -mapOffsetX + character.x - gridSize) return;
        if (x >= -mapOffsetX + character.x + width) return;

        row.forEach(({ tile }, y: number) => {
          if (y <= -mapOffsetY + character.y - gridSize) return;
          if (y >= -mapOffsetY + character.y + height) return;

          const px = Math.round(x + mapOffsetX - character.x);
          const py = Math.round(y + mapOffsetY - character.y);

          if (zLevel === 2) {
            if (
              Math.abs(px - this.canvas.width / 2) < this.gridSize &&
              Math.abs(py - this.canvas.height / 2) < this.gridSize * 2
            ) {
              context.globalAlpha = 0.6;
            }
          }

          this.renderer.drawTile(tile, px, py);
          context.globalAlpha = 1;
        });
      });

      if (zLevel === 1) {
        this.renderCharacter();
      }
    });

    // render night
    // context.globalAlpha = 0.8;
    // context.fillRect(0, 0, width, height);
    // context.globalAlpha = 1;

    // render hearth
    context.drawImage(
      this.hearthImage,
      0,
      0,
      hearthDrawWidth,
      45,
      width - hearthDrawWidth - 10,
      height - 60,
      hearthDrawWidth,
      45
    );

    requestAnimationFrame(this.render);
  };
}
