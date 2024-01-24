const fs = require('fs').promises;
const path = require('path');

const distPath = path.join(__dirname, 'project-dist');
const assetsPath = path.join(__dirname, 'assets');
const assetsDistPath = path.join(__dirname, 'project-dist', 'assets');

async function htmlBuild() {
  try {
    await removeFolder(distPath);
    await createFolder();
    await copyFolder(assetsPath, assetsDistPath);
    await getCssBundle();
    await replaceTemplates();
  } catch (error) {
    console.log(error);
  }
}

async function createFolder() {
  try {
    await fs.mkdir(path.join(distPath));
    await fs.mkdir(path.join(assetsDistPath));
  } catch (error) {
    console.log(error);
  }
}

async function removeFolder(folderPath) {
  try {
    await fs.access(folderPath);

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
  } catch (error) {
    console.error(error);
  }
}

async function getCssBundle() {
  let cssBundle = '';
  const cssPath = path.join(__dirname, 'styles');
  try {
    const files = await fs.readdir(cssPath);

    for (const file of files) {
      if (path.extname(file) === '.css') {
        const data = await fs.readFile(path.join(cssPath, file));
        cssBundle += data;
      }
    }
  } catch (error) {
    console.log(error);
  }
  await fs.writeFile(path.join(distPath, 'style.css'), cssBundle);
}

async function replaceTemplates() {
  try {
    const templatePath = path.join(__dirname, 'template.html');
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const componentsPath = path.join(__dirname, 'components');

    const templates = {};
    const files = await fs.readdir(componentsPath);
    for (const file of files) {
      const templateName = file.split('.')[0];
      templates[templateName] = await fs.readFile(path.join(componentsPath, file), 'utf-8');
    }

    let updatedTemplate = templateContent;
    Object.keys(templates).forEach((templateName) => {
      updatedTemplate = updatedTemplate.replace(new RegExp('{{' + templateName + '}}', 'g'), templates[templateName]);
    });

    await fs.writeFile(path.join(distPath, 'index.html'), updatedTemplate);
  } catch (error) {
    console.log(error);
  }
}
htmlBuild();
