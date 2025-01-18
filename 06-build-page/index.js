const fs = require('fs');
const path = require('path');

// Пути к директориям и файлам
const projectDist = path.join(__dirname, 'project-dist');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const templateFile = path.join(__dirname, 'template.html');
const outputHTML = path.join(projectDist, 'index.html');
const outputCSS = path.join(projectDist, 'style.css');
const outputAssets = path.join(projectDist, 'assets');

// Создание папки project-dist
fs.mkdir(projectDist, { recursive: true }, (err) => {
  if (err) {
    console.error(`Ошибка создания папки project-dist: ${err.message}`);
    return;
  }
  console.log('Папка project-dist создана!');

  // Запуск всех функций для создания и копирования файлов и папок
  createHTMLFile();
  mergeStyles();
  copyAssets(assetsDir, outputAssets);
});

// Проверка на наличие тега в строке файла шаблона
function findTags(template) {
  const tags = [];
  const lines = template.split('\n');

  lines.forEach((line) => {
    let start = line.indexOf('{{');
    while (start !== -1) {
      const end = line.indexOf('}}', start);
      if (end !== -1) {
        const tag = line.slice(start, end + 2); // извлекаем тег включая {{ и }}
        tags.push(tag);
        start = line.indexOf('{{', end);
      } else {
        start = -1;
      }
    }
  });

  return tags;
}

// Создание HTML файла
function createHTMLFile() {
  fs.readFile(templateFile, 'utf-8', (err, template) => {
    if (err) {
      console.error(`Ошибка чтения шаблона: ${err.message}`);
      return;
    }
    // используем функцию для поиска тегов
    const tags = findTags(template);

    if (!tags.length) {
      writeHTML(template);
      return;
    }

    let newHTML = template; // создаем копию шаблона

    // обрабатываем теги по одному
    function processTag(index) {
      if (index >= tags.length) {
        writeHTML(newHTML);
        return;
      }

      const tag = tags[index];
      const componentName = tag.replace(/{{\s*|\s*}}/g, ''); // убираем {{ и }}
      const componentPath = path.join(componentsDir, `${componentName}.html`);

      fs.readFile(componentPath, 'utf-8', (err, content) => {
        if (!err) {
          newHTML = newHTML.split(tag).join(content); // заменяем все вхождения тега
        } else {
          console.error(
            `Ошибка чтения компонента ${componentName}: ${err.message}`,
          );
        }
        processTag(index + 1); // переходим к следующему тегу
      });
    }
    processTag(0); // начинаем обработку с первого тега
  });
}

// Запись HTML в файл
function writeHTML(content) {
  fs.writeFile(outputHTML, content, (err) => {
    if (err) {
      console.error(`Ошибка записи HTML файла: ${err.message}`);
    } else {
      console.log('Объединенный HTML файл создан!');
    }
  });
}

// Объединение стилей
function mergeStyles() {
  fs.readdir(stylesDir, (err, files) => {
    if (err) {
      console.error(`Ошибка чтения папки стилей: ${err.message}`);
      return;
    }

    const cssFiles = files.filter((file) => path.extname(file) === '.css');
    let cssContent = '';

    (function processFile(index) {
      if (index >= cssFiles.length) {
        fs.writeFile(outputCSS, cssContent, (err) => {
          if (err) {
            console.error(`Ошибка записи CSS файла: ${err.message}`);
          } else {
            console.log('Объединенный файл style.css создан!');
          }
        });
        return;
      }

      const filePath = path.join(stylesDir, cssFiles[index]);
      fs.readFile(filePath, 'utf-8', (err, style) => {
        if (err) {
          console.error(`Ошибка чтения файла стилей: ${err.message}`);
        } else {
          cssContent += style + '\n';
        }
        processFile(index + 1);
      });
    })(0);
  });
}

// Копирование папки assets
function copyAssets(src, dest) {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) {
      console.error(`Ошибка создания папки assets: ${err.message}`);
      return;
    }

    fs.readdir(src, { withFileTypes: true }, (err, items) => {
      if (err) {
        console.error(`Ошибка чтения папки assets: ${err.message}`);
        return;
      }

      items.forEach((item) => {
        const srcPath = path.join(src, item.name);
        const destPath = path.join(dest, item.name);

        if (item.isDirectory()) {
          copyAssets(srcPath, destPath);
        } else {
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
