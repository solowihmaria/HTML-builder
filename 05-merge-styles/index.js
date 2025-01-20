const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const bundlePath = path.join(outputDir, 'bundle.css');

function buildCSSBundle() {
  // читаем содержимое папки styles
  fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
    if (err) {
      return console.error('Ошибка при чтении папки:', err);
    }

    let styles = '';

    function processFile(index) {
      if (index >= files.length) {
        // записываем итоговый файл, когда все файлы обработаны
        return fs.writeFile(bundlePath, styles, 'utf-8', (err) => {
          if (err) {
            return console.error('Ошибка при записи файла:', err);
          }
          console.log('Итоговый файл стилей bundle.css успешно создан!');
        });
      }

      const file = files[index];
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesDir, file.name);

        // читаем файл асинхронно
        fs.readFile(filePath, 'utf-8', (err, content) => {
          if (err) {
            return console.error('Ошибка при чтении файла:', err);
          }
          styles += content + '\n';
          processFile(index + 1); // обрабатываем следующий файл
        });
      } else {
        processFile(index + 1); // пропускаем не подходящие файлы
      }
    }

    processFile(0); // запускаем обработку с первого файла
  });
}

buildCSSBundle();
