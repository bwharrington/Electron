const Jimp = require('jimp');
const path = require('path');

async function createIcon() {
  try {
    // Create a new 256x256 image with a blue background
    const image = new Jimp(256, 256, 0x2B2E3BFF);
    
    // Add a circle
    for (let x = 0; x < 256; x++) {
      for (let y = 0; y < 256; y++) {
        const distanceFromCenter = Math.sqrt(
          Math.pow(x - 128, 2) + Math.pow(y - 128, 2)
        );

        if (distanceFromCenter < 80) {
          image.setPixelColor(0x61DAFBFF, x, y);
        }
      }
    }
    
    // Add a smaller circle in the center
    for (let x = 0; x < 256; x++) {
      for (let y = 0; y < 256; y++) {
        const distanceFromCenter = Math.sqrt(
          Math.pow(x - 128, 2) + Math.pow(y - 128, 2)
        );

        if (distanceFromCenter < 30) {
          image.setPixelColor(0x2B2E3BFF, x, y);
        }
      }
    }
    
    await image.writeAsync(path.join(__dirname, 'assets', 'icon.png'));
    console.log('Icon created successfully');
  } catch (err) {
    console.error('Error creating icon:', err);
  }
}

createIcon();
