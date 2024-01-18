const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, 'files');
const filePathCopy = path.join(__dirname, 'copy_files');

async function copyFolder(from, to) {
  try {
    await fs.mkdir(to, { recursive: true });

    const files = await fs.readdir(from, { withFileTypes: true });

    for (const file of files) {
      const sourcePath = path.join(from, file.name);
      const targetPath = path.join(to, file.name);

      if (file.isDirectory()) {
        await copyFolder(sourcePath, targetPath);
      } else {
        await fs.copyFile(sourcePath, targetPath);
      }
    }

    console.log('Папка с файлами скопирована');
  } catch (error) {
    console.error(error);
  }
}

async function removeFolder(folderPath) {
  try {
    const files = await fs.readdir(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const fileStat = await fs.lstat(filePath);
      if (fileStat.isDirectory()) {
        await removeFolder(filePath);
      } else {
        await fs.unlink(filePath);
      }
    }
    await fs.rmdir(folderPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
    } else {
      console.error(error);
    }
  }
}

(async function () {
  try {
    await removeFolder(filePathCopy);
    await copyFolder(filePath, filePathCopy);
  } catch (error) {
    console.error(error);
  }
})();
