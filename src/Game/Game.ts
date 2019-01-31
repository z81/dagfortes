import { Canvas, Renderer, SpriteAnimation, GameMap } from '../Engine';
import { Player } from './Player';
import { mainTiles, mainTiles2, mainTiles3 } from './Tiles';
import { LoadingScreen } from './LoadingScreen';
import { loadImage } from '../Engine/utils';
import { mainAudioTheme, stepSandAudio } from './Audio';
import { AssetsLoader } from './AssetsLoader';
import { coinSpinAnimation, coinSpinSprite, itemAnimations } from './Items';
import { Clouds } from './Clouds';

export class Game {
	private gridSize = 32;
	private canvas: Canvas = new Canvas('#app');
	private renderer: Renderer = new Renderer(this.canvas);
	private map: GameMap = new GameMap();
	private player: Player = new Player();
	private hearthImage?: HTMLImageElement;
	private clouds?: Clouds;
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
			() => this.map.loadFromUrl('../maps/main.json'),
			() => this.player.loadSkin(),
			() => mainAudioTheme.load(),
			() => stepSandAudio.load(),
			() => coinSpinSprite.load(),
			() => this.clouds!.load()
		);

		assetLoader
			.add<HTMLImageElement>(() => loadImage('../sprites/heartshealth.png'))[0]
			.then((img) => (this.hearthImage = img));

		for await (const item of assetLoader.loadAll()) {
			this.loadingScreen.progress += Math.round(100 / assetLoader.size);
		}

		this.loadingScreen.setText('Click me');
	}

	private async init() {
		this.clouds = new Clouds(this.canvas.context);

		await this.loadAssets();

		this.map.setPacks(mainTiles, mainTiles2, mainTiles3);
		this.map.parseMap();

		this.canvas.resize(this.canvasSize.width, this.canvasSize.height);
		this.player.char.beforeMoveHook(this.beforeMoveHook);
		this.player.addAudioEffect('stepSand', stepSandAudio);

		stepSandAudio.setVolume(5);
		mainAudioTheme.setVolume(20);

		const start = () => {
			this.loadingScreen.hide();
			mainAudioTheme.play();
			coinSpinAnimation.play();
			requestAnimationFrame(this.render);
			document.removeEventListener('click', start);
		};
		document.addEventListener('click', start, false);
	}

	private beforeMoveHook = (x: number, y: number) => this.isPlayerCollision(x, y);

	private isWall = (x: number, y: number) => {
		const obj = this.map.getObjects(x, y);
		return obj && obj.length && obj[0].type === 'wall';
	};

	private isPlayerCollision(x: number, y: number) {
		const cx = this.canvas.width / 2;
		const cy = this.canvas.height / 2;
		const realPlayerPosX = -this.mapRenderOffset.x + x + cx;
		const realPlayerPosY = -this.mapRenderOffset.y + y + cy;

		const fx1 = realPlayerPosX + this.gridSize + this.player.width / 2;
		const fx2 = realPlayerPosX + this.gridSize - this.player.width / 2;
		const fy1 = realPlayerPosY + this.gridSize * 2 + this.player.height / 2;
		const fy2 = realPlayerPosY + this.gridSize * 2 - this.player.height / 2;

		return !(this.isWall(fx1, fy1) || this.isWall(fx1, fy2) || this.isWall(fx2, fy1) || this.isWall(fx2, fy2));
	}

	private renderCharacter = () => {
		const character = this.player.char;
		const { width, height } = this.canvas;

		this.renderer.renderSprite(character.getSprite(), width / 2, height / 2);
	};

	private renderItem = (x: number, y: number, name: string) =>
		this.renderer.renderSprite(
			itemAnimations.get(name)!.getSprite(),
			x + this.mapRenderOffset.x - this.player.char.x,
			y + this.mapRenderOffset.y - this.player.char.y
		);

	private render = () => {
		const character = this.player.char;
		const { context, width, height } = this.canvas;
		const hearthDrawWidth = 125;

		SpriteAnimation.beforeRender();
		character.beforeRender();

		// clear
		context.fillRect(0, 0, width, height);
		context.fillStyle = '#05012b';

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

					if (
						zLevel === 2 &&
						Math.abs(px - this.canvas.width / 2) < this.gridSize &&
						Math.abs(py - this.canvas.height / 2) < this.gridSize * 2
					) {
						context.globalAlpha = 0.6;
					}

					this.renderer.drawTile(tile, px, py);
					context.globalAlpha = 1;
				});
			});

			if (zLevel === 1) {
				this.renderCharacter();
			}
		});

		this.map.items.forEach(({ type, x, y }) => {
			if (type !== '') {
				this.renderItem(x, y, type);
			}
		});

		// render night
		// context.globalAlpha = 0.8;
		// context.fillRect(0, 0, width, height);
		// context.globalAlpha = 1;

		this.clouds!.render(-character.x, -character.y);

		// WIP
		// {
		//   const radius = 320;
		//   const fogRadiusStart = radius / 5;
		//   const fogEndColor = "rgba(0,0,0,1)";
		//   const x = width / 2 + this.player.width * 2;
		//   const y = height / 2 + this.player.height * 2;

		//   const grd = context.createRadialGradient(
		//     x,
		//     y,
		//     fogRadiusStart,
		//     x,
		//     y,
		//     radius
		//   );
		//   grd.addColorStop(0, "transparent");
		//   grd.addColorStop(1, fogEndColor);

		//   context.beginPath();
		//   context.fillStyle = fogEndColor;
		//   context.rect(0, 0, width, height);
		//   context.arc(x, y, radius, 0, 2 * Math.PI);
		//   context.fill("evenodd");

		//   context.fillStyle = grd;
		//   context.arc(x, y, radius, 0, 2 * Math.PI);
		//   context.fill();

		//   const charCenterX = this.canvas.width / 2 + this.player.width * 3;
		//   const charCenterY = this.canvas.height / 2 + this.player.height * 12;

		//   // context.fillRect(charCenterX, charCenterY, 5, 5);
		//   context.fillStyle = "black";

		//   this.map.objects.forEach(({ type, x, y, width, height }) => {
		//     if (type === "wall") {
		//       // const ax = Math.round(x + mapOffsetX - character.x);
		//       // const ay = Math.round(y + mapOffsetY - character.y);
		//       // const { zx, zy } = this.getProjectionToCharacter(ax, ay);

		//       const patches = [
		//         [x, y], // left top
		//         [x, y + height], // left bottom
		//         [x + width, y + height], // right bottom
		//         [x + width, y] // right top
		//       ].map(([x, y]) => {
		//         const ax = Math.round(x + mapOffsetX - character.x);
		//         const ay = Math.round(y + mapOffsetY - character.y);

		//         return {
		//           ax,
		//           ay,
		//           ...this.getProjectionToCharacter(ax, ay)
		//         };
		//       });

		//       const [
		//         leftTopPoint,
		//         leftBottomPoint,
		//         rightBottomPoint,
		//         rightTopPoint
		//       ] = patches;

		//       const isPointIncludeX =
		//         charCenterX > leftTopPoint.ax && charCenterX < rightTopPoint.ax;

		//       const isPointIncludeY =
		//         charCenterY > leftTopPoint.ay && charCenterY < rightTopPoint.ay;

		//       context.beginPath();

		//       // context.moveTo(patches[0].ax, patches[0].ay);

		//       // patches.forEach(({ ax, ay, zx, zy }, i) => {
		//       //   context.lineTo(ax, ay);
		//       // });

		//       // context.lineTo(patches[0].ax, patches[0].ay);
		//       const points = [];

		//       if (!isPointIncludeX && !isPointIncludeY) {
		//         if (
		//           (charCenterX > rightTopPoint.ax &&
		//             charCenterY > rightBottomPoint.ay) ||
		//           (charCenterX < leftTopPoint.ax &&
		//             charCenterY < leftBottomPoint.ay)
		//         ) {
		//           points.push([rightTopPoint.ax, rightTopPoint.ay]);
		//           points.push([rightTopPoint.zx, rightTopPoint.zy]);
		//           points.push([leftBottomPoint.zx, leftBottomPoint.zy]);
		//           points.push([leftBottomPoint.ax, leftBottomPoint.ay]);
		//           points.push([leftTopPoint.ax, leftTopPoint.ay]);
		//           points.push([rightTopPoint.ax, rightTopPoint.ay]);
		//         }

		//         if (
		//           (charCenterX > rightTopPoint.ax &&
		//             charCenterY < rightTopPoint.ay) ||
		//           (charCenterX < rightTopPoint.ax &&
		//             charCenterY > leftBottomPoint.ay)
		//         ) {
		//           points.push([leftTopPoint.ax, leftTopPoint.ay]);
		//           points.push([leftTopPoint.zx, leftTopPoint.zy]);
		//           points.push([leftBottomPoint.zx, leftBottomPoint.zy]);
		//           points.push([leftBottomPoint.ax, leftBottomPoint.ay]);
		//           points.push([leftTopPoint.ax, leftTopPoint.ay]);
		//         }
		//       } else {
		//         if (isPointIncludeX) {
		//           const isTop = charCenterY > leftTopPoint.ay;

		//           const starPoint = isTop ? leftTopPoint : leftBottomPoint;
		//           const endPoint = isTop ? rightTopPoint : rightBottomPoint;

		//           points.push([starPoint.ax, starPoint.ay]);
		//           points.push([starPoint.zx, starPoint.zy]);
		//           points.push([endPoint.zx, endPoint.zy]);
		//           points.push([endPoint.ax, endPoint.ay]);
		//           points.push([starPoint.ax, starPoint.ay]);
		//         }

		//         if (isPointIncludeY) {
		//           const isRight = charCenterX > leftTopPoint.ax;

		//           const starPoint = isRight ? rightTopPoint : leftTopPoint;
		//           const endPoint = isRight ? rightBottomPoint : leftBottomPoint;

		//           points.push([starPoint.ax, starPoint.ay]);
		//           points.push([starPoint.zx, starPoint.zy]);
		//           points.push([endPoint.zx, endPoint.zy]);
		//           points.push([endPoint.ax, endPoint.ay]);
		//           points.push([starPoint.ax, starPoint.ay]);
		//         }
		//       }

		//       if (points.length > 0) {
		//         context.moveTo(points[0][0], points[0][1]);
		//       }

		//       points.forEach(([x, y], i) => {
		//         // if (i === 2 && (ax >= charCenterX && ay >= charCenterY)) return;
		//         // if (i === 1 && ay + height < charCenterY) return;
		//         // if (i === 3 && ay + height < charCenterY) return;

		//         context.lineTo(x, y);
		//       });

		//       // context.lineTo(patches[0].zx, patches[0].zy);

		//       // patches.forEach(({ zx, zy }, i) => {
		//       //   context.lineTo(zx, zy);
		//       // });

		//       context.fill();
		//     }
		//   });
		// }
		// blur

		// context.filter = 'blur(5px)';
		// context.fillStyle = 'white';
		// context.fillRect(150 + Math.sin(Date.now() / 100000) * 1000, 150, 10, 10);
		// context.filter = 'none';

		// render hearth
		if (this.hearthImage) {
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
		}

		requestAnimationFrame(this.render);
	};

	private getProjectionToCharacter(ax: number, ay: number) {
		const bx = this.canvas.width / 2 + this.player.width * 3;
		const by = this.canvas.height / 2 + this.player.height * 12;

		const t = 100;

		const dx = ax - bx;
		const dy = ay - by;

		const zx = bx + dx * t;
		const zy = by + dy * t;

		return { ax, ay, bx, by, zx, zy };
	}
}
