type AssetCallback = () => Promise<any>;

type IAsset = {
  callback: AssetCallback;
  resolve: (value: any) => any;
  reject: (value: any) => any;
};

export class AssetsLoader {
  private assets: IAsset[] = [];

  add = <T>(...callbacks: AssetCallback[]) => {
    const promises = callbacks.map(
      callback =>
        new Promise<T>((resolve, reject) =>
          this.assets.push({
            callback,
            resolve,
            reject
          })
        )
    );

    return promises;
  };

  loadAll = () => {
    const assets = this.assets;

    return {
      [Symbol.iterator]: function*() {
        for (const { callback, resolve, reject } of assets) {
          const promise = callback();
          promise.then(resolve).catch(reject);

          yield promise;
        }
      }
    };
  };

  get size() {
    return this.assets.length;
  }
}
