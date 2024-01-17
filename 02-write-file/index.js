const { stdin, stdout, exit } = process;
const fs = require('fs');
const path = require('path');
const content = process.argv.slice(2);

const filePath = path.join(__dirname, 'text.txt');

fs.writeFile(filePath, content.join(''), (error) => {
  if (error) {
    throw error;
  } else {
    inputText();
  }
});

process.on('SIGINT', () => {
  console.log('Ввод данных завершен');
  exit();
});

function inputText() {
  stdout.write(`Введите ваш текст: `);
  stdin.on('data', (data) => {
    if (data.toString().trim() === 'exit') {
      console.log(`Ввод данных завершен`);
      exit();
    } else {
      fs.appendFile(filePath, data, (error) => {
        if (error) {
          throw error;
        } else {
          console.log('Текст успешно добавлен в файл');
        }
      });
    }
  });
}
