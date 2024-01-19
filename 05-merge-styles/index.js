const fs = require('fs').promises;
const path = require('path');

const stylePath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist');

let cssBundle = '';

async function getCssBundle() {
  try {
    const files = await fs.readdir(stylePath);

    for (const file of files) {
      if (path.extname(file) === '.css') {
        const data = await fs.readFile(path.join(stylePath, file));
        cssBundle += data;
      }
    }
  } catch (error) {
    console.log(error);
  }

  await fs.writeFile(path.join(distPath, 'bundle.css'), cssBundle);
}

getCssBundle();
