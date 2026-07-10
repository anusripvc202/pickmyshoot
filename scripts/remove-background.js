import { Jimp } from 'jimp';
import path from 'path';

async function removeBackground(src, dest) {
  console.log(`Processing: ${src} -> ${dest}`);
  const image = await Jimp.read(src);
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  
  // A threshold of 248 is generally safe for "pure white background" generated images
  const threshold = 248;

  image.scan(0, 0, width, height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // Check if the pixel is near white
    if (r > threshold && g > threshold && b > threshold) {
      // Set alpha to 0 (fully transparent)
      this.bitmap.data[idx + 3] = 0;
    }
  });

  // Save the modified image
  await image.write(dest);
  console.log(`Saved transparent image to ${dest}`);
}

async function run() {
  const cameraSrc = "C:\\Users\\ADMIN\\.gemini\\antigravity-ide\\brain\\45d265ae-91ce-429c-b717-39ec9ba34205\\camera_gear_white_bg_1783666263395.png";
  const modelSrc = "C:\\Users\\ADMIN\\.gemini\\antigravity-ide\\brain\\45d265ae-91ce-429c-b717-39ec9ba34205\\fashion_model_white_bg_1783666291362.png";
  
  const cameraDest = path.join("public", "studio_gear_cutout.png");
  const modelDest = path.join("public", "fashion_model_cutout.png");

  try {
    await removeBackground(cameraSrc, cameraDest);
    await removeBackground(modelSrc, modelDest);
    console.log("Background removal complete!");
  } catch (error) {
    console.error("Error removing backgrounds:", error);
  }
}

run();
