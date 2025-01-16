const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'output.txt');

const writableStream = fs.createWriteStream(filePath, { flags: 'a' }); // флаг для добавления, а не перезаписывания текста в файле

process.stdout.write(
  'Добро пожаловать! Введите текст для записи в файл. Для выхода введите "exit" или нажмите Ctrl+C.\n',
);

process.stdin.setEncoding('utf-8');

// Обработчик события ввода данных
process.stdin.on('data', (data) => {
  const input = data.trim();
  if (input.toLowerCase() === 'exit') {
    process.stdout.write('До свидания! Программа завершена.\n');
    writableStream.end();
    process.exit(0);
  } else {
    // Запись текста в файл
    writableStream.write(input + '\n', (err) => {
      if (err) {
        process.stdout.write(`Ошибка при записи в файл: ${err.message}\n`);
      } else {
        process.stdout.write(
          'Текст записан. Введите еще текст или "exit" для выхода.\n',
        );
      }
    });
  }
});

// Обработчик сигнала Ctrl+C
process.on('SIGINT', () => {
  process.stdout.write('\nДо свидания! Программа завершена.\n');
  writableStream.end();
  process.exit(0);
});
