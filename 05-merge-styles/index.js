const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const bundlePath = path.join(outputDir, 'bundle.css');

function buildCSSBundle() {
  // считаем содержимое папки styles
  fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
    if (err) {
      return console.error('Ошибка при чтении папки:', err);
    }

    const styles = [];

    files.forEach((file) => {
      // проверка что это файл и его расширение css
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesDir, file.name);
        const content = fs.readFileSync(filePath, 'utf-8');

        styles.push(content);
      }
    });

    // записываем объединённые стили в финальный файл, когда они уже оь
    fs.writeFileSync(bundlePath, styles.join('\n'), 'utf-8');

    console.log('Итоговый файл стилей bundle.css успешно создан!');
  });
}

buildCSSBundle();
