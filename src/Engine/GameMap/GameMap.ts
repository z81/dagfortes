import { TilePack } from "../TilePack";
import { IObject } from "./IObject";
import { IMap } from "./IMap";
import { IMapItem } from "./IMapItem";
import { ILayer } from "./ILayer";

export class GameMap {
  public map!: IMap;
  public layers: ILayer[] = [];
  private tileSetsFirstIds: number[] = [];
  private tailPacks: TilePack[] = [];
  private objects: IObject[] = [];

  public setPacks(...packs: TilePack[]) {
    this.tailPacks = packs.reverse();
  }

  public async loadFromUrl(url: string) {
    const request = await fetch(url);
    this.map = await request.json();
  }

  public async loadFromPath(path: string) {
    this.map = await import(path);
  }

  public parseMap() {
    this.tileSetsFirstIds = this.map.tilesets
      .map(({ firstgid }) => firstgid)
      .splice(0, this.tailPacks.length)
      .reverse();

    this.map.layers.forEach(
      ({ width, height, chunks, objects, name, type }, i) => {
        if (name === "objects") return this.parseObjects(objects);
        if (type !== "tilelayer") return;

        const layer = {
          name,
          map: new Map<number, Map<number, IMapItem>>()
        };

        chunks.forEach(({ data, height, width, x, y }) => {
          data.forEach((id, i) => {
            const offsetX = i % width;
            const offsetY = Math.floor(i / height);

            const tile = this.getTile(id);

            const fx = Math.round(x * tile.width + offsetX * tile.width);
            const fy = Math.round(y * tile.height + offsetY * tile.height);

            /**
             * Todo: fix
             */
            if (!layer.map.has(fx)) {
              layer.map.set(fx, new Map());
            }

            if (!layer.map.get(fx)!.has(fy)) {
              layer.map.get(fx)!.set(fy, { id, tile });
            }
          });
        });

        this.layers.push(layer);
      }
    );
  }

  public getObjects = (x: number, y: number) => {
    return this.objects.filter(
      ({ width, height, ...obj }: IObject) =>
        x >= obj.x && x <= obj.x + width && y >= obj.y && y <= obj.y + height
    );
  };

  // public getObject = (x, y) => {
  //   return this.objects.has(x) ? this.objects.get(x).get(y) : null;
  // }

  private parseObjects(objects: IObject[]) {
    this.objects = objects;

    // тут было раскладывание на сетку для оптимизации
    // objects.forEach(({ x, y, width, height, type }) => {
    //   for(let i = 0; i < width / 32; i++) {
    //     for(let j = 0; j < height / 32; j++) {

    //       const fx = x + i;
    //       const fy = y + j;

    //       if (!this.objects.has(fx)) {
    //         this.objects.set(fx, new Map());
    //       }

    //       if (!this.objects.get(fx).has(fy)) {
    //         this.objects.get(fx).set(fy, { type });
    //       }
    //     }
    //   }
    // })
  }

  private getTile = (id: number) => {
    const tilePack = this.tailPacks.find((_, idx) => {
      // const startId = this.tileSetsFirstIds[idx];
      return id === 0 || this.tileSetsFirstIds[idx] <= id;
    })!;

    const tileId = this.tileSetsFirstIds[this.tailPacks.indexOf(tilePack)];
    const tile = tilePack.getTile(id - tileId + 1);

    return tile;
  };

  /**
   * Todo: fix
   */
  public getTileByPos(x: number, y: number, layer: number) {
    const { map } = this.layers[layer];
    if (!map || !map.has(x) || !map.get(x)!.has(y)) return null;

    return map.get(x)!.get(y);
  }
}
