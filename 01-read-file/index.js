const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(filePath, 'utf8');
readableStream.pipe(process.stdout);

// Обработка ошибок
readableStream.on('error', (err) => {
  console.error('Ошибка при чтении файла:', err);
});
