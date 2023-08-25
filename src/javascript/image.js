export let image = new Image();

export function readLocalFile(event) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = () => reject("Failed to upload image");
    reader.readAsDataURL(event.target.files[0]);
  });
}

export function loadImage(imageData) {
  image.src = imageData;

  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject("Failed to load image");
  });
}

export function isPng(imageData) {
  return imageData.startsWith("data:image/png");
}

export function is512x512() {
  return image.width === 512 && image.height === 512 ? true : false;
}

export async function convertFormat(image) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = image.width;
  canvas.height = image.height;

  context.drawImage(image, 0, 0);

  let newImageData = canvas.toDataURL("image/png");

  return [await loadImage(newImageData), newImageData];
}
