const fs = require('fs');
const path = require('path');

const srcFolder = path.join(__dirname, 'files'); // Исходная папка
const destFolder = path.join(__dirname, 'files-copy'); // Папка назначения

// Функция для копирования директории
function copyDir(src, dest) {
  // создание папки, куда будет произведено копирование (если не создана)
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) {
      return console.error(`Ошибка создания директории: ${err.message}`);
    }

    // чтение содержимого исходной директории
    fs.readdir(src, { withFileTypes: true }, (err, entries) => {
      if (err) {
        return console.error(`Ошибка чтения директории: ${err.message}`);
      }
      // перебор всех элементов
      entries.forEach((entry) => {
        const srcPath = path.join(src, entry.name); // путь к текущему элементу в исходной папке
        const destPath = path.join(dest, entry.name); // путь к элементу в папке назначения

        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else if (entry.isFile()) {
          fs.copyFile(srcPath, destPath, (err) => {
            if (err) {
              console.error(`Ошибка копирования файла: ${err.message}`);
            }
          });
        }
      });
    });
  });
}

// удаление старой папки перед копированием и запуском
fs.rm(destFolder, { recursive: true, force: true }, (err) => {
  if (err) {
    return console.error(`Ошибка удаления папки: ${err.message}`);
  }
  copyDir(srcFolder, destFolder);
  console.log('Копирование успешно завершено!');
});
