const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'secret-folder');

async function getFileName() {
  try {
    const fileArray = await fs.promises.readdir(filePath);
    const files = fileArray.filter(async (file) => {
      const fileStats = await fs.promises.lstat(path.join(filePath, file));
      if (fileStats.isFile()) {
        const fileName = path.basename(file, path.extname(file));
        console.log(`${fileName} - ${path.extname(file)} - ${fileStats.size} bytes`);
      }
    });
    console.log(files);
  } catch (error) {
    console.error(error);
  }
}

getFileName();
