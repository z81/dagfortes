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

  private render = () => {
    const character = this.player.char;

    SpriteAnimation.beforeRender();
    character.beforeRender();

    this.canvas.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.context.fillStyle = "#05012b";

    this.map.layers.forEach(({ map }) => {
      // Todo: for of
      map.forEach((row, x: number) => {
        if (x <= -this.mapRenderOffset.x + character.x - this.gridSize) return;
        if (x >= -this.mapRenderOffset.x + character.x + this.canvas.width)
          return;

        row.forEach(({ tile }, y: number) => {
          if (y <= -this.mapRenderOffset.y + character.y - this.gridSize)
            return;
          if (y >= -this.mapRenderOffset.y + character.y + this.canvas.height)
            return;

          const px = Math.round(x + this.mapRenderOffset.x - character.x);
          const py = Math.round(y + this.mapRenderOffset.y - character.y);

          this.renderer.drawTile(tile, px, py);
        });
      });
    });

    this.renderer.renderSprite(
      character.getSprite(),
      this.canvas.width / 2,
      this.canvas.height / 2
    );

    this.canvas.context.globalAlpha = 0.8;
    this.canvas.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.context.globalAlpha = 1;

    const hearthDrawWidth = 125;
    this.canvas.context.drawImage(
      this.hearthImage,
      0,
      0,
      hearthDrawWidth,
      45,
      this.canvas.width - hearthDrawWidth - 10,
      this.canvas.height - 60,
      hearthDrawWidth,
      45
    );

    requestAnimationFrame(this.render);
  };
}
