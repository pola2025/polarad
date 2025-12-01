const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');
const files = fs.readdirSync(imagesDir);

console.log('🖼️  Starting WebP conversion...\n');

async function convertToWebP() {
  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png)$/i)) {
      const inputPath = path.join(imagesDir, file);
      const outputPath = path.join(imagesDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

      try {
        const stats = fs.statSync(inputPath);
        const originalSize = (stats.size / 1024 / 1024).toFixed(2);

        await sharp(inputPath)
          .webp({ quality: 85 })
          .toFile(outputPath);

        const newStats = fs.statSync(outputPath);
        const newSize = (newStats.size / 1024 / 1024).toFixed(2);
        const savings = ((1 - newStats.size / stats.size) * 100).toFixed(1);

        console.log(`✅ ${file}`);
        console.log(`   ${originalSize}MB → ${newSize}MB (${savings}% smaller)\n`);
      } catch (error) {
        console.error(`❌ Error converting ${file}:`, error.message);
      }
    }
  }

  console.log('🎉 WebP conversion complete!');
}

convertToWebP();
