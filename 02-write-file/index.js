const { stdin, stdout, exit } = process;
const fs = require('fs');
const path = require('path');
const content = process.argv.slice(2);

stdout.write('Привет, введите ваш текс\n');

stdin.on('data', (data) => {
  fs.writeFile(path.join(__dirname, 'text.txt'), data, (error) => {
    if (error) {
      throw error;
    } else {
      console.log('Файл создан');
      exit();
    }
  });
});
