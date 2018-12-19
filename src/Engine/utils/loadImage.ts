export const loadImage = (
  url: string,
  img?: HTMLImageElement
): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = img || document.createElement("img");
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
